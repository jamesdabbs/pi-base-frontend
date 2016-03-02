import { Map } from 'immutable'
import Fuse from 'fuse.js'

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
        return handleFetch(state, action, (state, data) => {
            let names = data.map(p => ({ id: p.id, name: p.name }))
            return {
                entities:    Map(data.map(p => [p.id, p])),
                fuzzyFinder: new Fuse(names, {
                    caseSensitive: false,
                    shouldSort:    true,
                    keys:          ['name'],
                    id:            'id',
                    threshold:     0.7
                })
            }
        })
    default:
        return state
    }
}
