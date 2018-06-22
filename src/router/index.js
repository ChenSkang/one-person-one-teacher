import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sign',
      component: resolve => require(['@/components/common/Sign'], resolve)
    },
    {
      path: '/index',
      name: 'Index',
      component: resolve => require(['@/components/page/Home'], resolve)
    },
    {
      path: '/basket',
      name: 'Basket',
      component: resolve => require(['@/components/page/basket'], resolve)
    },
    {
      path: '/history',
      name: 'History',
      component: resolve => require(['@/components/page/history'], resolve)
    }
  ]
})
