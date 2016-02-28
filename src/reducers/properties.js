import { Map } from 'immutable'

import { FETCH_PROPERTIES, handleFetch } from '../actions'

const initial = Map().merge({
    entities: {}
})

export function propertyNames(state) {
    return state.properties.get('entities').map(p => p.name)
}

export default function properties(state=initial, action) {
    switch (action.type) {
    case FETCH_PROPERTIES:
        return handleFetch(state, action, (state, data) => ({
            entities: Map(data.map(p => [p.id, p]))
        }))
    default:
        return state
    }
}
