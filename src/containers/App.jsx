import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { refreshProperties, loginWithToken, logout } from '../actions'
import Navbar from '../components/Navbar'

const tokenFromHash = () => {
    if (location && location.hash && location.hash.startsWith('#token=')) {
        return location.hash.replace(/^#token=/, '')
    }
}

const tokenFromStorage = () => {
    if (localStorage) { return localStorage.getItem("pi-base-session-token") }
}

class App extends Component {
    componentDidMount() {
        //this.props.dispatch(refreshProperties())

        const token = tokenFromHash() || tokenFromStorage()
        if (token) { this.props.login(token) }
    }

    render() {
        return (
            <div>
                <Navbar user={this.props.user} logout={this.props.logout} />
                <div className="container">{this.props.children}</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user:  state.user,
        token: state.token
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        login:  (token) => { dispatch(loginWithToken(token)) },
        logout: () => { dispatch(logout()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
