import React from 'react'
import { connect } from 'react-redux'

import * as P from '../queries/properties'
import * as Traits from '../queries/traits'
import { loadProperty } from '../actions'

import AutoloadMixin from '../mixins/Autoload'
import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import PropertyTraitItem from './property/TraitItem'


const Property = React.createClass({
    mixins: [AutoloadMixin],
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
            load: () => dispatch(loadProperty(ownProps.params.id))
        }
    }
)(Property)
