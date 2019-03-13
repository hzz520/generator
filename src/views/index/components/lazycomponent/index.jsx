import React, { Component } from 'react'
import Loadable from 'react-loadable'
import Loading from '../loading/index'

export default (importComponent) => {
  const LoadComponnent = Loadable({
    loader: importComponent,
    loading: Loading
  })
  class LoadableComponent extends Component {
    render () {
      return (<LoadComponnent/>)
    }
  }
  return LoadableComponent
}
