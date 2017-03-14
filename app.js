import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link, IndexRoute } from 'react-router-dom'
import { Provider, observer } from 'mobx-react'
import { observable } from 'mobx'

import Layout from './view/layout'
import Index from './view/index'
import Model from './model/index'

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

@observer
export default class App extends React.Component {
  @observable stores = {
    model: new Model(),
  }
  render() {
    return (
      <Provider {...this.stores}>
        <BrowserRouter history={history}>
          <Layout>
            <Route path='/' component={Index} />
            <Route path='/index' component={Index} onEnter={requireAuth} />
            <Route path='/login' component={Index} onEnter={requireAuth} />
          </Layout>
        </BrowserRouter>
      </Provider>
    )
  }
}
