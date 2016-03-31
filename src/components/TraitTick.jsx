import React from 'react'
import { Link } from 'react-router'

const TraitTick = ({ trait }) => {
    const iconClass = trait.value ? `ok` : `remove`

    return <Link to={`/spaces/${trait.space.id}/properties/${trait.property.id}`}>
        <i className={`trait glyphicon glyphicon-${iconClass}`}/>
    </Link>
}

export default TraitTick
