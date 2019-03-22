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
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: resolve => require(['@/components/page/basket'], resolve)
    },
    {
      path: '/history',
      name: 'History',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: resolve => require(['@/components/page/history'], resolve)
    },
    {
      path: '/myexam',
      name: 'MyExam',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: resolve => require(['@/components/page/myexam'], resolve)
    },
    {
      path: '/searched',
      name: 'Searched',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: resolve => require(['@/components/page/searchHistory'], resolve)
    },
    {
      path: '/enter',
      name: 'Enter',
      component: resolve => require(['@/components/page/aboutUs'], resolve)
    },
    {
      path: '/safe',
      name: 'Safe',
      component: resolve => require(['@/components/page/safe'], resolve)
    },
    {
      path: '/testPapers',
      name: 'TestPapers',
      component: resolve => require(['@/components/page/TestPapers'], resolve)
    },
    {
      path: '/imgSearch',
      name: 'ImgSearch',
      component: resolve => require(['@/components/page/imgSearch'], resolve)
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: resolve => require(['@/components/page/myInfo'], resolve)
    }
  ]
})
