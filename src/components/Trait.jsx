import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as P from '../queries/properties'
import * as T from '../queries/traits'
import { loadTrait } from '../actions'

import Tex from './Tex'
import Spinner from './Spinner'

import AutoloadMixin from '../mixins/Autoload'
import TheoremLink from './links/Theorem'
import PropertyLink from './links/Property'

const Proof = ({ space_id, proof }) => {
    return <div>
        <ul>
            {proof.theorems.map(id =>
                <li key={`t${id}`}>
                    <TheoremLink id={id}/>
                </li>
            )}
            {proof.properties.map(({ property_id, value }) =>
                <li key={`p${property_id}`}>
                    {value === false ? `¬` : ``}
                    <PropertyLink space_id={space_id} property_id={property_id}/>
                </li>
            )}
        </ul>
    </div>
}

const Trait = React.createClass({
    mixins: [AutoloadMixin],
    render: function() {
        const { trait } = this.props

        if (!trait || !trait.space || !trait.property) { return <Spinner/> }

        const label = trait.value === false ? `¬` : ``

        return <Tex>
            <h1>
                <Link to={`/spaces/${trait.space.id}`}>{trait.space.name}</Link>
                {': '}
                {label}
                <Link to={`/properties/${trait.property.id}`}>{trait.property.name}</Link>
            </h1>
            <section>{trait.description}</section>
            {trait.proof ? <Proof space_id={trait.space.id} proof={trait.proof}/> : ''}
        </Tex>
    }
})

export default connect(
    (state, { params }) => {
        return {
            trait: T.find(state, params.spaceId, params.propertyId)
        }
    },
    (dispatch, ownProps) => {
        return {
            load: ({ spaceId, propertyId }) => dispatch(loadTrait(spaceId, propertyId))
        }
    }
)(Trait)
