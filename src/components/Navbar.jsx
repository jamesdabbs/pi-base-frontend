import React from 'react'
import { Link } from 'react-router'

const LoggedIn = ({ user, logout }) => (
    <ul className="nav navbar-nav pull-right">
        <li><a>{user.ident}</a></li>
        <li onClick={logout}><a>Logout</a></li>
    </ul>
)

const LoggedOut = () => (
    <ul className="nav navbar-nav pull-right">
        <li><Link to="/login">Login</Link></li>
    </ul>
)


const Navbar = ({ user, logout }) => (
    <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
            <a className="navbar-brand">Pi-Base</a>
            <ul className="nav navbar-nav">
                <li><Link to="/spaces">Spaces</Link></li>
            </ul>
            { user ? <LoggedIn user={user} logout={logout}/> : <LoggedOut /> }
        </div>
    </nav>
)

export default Navbar
