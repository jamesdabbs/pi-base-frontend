import { Map, fromJS } from 'immutable'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

const initial = fromJS({entities: {}})

const processFetchAll = fetch.spaces.reduceWith((state, data) => {
    const pairs = data.map(space =>
        [Number(space.id), Map({ id: space.id, name: space.name })]
    )
    return state.mergeDeep({entities: Map(pairs)})
})

const processFetchOne = fetch.space.reduceWith((state, data) => {
    const entry = Map().set( Number(data.id), Map(data) )
    return state.mergeDeep({entities: entry})
})

export default pipelineReducers([
    processFetchAll,
    processFetchOne
], initial)
