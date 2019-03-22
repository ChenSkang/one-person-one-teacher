/**
 * Created by getYou on 2018/4/15.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import urls from './server'
import history from './history'
import temp from './temp'

export default new Vuex.Store({
  state: {
    signShow: false,
    nowSub: [],
    nowSubs: '',
    userNow: '',
    imgSrc: '', // 头像
    cropImg: '', // 裁切的图片
    TK: [], // 试题篮填空题
    XZ: [], // 试题篮选择题
    JD: [], // 试题篮解答题
    input_message: '',
    myTest: [
      { question: '' },
      { kddp: '' },
      { knowledge: '' },
      { answer: '' },
      { analysis: '' }
    ],
    IFJX: false,
    paperList: []
  },
  mutations: {
  },
  modules: {
    urls: urls,
    history: history,
    temp: temp
  }
})
