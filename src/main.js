// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
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
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
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
  components: { App },
})

/*MathJax.Hub.Config({
  showProcessingMessages: false, // 关闭js加载过程信息
  messageStyle: 'none', // 不显示信息
  extensions: ['tex2jax.js'],
  jax: ['input/TeX', 'output/HTML-CSS'],
  tex2jax: {
    inlineMath: [ ['$','$'], ["\\(","\\)"] ], // 行内公式选择符
    displayMath: [ ['$$','$$'], ["\\[","\\]"] ], // 段内公式选择符
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre','code','a'], // 避开某些标签
    ignoreClass:"comment-content" // 避开含该Class的标签
  },
  "HTML-CSS": {
    linebreaks: {automatic: true, width: 'container'},
    availableFonts: ["STIX","TeX"],
    showMathMenu: false
  }
})
MathJax.Hub.Queue(['Typeset',MathJax.Hub])*/
