import React from 'react'
import { observer } from 'mobx-react'

import CSS from '../css/index.sass'

// you should probably extend other classes from a base class like this one
@observer
export default class Index extends React.Component {
  render() {
    return (
      <div id='index' className={CSS.index}>
        Hello world!
      </div>
    )
  }
}
