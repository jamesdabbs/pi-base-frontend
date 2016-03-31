import { Map } from 'immutable'

import * as fetch from '../fetch'

import * as S from './spaces'
import * as P from './properties'

const processFetchAll = fetch.traits.reduceWith((state, data) => state.merge(data))

export default function traits(state=Map(), action) {
    return processFetchAll(state, action)
}

export function forSpace(state, space) {
    if (!space) { return [] }

    const traitMap = state.traits.get(''+space.id)
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

    state.traits.entrySeq().forEach(([spaceId, propMap]) => {
        if (spaceId === `fetching`) { return }

        const value = propMap.get(''+property.id)

        if (value !== undefined) {
            const space = S.find(state, spaceId)
            result.push({ space, property, value })
        }
    })

    return result
}
