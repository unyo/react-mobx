import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, hashHistory, IndexRoute } from 'react-router'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Provider } from 'mobx-react'
// views
import Layout from './view/layout'
import Index from './view/index'
// models
import Model from './model/index'
// history
const history = window.location.hostname.indexOf('.') ? hashHistory : browserHistory
const routingStore = new RouterStore()
const stores = {
  // Key can be whatever you want
  router: routingStore,
  // ...other stores
  model: new Model(),
}
const syncHistory = syncHistoryWithStore(history, routingStore);
// route actions
// https://github.com/reactjs/react-router/tree/master/examples/auth-flow
function requireAuth(nextState, replace) {
  if (!localStorage['auth_token']) {
    replace({
      pathname: '/login',
      query: { nextPathname: nextState.location.pathname },
    })
    return false
  }
  return true
}
// render
render((
  <Provider {...stores}>
    <Router history={syncHistory}>
      <Route path='/' component={Layout}>
        <IndexRoute component={Index} />
        <Route path='index' component={Index} onEnter={requireAuth} />
        <Route path='login' component={Index} onEnter={requireAuth} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('main'))
