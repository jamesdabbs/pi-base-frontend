import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Spinner from '../Spinner'
import Formula from '../Formula'

import * as Theorem from '../../queries/theorems'

const TheoremLink = ({ id, theorem }) => {
    if (!theorem) { return <Spinner/> }

    return <Link to={`/theorems/${id}`}>
        <Formula formula={theorem.antecedent} link={false}/>
        {' ⇒ '}
        <Formula formula={theorem.consequent} link={false}/>
        </Link>
}

export default connect(
    (state, ownProps) => {
        return { theorem: Theorem.find(state, ownProps.id) }
    }
)(TheoremLink)
