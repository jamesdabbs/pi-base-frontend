import { Map } from 'immutable'
import Fuse from 'fuse.js'

import * as fetch from '../fetch'

const initial = Map().merge({
    entities: {}
})

export function propertyNames(state) {
    return state.properties.get('entities').map(p => p.name)
}

const loadProperties = fetch.properties.reduceWith(data => {
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

export default function properties(state=initial, action) {
    return loadProperties(state, action)
}
