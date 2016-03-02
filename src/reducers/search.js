import { Map, List } from 'immutable'

import { SEARCH } from '../actions'
import * as Formula from '../formula'

const initial = {
    q:                       "",
    formula:                 null,
    selectedSuggestionIndex: null
}

const search = (state=initial, action) => {
    switch (action.type) {
    case SEARCH:
        var nu = {q: action.q}
        nu.formula = Formula.parse(action.q) || state.formula
        return nu
    default:
        return state
    }
}

export default search

const lookupIds = (map, ids) => {
    return ids.map(id => map.getIn(['entities', parseInt(id)]))
}

export function byFormula(state) {
    let ids = searchForSpaceIdsByFormula(state, propertyIdFormula(state))
    return lookupIds(state.spaces, ids)
}

function searchForSpaceIdsByFormula(state, formula) {
    if (!formula) { return List() }

    if (formula.and) {
        return formula.and.
            map(f => searchForSpaceIdsByFormula(state, f)).
            reduce((f1,f2) => f1.intersect(f2))
    } else if (formula.or) {
        return formula.or.
            map(f => searchForSpaceIdsByFormula(state, f)).
            reduce((f1,f2) => f1.union(f2))
    } else if (formula.property) {
        return state.traits.filter((props, spaceId) => (
            props[formula.property] === formula.value
        )).keySeq().toSet()
    }
}

export function propertyNameSuggestions(state, fragment, limit) {
    let finder = state.properties.get('fuzzyFinder')
    if (finder) {
        fragment = fragment || state.search.q
        let ids = finder.search(fragment)
        limit = limit || ids.length
        return lookupIds(state.properties, ids.slice(0, limit))
    } else {
        return []
    }
}

export function propertyIdFormula(state) {
    let finder = state.properties.get('fuzzyFinder')
    return Formula.map(state.search.formula, (p) => {
        // TODO: collect errors if there are no matches
        //       disambiguate when unsure?
        return finder.search(p)[0]
    })
}

export function normalizedFormula(state) {
    let propNames = properties.propertyNames(state)
    return Formula.map(propertyIdFormula(state), (atom) => {
        return propNames.get(parseInt(atom.property))
    })
}
