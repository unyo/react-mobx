import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { get } from 'lodash'

import CSS from '../css/layout.sass'

export default class Layout extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static childContextTypes = {
    store: React.PropTypes.object,
  }
  static defaultProps = {
    pageTransitionTime: 500,
    pageTransitionClass: 'page',
  }
  getChildContext() {
    return {
      store: {},
    };
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
      </div>
    )
  }
}
