import Vue from 'vue'
import Router from 'vue-router'
import Sign from '@/components/common/Sign'
import Index from '@/components/page/Home'
import Basket from '@/components/page/basket'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/basket',
      name: 'Basket',
      component: Basket
    }
  ]
})
