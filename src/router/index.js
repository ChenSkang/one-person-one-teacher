import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Sign',
      meta: {
        title: 'OPOT|初中数学指导'
      },
      component: resolve => require(['@/components/common/Sign'], resolve)
    },
    {
      path: '/index',
      name: 'Index',
      component: resolve => require(['@/components/page/Home'], resolve),
      meta: {
        title: '搜索'
      }
    },
    {
      path: '/basket',
      name: 'Basket',
      meta: {
        title: '我的试卷',
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
        title: '搜索历史',
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: resolve => require(['@/components/page/searchHistory'], resolve)
    },
    {
      path: '/enter',
      name: 'Enter',
      meta: {
        title: '关于我们'
      },
      component: resolve => require(['@/components/page/aboutUs'], resolve)
    },
    {
      path: '/safe',
      name: 'Safe',
      meta: {
        title: '找回密码'
      },
      component: resolve => require(['@/components/page/safe'], resolve)
    },
    {
      path: '/testPapers',
      name: 'TestPapers',
      meta: {
        title: '我的试卷'
      },
      component: resolve => require(['@/components/page/TestPapers'], resolve)
    },
    {
      path: '/imgSearch',
      name: 'ImgSearch',
      meta: {
        title: '图片搜索'
      },
      component: resolve => require(['@/components/page/imgSearch'], resolve)
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      meta: {
        title: '个人中心'
      },
      component: resolve => require(['@/components/page/myInfo'], resolve)
    },
    {
      path: '/similarSearch',
      name: 'SimilarSearch',
      meta: {
        title: '相似推荐'
      },
      component: resolve => require(['@/components/page/similarSearch'], resolve)
    }
  ]
})
