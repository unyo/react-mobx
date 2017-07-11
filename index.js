import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('main'))
}

render(App)

if (module.hot) {
  module.hot.accept('./app', () => {
    const nextApp = require('./app').default
    render(nextApp)
  })
}
