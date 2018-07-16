/**
 * Created by getYou on 2018/4/15.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import urls from './server'
import history from './history'

export default new Vuex.Store({
  state: {
    examHistory: [],
    userNow: '',
    cropImg: '', // 裁切的图片
    tests: '', // test ID
    TK: [], // 试题篮填空题
    XZ: [], // 试题篮选择题
    JD: [] // 试题篮解答题
  },
  mutations: {
  },
  modules: {
    urls: urls,
    history: history
  }
})
