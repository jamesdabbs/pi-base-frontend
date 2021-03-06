import React from 'react'
import { Link } from 'react-router'

import TraitTick from '../TraitTick'

const TraitItem = ({trait}) => {
    return <span>
        <TraitTick trait={trait}/>
        <Link to={`/properties/${trait.property.id}`}>{trait.property.name}</Link>
    </span>
}

export default TraitItem
