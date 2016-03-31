import React from 'react'
import { connect } from 'react-redux'

import * as S from '../reducers/spaces'

import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import SpaceTraitItem from './space/TraitItem'

const Space = ({ space, traits }) => {
    if (space === undefined || traits === undefined) { return <Spinner/> }

    return (
        <Tex>
            <h1>{space.name}</h1>
            <Markdown text={space.description}/>
            <TraitList title="Properties" traits={traits} ItemComponent={SpaceTraitItem}/>
        </Tex>
    )
}

export default connect(
    (state, ownProps) => {
        // TODO: this (and sim. in Property) should probably dispatch
        const space = S.load(state, ownProps.params.id)

        return {
            space:  space,
            traits: S.traitsForSpace(state, space).sortBy(t => t.property.name)
        }
    }
)(Space)
