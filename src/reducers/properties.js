import { Map, fromJS } from 'immutable'
import Fuse from 'fuse.js'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

const initial = fromJS({entities: {}})

const processFetchAll = fetch.properties.reduceWith((state, data) => {
    const names = data.map(p => ({ id: p.id, name: p.name }))
    const pairs = data.map(p =>
        [Number(p.id), Map({ id: p.id, name: p.name })]
    )
    const finder = new Fuse(names, {
        caseSensitive: false,
        shouldSort:    true,
        keys:          ['name'],
        id:            'id',
        threshold:     0.7
    })
    return state.mergeDeep({
        entities:    Map(pairs),
        fuzzyFinder: finder
    })
})

const processFetchOne = fetch.property.reduceWith((state, data) => {
    const entry = Map().set( Number(data.id), Map(data) )
    return state.mergeDeep({entities: entry})
})

export default pipelineReducers([
    processFetchAll,
    processFetchOne
], initial)
