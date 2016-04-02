import React from 'react'
import { connect } from 'react-redux'

import * as T from '../queries/theorems'

import { loadTheorem } from '../actions'

import AutoloadMixin from '../mixins/Autoload'
import Formula from './Formula'
import Markdown from './Markdown'
import Spinner from './Spinner'
import Tex from './Tex'

const Theorem = React.createClass({
    mixins: [AutoloadMixin],
    render() {
        const { theorem } = this.props

        if (!theorem) { return <Spinner/> }

        return <Tex>
            <h1>
                <Formula formula={theorem.antecedent} link={true}/>
                {' ⇒ '}
                <Formula formula={theorem.consequent} link={true}/>
            </h1>
            <Markdown text={theorem.description}/>
        </Tex>
    }
})

export default connect(
    (state, { params }) => {
        return {
            theorem: T.find(state, params.id)
        }
    },
    (dispatch, ownProps) => {
        return {
            load: ({ id }) => dispatch(loadTheorem(id))
        }
    }
)(Theorem)
