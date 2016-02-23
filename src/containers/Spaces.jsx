import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'

import { syncSpacePage } from '../actions.js'

const Space = (space) => (
    <div>
        <h2><Link to={"/spaces/" + space.id}>{space.name}</Link></h2>
        <p>{space.description}</p>
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
        return (
            <div>
                <Pagination
                    items={this.props.page.pages}
                    maxButtons={7}
                    first={true}
                    prev={true}
                    next={true}
                    last={true}
                    activePage={this.props.page.number}
                    onSelect={this.handlePageSelect}/>
                <h1>
                    Spaces
                    <span className="badge">{this.props.page.items}</span>
                </h1>
                {this.props.spaces.map(space => <Space key={space.id} {...space}/>)}
            </div>
        )
    }
}

export default connect(
    (state) => ({
        spaces: state.spaces.list,
        page:   state.spaces.page
    }),
    (dispatch) => ({
        setPage: (n) => { dispatch(syncSpacePage(n)) }
    })
)(Spaces)
