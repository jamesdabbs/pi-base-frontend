import { List } from 'immutable'

import * as S from './spaces'
import * as P from './properties'

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
