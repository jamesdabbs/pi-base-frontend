import React from 'react'
import { connect } from 'react-redux'

import * as S      from '../queries/spaces'
import * as Traits from '../queries/traits'

import { loadSpace } from '../actions'

import AutoloadMixin from '../mixins/Autoload'
import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import SpaceTraitItem from './space/TraitItem'

const Space = React.createClass({
    mixins: [AutoloadMixin],
    render() {
        const { space, traits } = this.props

        if (space === undefined) { return <Spinner/> }

        return (
            <Tex>
                <h1>{space.name}</h1>
                <Markdown text={space.description}/>
                <TraitList title="Properties" traits={traits} ItemComponent={SpaceTraitItem}/>
            </Tex>
        )
    }
})

export default connect(
    (state, { params }) => {
        const space = S.find(state, params.id)

        return {
            space:  space,
            traits: Traits.forSpace(state, space).sortBy(t => t.property.name)
        }
    },
    (dispatch, ownProps) => {
        return {
            load: ({ id }) => dispatch(loadSpace(id))
        }
    }
)(Space)
