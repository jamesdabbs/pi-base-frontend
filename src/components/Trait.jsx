import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Formula from './Formula'
import Tex from './Tex'
import Spinner from './Spinner'
import * as P from '../reducers/properties'
import * as T from '../reducers/traits'
import * as Theorem from '../reducers/theorems'
import { loadTrait } from '../actions'

const _TheoremLink = ({ id, theorem }) => {
    if (!theorem) { return <Spinner/> }

    return <Link to={`/theorems/${id}`}>
        <Formula formula={theorem.antecedent} link={false}/>
        {' ⇒ '}
        <Formula formula={theorem.consequent} link={false}/>
    </Link>
}
const TheoremLink = connect(
    (state, ownProps) => {
        return { theorem: Theorem.find(state, ownProps.id) }
    }
)(_TheoremLink)

const _PropertyLink = ({ space_id, property_id, name }) => {
    return <Link to={`/spaces/${space_id}/properties/${property_id}`}>{name}</Link>
}
const PropertyLink = connect(
    (state, ownProps) => {
        return { name: P.find(state, ownProps.property_id).name }
    }
)(_PropertyLink)


const Proof = ({ space_id, proof }) => {
    return <div>
        <ul>
            {proof.theorems.map(id => <li key={`t${id}`}><TheoremLink id={id}/></li>)}
            {proof.properties.map(({ property_id, value }) =>
                <li key={`p${property_id}`}><PropertyLink space_id={space_id} property_id={property_id}/></li>
            )}
        </ul>
    </div>
}

const Trait = React.createClass({
    componentDidMount() {
        this.props.loadTrait(this.props.params)
    },
    componentWillReceiveProps({ params }) {
        if (this.props.params !== params) {
            this.props.loadTrait(params)
        }
    },
    render() {
        const { trait } = this.props
        const label = '' // TODO: true or false

        if (!trait || !trait.space || !trait.property) { return <Spinner/> }

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
            loadTrait: ({ spaceId, propertyId }) => dispatch(loadTrait(spaceId, propertyId))
        }
    }
)(Trait)
