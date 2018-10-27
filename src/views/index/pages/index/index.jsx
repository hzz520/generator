import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import './index.less'

@inject(({ test }) => ({
  demo: test.demo,
  demo1: test.demo1,
  changeDemo: test.changeDemo,
  changeDemo1: test.changeDemo1
}))
@observer
@withRouter
export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {

  }
  render () {
    let {
      demo,
      demo1,
      changeDemo,
      changeDemo1
    } = this.props

    return (
      <div className="container">
        <div onClick={() => {
          let num = parseInt(Math.random() * 1000)
          changeDemo(num)
        }}>{demo}</div>
        <div onClick={() => {
          let num = parseInt(Math.random() * 1000)
          changeDemo1(num)
        }}>{demo1}</div>
      </div>
    )
  }
}
