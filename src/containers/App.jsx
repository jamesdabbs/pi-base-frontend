import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { refreshProperties, loginWithToken, logout, fetchSpaces, fetchProperties, fetchTraits } from '../actions'
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
        this.props.fetchSpaces()
        this.props.fetchProperties()
        this.props.fetchTraits()

        const token = tokenFromHash() || tokenFromStorage()
        if (token) { this.props.login(token) }
    }

    render() {
        return (
            <div>
                <Navbar user={this.props.user} logout={this.props.logout} />
                <div className="container">
                    {this.props.flash.message
                        ? <div className={"alert alert-" + this.props.flash.klass}>{this.props.flash.message}</div>
                        : ""}
                    {this.props.children}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user:  state.user,
        token: state.token,
        flash: state.flash
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        login:  (token) => { dispatch(loginWithToken(token)) },
        logout: () => { dispatch(logout()) },

        fetchTraits:     () => { dispatch(fetchTraits())     },
        fetchSpaces:     () => { dispatch(fetchSpaces())     },
        fetchProperties: () => { dispatch(fetchProperties()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
