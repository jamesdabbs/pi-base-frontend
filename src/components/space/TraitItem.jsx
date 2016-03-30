import React from 'react'
import { Link } from 'react-router'

export default ({space, property, value}) => {
    const label = value ? property.name : `~${property.name}`

    return (
        <li key={property.id}>
            <Link to={`/spaces/${space.id}/properties/${property.id}`}>{label}</Link>
        </li>
    )
}
