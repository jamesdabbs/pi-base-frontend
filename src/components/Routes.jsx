import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

import App           from './App'
import Login         from './Login'
import Search        from './Search'
import Spaces        from './Spaces'
import Space         from './Space'
import Property      from './Property'
import Trait         from './Trait'
import TheoremCreate from './TheoremCreate'

const routes = <Router history={browserHistory}>
    <Route path="/" component={App}>
        <Route path="login" component={Login}/>
        <Route path="search" component={Search}/>

        <Route path="spaces" component={Spaces}/>
        <Route path="spaces/:id" component={Space}/>

        <Route path="properties/:id" component={Property}/>

        <Route path="spaces/:spaceId/properties/:propertyId" component={Trait}/>

        <Route path="theorems/new" component={TheoremCreate}/>
    </Route>
</Router>

export default routes
