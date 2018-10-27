import React, { Component } from 'react'

import '@/assets/css/base.less'
import './index.less'

export default class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div className="container">
        {this.props.children}
      </div>
    )
  }
}
