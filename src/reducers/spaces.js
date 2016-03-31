import { Map, List } from 'immutable'

import { SELECT_SPACE } from '../actions'
import * as fetch from '../fetch'
import { pipelineReducers } from '../util'

const initial = Map().merge({
    entities:   {},
    pageIds:    [],
    selectedId: null,
    activePage: null,
    totalPages: null,
    totalItems: null
})

export function page(state) {
    const es = state.spaces.get('entities')
    return state.spaces.get('pageIds').map(id => es.get(id))
}
export function activePage(state) {
    return state.spaces.get('activePage')
}
export function totalPages(state) {
    return state.spaces.get('totalPages')
}
export function totalItems(state) {
    return state.spaces.get('totalItems')
}
export function selectedSpace(state) {
    const id = state.spaces.get('selectedId')
    return state.spaces.getIn(['entities', id])
}
export function traitsForSpace(state, space) {
    if (!space) { return [] }

    const traitMap = state.traits.get(''+space.id)
    if (!traitMap) { return [] }

    let results = []
    traitMap.entrySeq().forEach(([propertyId,value]) => {
        if (propertyId === `fetching`) { return }
        const property = state.properties.getIn(['entities', Number(propertyId)])
        results.push({ space, property, value })
    })
    return results
}

export function load(state, spaceId) {
    const space = state.spaces.getIn(['entities', Number(spaceId)])
    if (space) {
        return space
    } else {
        return { id: spaceId, loading: true }
    }
}

const loadSpaces = fetch.spaces.reduceWith(data => {
    return { entities: Map(data.map((space) => [space.id, space])) }
})

const loadSpace = fetch.space.reduceWith(data => {
    const result = { entities: {} }
    result.entities[data.id] = data
    return result
})

const others = (state=initial, action) => {
    switch (action.type) {
    case SELECT_SPACE:
        return state.set("selectedId", action.spaceId)
    default:
        return state
    }
}

export default pipelineReducers([
    loadSpaces,
    loadSpace,
    others
])
