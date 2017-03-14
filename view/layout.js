import React from 'react'
import ReactDOM from 'react-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import CSS from '../css/layout.sass'

@observer
export default class Layout extends React.Component {
  render() {
    return (
      <div id='layout' className={CSS.layout}>
        {this.props.children}
        {/*<DevTools />*/}
      </div>
    )
  }
}
