import { Map, Set } from 'immutable'

import { SEARCH } from '../actions'
import * as Formula from '../formula'

import * as P from './properties'

const initial = Map().merge({
    q: "",
    parsedFormula: null // Store the last valid formula so results don't flicker as we're inputting them
})

const search = (state=initial, action) => {
    switch (action.type) {
    case SEARCH:
        let formula, updates = { q: action.q }

        if (formula = Formula.parse(action.q)) {
            updates.parsedFormula = formula
        }

        return state.merge(updates)
    default:
        return state
    }
}

export default search

export const examples = [
    "compact + connected",
    "first countable + separable + ~second countable"
]

export const query = (state) => state.search.get("q")

export const results = (state) => {
    return resultsForFormula(state, parsedFormula(state))
}

export function formulaWithProperties(state) {
    const idFormula = addIds(state, parsedFormula(state))
    if (idFormula) {
        return idFormula.propertyMap(id => P.find(state, id))
    }
}

export function propertyNameSuggestions(state, fragment, limit) {
    let finder = state.properties.get('fuzzyFinder')
    if (finder && fragment) {
        let ids = finder.search(fragment)
        limit = limit || ids.length
        return lookupEntitiesById(state.properties, ids.slice(0, limit))
    } else {
        return []
    }
}

export function counterexamples(state, antecedent, consequent) {
    if (!antecedent || !consequent) { return Set() }

    const implication = new Formula.Conjunction([
        antecedent,
        Formula.negate(consequent)
    ])

    return resultsForFormula(state, implication)
}

const parsedFormula = (state) => state.search.get('parsedFormula')

const lookupEntitiesById = (map, ids) => {
    return ids.map(id => map.getIn(['entities', parseInt(id)]).toJS())
}

const resultsForFormula = (state, formula) => {
    if (!formula) { return Set() }

    const pFormula = addIds(state, formula)
    const matchingSpaceIds = searchForSpaceIdsByFormula(state, pFormula)
    return lookupEntitiesById(state.spaces, matchingSpaceIds).sortBy(s => s.name)
}

function searchForSpaceIdsByFormula(state, formula) {
    if (!formula) { return Set() }

    if (formula.and) {
        return formula.and.
            map(f => searchForSpaceIdsByFormula(state, f)).
            reduce((f1,f2) => f1.intersect(f2))
    } else if (formula.or) {
        return formula.or.
            map(f => searchForSpaceIdsByFormula(state, f)).
            reduce((f1,f2) => f1.union(f2))
    } else if (formula.property) {
        let ps = ""+formula.property
        return state.traits.filter((props, spaceId) => {
            return props && props.get(ps) === formula.value
        }).keySeq().toSet()
    }
}

function addIds(state, formula) {
    if (!formula) { return }

    const finder = state.properties.get('fuzzyFinder')
    return formula.propertyMap(property => {
        // TODO: collect errors if there are no matches
        //       disambiguate when unsure?
        return finder.search(property)[0]
    })
}
