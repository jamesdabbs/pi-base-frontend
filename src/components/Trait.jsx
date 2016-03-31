import React from 'react'

import Spinner from './Spinner'

const Trait = ({ trait }) => {
    if (!trait) { return <Spinner/> }
}

export default Trait
