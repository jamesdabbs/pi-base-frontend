import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Spinner from '../Spinner'

import * as P from '../../queries/properties'

const PropertyLink = ({ space_id, property_id, property }) => {
    return <Link to={`/spaces/${space_id}/properties/${property_id}`}>
        {property && property.name}
    </Link>
}

export default connect(
    (state, ownProps) => {
        return { property: P.find(state, ownProps.property_id) }
    }
)(PropertyLink)
