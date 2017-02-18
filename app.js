// material-ui stuff
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, hashHistory, IndexRoute } from 'react-router'

const history = window.location.hostname.indexOf('.') ? hashHistory : browserHistory

import Layout from './view/layout'
import Index from './view/index'

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

module.exports = render((
  <Router history={history}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Index} />
      <Route path='index' component={Index} onEnter={requireAuth} />
      <Route path='login' component={Index} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('main'))
