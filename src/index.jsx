import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import App from './containers/App'
import Login from './components/Login'
import Search from './components/Search'
import Spaces from './containers/Spaces'
import Space from './containers/Space'

import piBase from './reducers'

const loggerMiddleware = createLogger({
    predicate: (getState, action) => (
      !action.type.endsWith("/CHANGE")
    )
})

let store = createStore(piBase, undefined, applyMiddleware(
    // loggerMiddleware,
    thunkMiddleware
))

const routes = <Route path="/" component={App}>
    <Route path="spaces" component={Spaces} />
    <Route path="spaces/:id" component={Space} />
    <Route path="login" component={Login} />
    <Route path="search" component={Search} />
</Route>

ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
