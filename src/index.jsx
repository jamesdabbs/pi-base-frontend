import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { makeStore } from './store'
import routes from './components/Routes'

import extensions from './extensions'

const store = makeStore()

ReactDOM.render(
  <Provider store={store}>{routes}</Provider>,
  document.getElementById('app')
);
