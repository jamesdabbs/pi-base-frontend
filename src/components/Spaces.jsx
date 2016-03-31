import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'

import * as S from '../reducers/spaces'

import Markdown from './Markdown'
import Tex from './Tex'

const SpaceItem = (space) => (
    <div>
        <h3><Link to={"/spaces/" + space.id}>{space.name}</Link></h3>
        <Markdown>{space.description}</Markdown>
    </div>

)

class Spaces extends Component {
    componentWillMount() {
        this.props.setPage(1)
        this.handlePageSelect = this.handlePageSelect.bind(this)
    }

    handlePageSelect(ev,e) {
        ev.preventDefault()
        this.props.setPage(e.eventKey)
    }

    render() {
        const { spaces } = this.props

        return (
            <div>
                <Pagination
                    items      = {this.props.totalPages}
                    maxButtons = {7}
                    first      = {true}
                    prev       = {true}
                    next       = {true}
                    last       = {true}
                    activePage = {this.props.activePage}
                    onSelect   = {this.handlePageSelect}
                />
                <h1>
                    Spaces
                    <span className="badge">{this.props.totalItems}</span>
                </h1>
                <Tex>
                  {spaces.map(space => <SpaceItem key={space.id} {...space}/>)}
                </Tex>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        spaces: state.spaces.get('entities').valueSeq().toJS().sortBy(s => s.name)
    }),
    (dispatch) => ({
        setPage: (n) => console.log('should change to page', n)
    })
)(Spaces)
