import React from 'react'
import {
  withRouter,
  Switch,
  Route,
  HashRouter
} from 'react-router-dom'

import Layout from '../pages/layout'
import asyncComponent from '../components/lazycomponent'

let routeArr = [
  {
    path: '/',
    pathName: 'index'
  },
  {
    path: '/list',
    pathName: 'list'
  }
]

const Load = (pathName) => asyncComponent(() => import(/* webpackChunkName: `[request]` */ `../pages/${pathName}/index.jsx`))

const Main = withRouter(props => <Layout {...props}/>)

export default (
  <HashRouter>
    <Main>
      <Switch>
        {
          routeArr.map(({ path, pathName }, i) => (<Route key={i} exact path={path} component={Load(pathName)}/>))
        }
      </Switch>
    </Main>
  </HashRouter>
)
