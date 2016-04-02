import { List, fromJS } from 'immutable'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

const initial = fromJS({
    entities: {},
    table:    {}
})

const processFetchAll = fetch.traits.reduceWith((state, data) => {
    return state.mergeIn(['table'], data)
})

const processFetchOne = fetch.trait.reduceWith((state, data) => {
    const key = List([data.space_id, data.property_id])
    return state.mergeIn(['entities', key], data)
})

export default pipelineReducers([
    processFetchAll,
    processFetchOne
], initial)
