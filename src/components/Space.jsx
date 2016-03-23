import React, { Component } from 'react'
import { connect } from 'react-redux'

import { focusSpace } from '../actions'
import * as S from '../reducers/spaces'

class Space extends Component {
    componentWillMount() {
        this.props.loadSpace(this.props.params.id)
    }

    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
                <div>{this.props.description}</div>
            </div>
        )
    }
}

export default connect(
    (state) => (S.selectedSpace(state) || {}),
    (dispatch) => ({
        loadSpace: (spaceId) => (dispatch(focusSpace(spaceId)))
    })
)(Space)
