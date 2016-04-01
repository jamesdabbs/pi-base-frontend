import { List, Map, fromJS } from 'immutable'

import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

import * as S from './spaces'
import * as P from './properties'

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
], Map())

export function find(state, spaceId, propertyId) {
    const key = List([Number(spaceId), Number(propertyId)])
    const found = state.traits.getIn(['entities', key])

    if (!found) { return found }

    return found.merge({
        space: S.find(state, spaceId),
        property: P.find(state, propertyId)
    }).toJS()
}

export function forSpace(state, space) {
    if (!space) { return [] }

    const traitMap = state.traits.getIn(['table', ''+space.id])
    if (!traitMap) { return [] }

    let results = []
    traitMap.entrySeq().forEach(([propertyId,value]) => {
        // FIXME: better way of handling this vvv
        if (propertyId === `fetching`) { return }

        const property = P.find(state, propertyId)
        results.push({ space, property, value })
    })
    return results
}

export function forProperty(state, property) {
    // TODO: don't do a scan here?
    let result = []

    state.traits.get('table').entrySeq().forEach(([spaceId, propMap]) => {
        if (spaceId === `fetching`) { return }

        const value = propMap.get(''+property.id)

        if (value !== undefined) {
            const space = S.find(state, spaceId)
            result.push({ space, property, value })
        }
    })

    return result
}
