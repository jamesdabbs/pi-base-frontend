import React, { Component } from 'react'
import { connect } from 'react-redux'

import { focusSpace } from '../actions'
import * as S from '../reducers/spaces'

import Spinner from './Spinner'
import Properties from './space/Properties'
import Tex from './tex'


const Space = ({space, traits}) => {
    if (!space.name || !traits) { return <Spinner/> }

    return (
        <Tex>
            <h1>{space.name}</h1>
            <div>{space.description}</div>
            <Properties space={space} traits={traits}/>
        </Tex>
    )
}

export default connect(
    (state, ownProps) => {
        const id = ownProps.params.id
        const space = S.load(state, id)

        return {
            space:  space,
            traits: S.traitsForSpace(state, space),
        }
    }
)(Space)
