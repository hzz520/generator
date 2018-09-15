import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import './index.less'

@inject(({ test1 }) => ({
  demo2: test1.demo2,
  demo3: test1.demo3,
  changeDemo2: test1.changeDemo2,
  changeDemo3: test1.changeDemo3
}))
@observer
@withRouter
export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let {
      demo2,
      demo3,
      changeDemo2,
      changeDemo3
    } = this.props
    return (
      <div className="container">
        <div onClick={() => {
          let num = parseInt(Math.random() * 1000)
          changeDemo2(num)
        }}>{demo2}</div>
        <div onClick={() => {
          let num = parseInt(Math.random() * 1000)
          changeDemo3(num)
        }}>{demo3}</div>
      </div>
    )
  }
}
