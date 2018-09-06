/* eslint-disable no-new */
import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './router'
import store from './store'
import IndexView from './index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(IndexView)
})
