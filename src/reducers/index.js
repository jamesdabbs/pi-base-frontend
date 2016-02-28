import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Map, List } from 'immutable'

import { LOGIN, LOGOUT, FLASH_WARNING, SEARCH } from '../actions'

import spaces from './spaces'
import properties from './properties'
import traits from './traits'

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

const search = (state=null, action) => {
    switch (action.type) {
    case SEARCH:
        return action.q
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
        // TODO: union of lists
    } else if (formula.or) {
        // TODO: intersection of lists
    } else if (formula.property) {
        return state.traits.filter((props, spaceId) => (
            props[formula.property] === formula.value
        )).keySeq()
    }
}

export function searchByFormula(state, formula) {
    return searchForSpaceIdsByFormula(state, formula).
        map(spaceId => state.spaces.getIn(['entities', parseInt(spaceId)]))
}
