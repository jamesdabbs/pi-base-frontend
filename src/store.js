import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

const loggerMiddleware = createLogger({
    predicate: (getState, action) => (
        // true
        !action.type.endsWith("/CHANGE")
    )
})

export const makeStore = (state) => {
    return createStore(reducer, state, applyMiddleware(
        // loggerMiddleware,
        thunkMiddleware
    ))
}
