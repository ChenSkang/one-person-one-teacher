// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
import htmlToPdf from '@/components/utils/htmlToPdf'
import axios from 'axios'
import VePie from 'v-charts/lib/pie.common'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(htmlToPdf)
Vue.component(VePie.name, VePie)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App },
})

/* 路由跳转验证 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (sessionStorage.getItem('sessionId')) {
      next()
    } else {
      next({
        path: '/' // 未登录则跳转至login页面
      })
      alert('请先登录')
    }
  } else {
    next ()
  }
})
