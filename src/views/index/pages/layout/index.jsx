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
    console.log('layout')
    return (
      <div className="container">
        666
        {this.props.children}
      </div>
    )
  }
}
