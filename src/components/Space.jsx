import React, { Component } from 'react'
import { connect } from 'react-redux'

import { focusSpace } from '../actions'
import * as S from '../reducers/spaces'

const SpaceProperties = ({properties}) => (
    // {properties.keys().map(id => <li key={id}>{properties[id].name}</li>)}
    <ul>
    </ul>
)

class Space extends Component {
    componentWillMount() {
        this.props.loadSpace(this.props.params.id)
    }

    render() {
        const { space, traits, properties } = this.props

        return (
            <div>
                <h1>{space && space.name}</h1>
                <div>{space && space.description}</div>

                <h2>Properties</h2>
                {properties
                    ? <SpaceProperties properties={properties}/>
                    : ''}
            </div>
        )
    }
}

export default connect(
    (state) => {
        const space = S.selectedSpace(state)
        return {
            space:      space,
            traits:     S.traitsForSpace(state, space),
            properties: state.properties && state.properties.get('entities').toJS() // FIXME: this belongs elsewhere
        }
    },
    (dispatch) => ({
        loadSpace: (spaceId) => (dispatch(focusSpace(spaceId)))
    })
)(Space)
