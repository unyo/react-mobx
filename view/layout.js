import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { get } from 'lodash'
import { observable } from 'mobx'
import { Provider, observer } from 'mobx-react'

import Model from '../model/index'
import CSS from '../css/layout.sass'

@observer
export default class Layout extends React.Component {
  @observable model = new Model()
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static defaultProps = {
    pageTransitionTime: 500,
    pageTransitionClass: 'page',
  }
  // todo: modify pageTransitionTime dependent on the previous path
  // and the new path
  // https://github.com/reactjs/react-router/issues/1066#issuecomment-91925801
  render() {
    console.log('rendering layout')
    const customTransitionClass = get(this.props, 'location.state.transitionClass')
    const pageTransitionClass = (customTransitionClass!==undefined) ? customTransitionClass : this.props.pageTransitionClass
    const customTransitionTime = get(this.props, 'location.state.transitionTime')
    const pageTransitionTime = (customTransitionTime!==undefined) ? customTransitionTime : this.props.pageTransitionTime
    console.log(`transition class: ${pageTransitionClass} time: ${pageTransitionTime}`)
    return (
      <div id='layout' className={CSS.layout} key='layout'>
        <Provider model={this.model}>
          <ReactCSSTransitionGroup
            component='div'
            className={CSS.transitionContainer}
            transitionName={pageTransitionClass}
            transitionEnterTimeout={pageTransitionTime}
            transitionLeaveTimeout={pageTransitionTime}
          >
            {React.cloneElement(this.props.children, {
              key: this.props.location.pathname+this.props.location.key,
            })}
          </ReactCSSTransitionGroup>
          {/*<DevTools />*/}
        </Provider>
      </div>
    )
  }
}
