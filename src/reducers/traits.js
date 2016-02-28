import { Map } from 'immutable'

import { FETCH_TRAITS, handleFetch } from '../actions'

export default function traits(state=Map(), action) {
    switch (action.type) {
    case FETCH_TRAITS:
        return handleFetch(state, action, (state, data) => {
            return Map(data)
        })
    default:
        return state
    }
}
