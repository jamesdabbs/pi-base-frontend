import { Map } from 'immutable'

import { FETCH_TRAIT_MAP, handleFetch } from '../actions'

export default function traitLookup(state=Map(), action) {
    switch (action.type) {
    case FETCH_TRAIT_MAP:
        return handleFetch(state, action, (state, data) => {
            console.log(data)
            data
        })
    default:
        return state
    }
}
