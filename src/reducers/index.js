import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Map, List } from 'immutable'

import { LOGIN, LOGOUT, FLASH_WARNING, SEARCH } from '../actions'

import spaces from './spaces'
import properties, { propertyNames }from './properties'
import traits from './traits'
import * as Formula from '../formula'

const flash = (state={}, action) => {
    switch (action.type) {
    case FLASH_WARNING:
        return { klass: "warning", message: action.message }
    default:
        return state
    }
}

const user = (state=null, action) => {
    switch (action.type) {
    case LOGIN:
        return action.user
    case LOGOUT:
        return null
    default:
        return state
    }
}

const search = (state={q: "", formula: null}, action) => {
    switch (action.type) {
    case SEARCH:
        var nu = {q: action.q}
        nu.formula = Formula.parse(action.q) || state.formula
        return nu
    default:
        return state
    }
}

const token = (state=null, action) => {
    switch (action.type) {
    case LOGIN:
        return action.token
    case LOGOUT:
        return null
    default:
        return state
    }
}

const piBase = combineReducers({
    flash,
    user,
    token,
    spaces,
    properties,
    traits,
    search,
    form: formReducer
})

export default piBase

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

export function searchByFormula(state) {
    return searchForSpaceIdsByFormula(state, propertyIdFormula(state)).
        map(spaceId => state.spaces.getIn(['entities', parseInt(spaceId)]))
}

export function propertyIdFormula(state) {
    let names = propertyNames(state).entrySeq()
    return Formula.map(state.search.formula, (p) => {
        let l = p.toLowerCase()
        // TODO: fuzzy match
        let match = names.find(entry => {
            return entry[1].toLowerCase() === l
        })
        if (match) {
            return match[0]
        } else {
            // TODO: need to collect and display name errors
            console.error("Failed to parse property", p)
        }
    })
}

export function normalizedFormula(state) {
    let propNames = properties.propertyNames(state)
    return Formula.map(propertyIdFormula(state), (atom) => {
        return propNames.get(parseInt(atom.property))
    })
}

