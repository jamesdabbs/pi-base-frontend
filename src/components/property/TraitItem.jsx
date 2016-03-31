import React from 'react'
import { Link } from 'react-router'

import TraitTick from '../TraitTick'

const TraitItem = ({ trait }) => {
    return <span>
        <TraitTick trait={trait}/>
        <Link to={`/spaces/${trait.space.id}`}>{trait.space.name}</Link>
    </span>
}

export default TraitItem
