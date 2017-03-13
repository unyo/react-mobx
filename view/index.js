import React from 'react'
import { observer, inject } from 'mobx-react'
import { observable } from 'mobx'

import CSS from '../css/index.sass'

// you should probably extend other classes from a base class like this one
@inject('model')
@observer
export default class Index extends React.Component {
  @observable color = 'black'
  toggleColor = (e) => {
    this.color = (this.color=='black') ? 'green' : 'black'
  }
  render() {
    return (
      <div
        id='index'
        className={CSS.index}
        onClick={this.toggleColor}
        style={{color: this.color}}
      >
        Hello World!
      </div>
    )
  }
}
