import React from 'react'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'

import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import PropertyTraitItem from './property/TraitItem'


const Property = ({ property, traits}) => {
    if (!property) { return <Spinner/> }

    return (
        <Tex>
            <h1>{property.name}</h1>
            <Markdown text={property.description}/>
            <TraitList title="Examples" traits={traits} ItemComponent={PropertyTraitItem}/>
        </Tex>
    )
}

export default connect(
    (state, ownProps) => {
        const property = P.find(state.properties, ownProps.params.id)

        return {
            property: property,
            traits:   P.traitsForProperty(state, property).sortBy(t => t.space.name)
        }
    }
)(Property)
