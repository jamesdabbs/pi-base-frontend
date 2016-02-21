import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';

import App from './components/App'
import Search from './components/Search'

import piBase from './reducers'

let store = createStore(piBase)

const routes = <Route path="/" component={App}>
  <Route path="search" component={Search} />
</Route>

ReactDOM.render(
  <Provider store={store}>
      <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
