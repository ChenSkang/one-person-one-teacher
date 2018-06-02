// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import store from './store/index'
import htmlToPdf from '@/components/utils/htmlToPdf'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(Vuex)
Vue.use(htmlToPdf)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App }
})
