import React from 'react'
import { connect } from 'react-redux'

import * as S from '../reducers/spaces'
import * as Traits from '../reducers/traits'
import * as fetch from '../fetch'

import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'
import TraitList from './TraitList'
import SpaceTraitItem from './space/TraitItem'

const Space = React.createClass({
    componentWillMount() {
        this.props.loadSpace()
    },
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
    (state, ownProps) => {
        const space = S.find(state, ownProps.params.id)

        return {
            space:  space,
            traits: Traits.forSpace(state, space).sortBy(t => t.property.name)
        }
    },
    (dispatch, ownProps) => {
        return {
            loadSpace: () => dispatch(fetch.space(ownProps.params.id))
        }
    }
)(Space)
