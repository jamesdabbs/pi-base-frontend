import { fromJS } from 'immutable'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

const initial = fromJS({
    entities: {}
})

const processFetchAll = fetch.theorems.reduceWith((state, data) => {
    const updates = {}
    data.forEach(theorem => {
        updates[theorem.id] = {
            id:         theorem.id,
            antecedent: theorem.antecedent,
            consequent: theorem.consequent
        }
    })
    return state.mergeDeepIn(['entities'], fromJS(updates))
})

const processFetchOne = fetch.theorem.reduceWith((state, data) => {
    const updates = {}
    updates[data.id] = {
        description:    data.description,
        implied_traits: data.implied_traits
    }
    return state.mergeDeepIn(['entities'], fromJS(updates))
})

export default pipelineReducers([
    processFetchAll,
    processFetchOne
], initial)
