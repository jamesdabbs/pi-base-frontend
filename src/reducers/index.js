import { combineReducers } from 'redux'

import { LOGIN, LOGOUT } from '../actions'

const user = (state=null, action) => {
    switch (action.type) {
    case LOGIN:
        return action.email
    case LOGOUT:
        return null
    default:
        return state
    }
}

const properties = (state=[], action) => {
    return state
}

const piBase = combineReducers({
    user,
    properties
})

export default piBase
