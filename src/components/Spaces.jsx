import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'

import * as S from '../reducers/spaces'

import Markdown from './Markdown'
import Tex from './Tex'

const SpaceItem = (space) => (
    <div>
        <h3><Link to={`/spaces/${space.id}`}>{space.name}</Link></h3>
        <Markdown>{space.description}</Markdown>
    </div>
)

const Spaces = React.createClass({
    getInitialState: function() {
        return { page: 1 }
    },

    componentWillMount: function() {
        this.props.setPage(1)
    },

    handlePageSelect: function(ev,e) {
        ev.preventDefault()
        this.props.setPage(e.eventKey)
    },

    page: function() {
        return this.props.spaces.slice((this.state.page - 1) * 20, 20)
    },

    render: function() {
        const { spaces } = this.props

        return (
            <div>
                <Pagination
                    items      = {this.props.spaces.length}
                    maxButtons = {7}
                    first      = {true}
                    prev       = {true}
                    next       = {true}
                    last       = {true}
                    activePage = {this.state.page}
                    onSelect   = {this.handlePageSelect}
                />
                <h1>
                    Spaces {' '}
                    {spaces.length ? <span className="badge">{spaces.length}</span> : ''}
                </h1>
                <Tex>
                  {this.page().map(space => <SpaceItem key={space.id} {...space}/>)}
                </Tex>
            </div>
        )
    }
})

export default connect(
    (state) => ({
        spaces: state.spaces.get('entities').valueSeq().toJS().sortBy(s => s.name)
    }),
    (dispatch) => ({
        setPage: (n) => console.log('should change to page', n)
    })
)(Spaces)
