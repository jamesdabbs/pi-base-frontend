import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

import App    from './App'
import Login  from './Login'
import Search from './Search'
import Spaces from './Spaces'
import Space  from './Space'

const routes = <Router history={browserHistory}>
    <Route path="/" component={App}>
        <Route path="spaces" component={Spaces} />
        <Route path="spaces/:id" component={Space} />
        <Route path="login" component={Login} />
        <Route path="search" component={Search} />
    </Route>
</Router>

export default routes
