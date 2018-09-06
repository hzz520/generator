const Home = r => require.ensure([], () => r(require('../pages/index/index')), 'Home')
const List = r => require.ensure([], () => r(require('../pages/list/index')), 'List')

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]
