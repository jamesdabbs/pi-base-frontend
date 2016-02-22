import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { LOGIN, LOGOUT, REQUEST_PROPERTIES, RECEIVE_PROPERTIES, RECEIVE_PROPERTIES_FAILED } from '../actions'

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

const properties = (state=[], action) => {
    switch (action.type) {
    case REQUEST_PROPERTIES:
        return Object.assign({}, state, {
            fetching: true
        })
    case RECEIVE_PROPERTIES:
        return Object.assign({}, state, {
            fetching: false,
            list: action.properties
        })
    case RECEIVE_PROPERTIES_FAILED:
        return Object.assign({}, state, {
            fetching: false
        })
    default:
        return state
    }
}

const spaces = (state={ spaces: [], page: 0 }, action) => {
    return state
}

const piBase = combineReducers({
    user,
    token,
    properties,
    spaces,
    form: formReducer
})

export default piBase
