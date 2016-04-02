import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { LOGIN, LOGOUT, FLASH_WARNING } from '../actions'

import spaces     from './spaces'
import properties from './properties'
import traits     from './traits'
import theorems   from './theorems'
import search     from './search'

const flash = (state, action) => {
    state = state || {}

    switch (action.type) {
    case FLASH_WARNING:
        return { klass: 'warning', message: action.message }
    default:
        return state
    }
}

const user = (state, action) => {
    switch (action.type) {
    case LOGIN:
        return action.user
    case LOGOUT:
        return null
    default:
        return state
    }
}

const token = (state, action) => {
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
    theorems,
    search,
    form: formReducer
})

export default piBase
