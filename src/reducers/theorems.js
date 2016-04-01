import { Map, fromJS } from 'immutable'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

import * as Formula from '../formula'
import * as Property from './properties'

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
    return state.mergeIn(['entities'], fromJS(updates))
})

export function find(state, id) {
    const found = state.theorems.getIn(['entities', ''+id])
    if (!found) { return }

    const fix = (f) => Formula.map(f, id => Property.find(state, id))

    return found.merge({
        antecedent: fix(found.get('antecedent').toJS()),
        consequent: fix(found.get('consequent').toJS())
    }).toJS()
}

export default pipelineReducers([
    processFetchAll
], initial)
