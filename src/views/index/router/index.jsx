import React from 'react'
import {
  withRouter,
  Switch,
  Route,
  HashRouter
} from 'react-router-dom'

import Layout from '../pages/layout'
import asyncComponent from '../components/lazycomponent'

const Main = withRouter(props => <Layout {...props}/>)

export default (
  <HashRouter>
    <Main>
      <Switch>
        <Route exact path='/' component={asyncComponent(() => import(/* webpackChunkName: "Index" */ '../pages/index/index.jsx'))}/>
        <Route exact path='/list' component={asyncComponent(() => import(/* webpackChunkName: "List" */ '../pages/list/index.jsx'))}/>
      </Switch>
    </Main>
  </HashRouter>
)
