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
import Space from './components/Space'

import piBase from './reducers'

const loggerMiddleware = createLogger()

let store = createStore(piBase, undefined, applyMiddleware(
    thunkMiddleware,
    loggerMiddleware // TODO: mute form change events
))

const routes = <Route path="/" component={App}>
    <Route path="spaces" component={Spaces}>
        <Route path=":id" component={Space}/>
    </Route>
    <Route path="login" component={Login} />
    <Route path="search" component={Search} />
</Route>

ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
