import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'

const render = Component => {
  console.log('render')
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('main'))
}

render(App)

if (module.hot) {
  module.hot.accept('./app', () => {
    render(App)
  })
}
