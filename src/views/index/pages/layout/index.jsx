import React, { Component } from 'react'

export default class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    console.log(111, this.props)
    return (
      <div className="container">
        666
        {this.props.children}
      </div>
    )
  }
}
