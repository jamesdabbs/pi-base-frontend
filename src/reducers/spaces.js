import { Map, List } from 'immutable'

import { FETCH_SPACES, FETCH_SPACE, SELECT_SPACE, handleFetch } from '../actions'

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

export default function spaces(state=initial, action) {
    switch (action.type) {
    case FETCH_SPACES:
        return handleFetch(state, action, (state, data) => {
            return {
                entities: Map(data.map((space) => [space.id, space]))
            }
        })
    case FETCH_SPACE:
        return handleFetch(state, action, (state, data) => state.setIn(["entities", data.id], data))
    case SELECT_SPACE:
        return state.set("selectedId", action.spaceId)
    default:
        return state
    }
}
