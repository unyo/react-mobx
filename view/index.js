import React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action } from 'mobx'

import CSS from '../css/index.sass'

@inject('model')
@observer
export default class Index extends React.Component {
  @observable color = 'white'
  // use @action.bound instead of an arrow function to bind things to this scope
  // and also wrap everything in a transaction
  @action.bound
  toggleColor() {
    this.color = (this.color=='white') ? 'yellow' : 'white'
    this.props.model.data = this.color
    this.props.model.incrementCount()
  }
  render() {
    return (
      <div
        id='index'
        className={CSS.index}
        onClick={this.toggleColor}
        style={{color: this.color}}
      >
        Hello world {this.props.model.count}!
      </div>
    )
  }
}
