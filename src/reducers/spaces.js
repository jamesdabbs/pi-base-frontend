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
    if (space) {
        return state.traits.get(''+space.id)
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
