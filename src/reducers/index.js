import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { LOGIN, LOGOUT, FLASH_WARNING, SEARCH } from '../actions'

import spaces from './spaces'
import traitLookup from './traitLookup'

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
    search,
    traitLookup,
    form: formReducer
})

export default piBase
