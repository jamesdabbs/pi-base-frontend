import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as S from '../../queries/spaces'
import * as P from '../../queries/properties'

// TODO: unifiy all these links, along with the "TraitItem"s
const TraitLink = ({ trait, space, property }) => {
    if (!space || !property) { return <span/> }

    const label = trait.value === false ? '¬' : ''

    return <span>
        <Link to={`/spaces/${space.id}`}>{space.name}</Link>
        {': '}{label}
        <Link to={`/spaces/${space.id}/properties/${property.id}`}>{property.name}</Link>
    </span>
}

export default connect(
    (state, { trait }) => {
        return {
            space:    S.find(state, trait.space_id),
            property: P.find(state, trait.property_id)
        }
    }
)(TraitLink)
