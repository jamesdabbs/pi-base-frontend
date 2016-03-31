import React from 'react'
import { connect } from 'react-redux'

import * as fetch from '../fetch'
import * as P from '../reducers/properties'
import * as Traits from '../reducers/traits'

import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import PropertyTraitItem from './property/TraitItem'


const Property = React.createClass({
    componentWillMount() {
        this.props.loadProperty()
    },
    render() {
        const { property, traits} = this.props

        if (!property) { return <Spinner/> }

        return (
            <Tex>
                <h1>{property.name}</h1>
                <Markdown text={property.description}/>
                <TraitList title="Examples" traits={traits} ItemComponent={PropertyTraitItem}/>
            </Tex>
        )
    }
})

export default connect(
    (state, ownProps) => {
        const property = P.find(state, ownProps.params.id)

        return {
            property: property,
            traits:   Traits.forProperty(state, property).sortBy(t => t.space.name)
        }
    },
    (dispatch, ownProps) => {
        return {
            loadProperty: () => dispatch(fetch.property(ownProps.params.id))
        }
    }
)(Property)
