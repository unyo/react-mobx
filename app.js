import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link, IndexRoute } from 'react-router-dom'
import { Provider } from 'mobx-react'
// views
import Layout from './view/layout'
import Index from './view/index'
// models
import Model from './model/index'
const stores = {
  model: new Model(),
}

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
    <BrowserRouter history={history}>
      <Layout>
        <Route path='/' component={Index} />
        <Route path='/index' component={Index} onEnter={requireAuth} />
        <Route path='/login' component={Index} onEnter={requireAuth} />
      </Layout>
    </BrowserRouter>
  </Provider>
), document.getElementById('main'))
