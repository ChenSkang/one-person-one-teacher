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
    signShow: false,
    nowSub: [],
    userNow: '',
    cropImg: '', // 裁切的图片
    tests: '', // test ID
    TK: [], // 试题篮填空题
    XZ: [], // 试题篮选择题
    JD: [], // 试题篮解答题
    options: [{
      value: 0,
      label: '题目内容搜索',
      holder: '请输入题干搜索更多题目'
    }, {
      value: 1,
      label: '试卷信息搜索',
      holder: '请输入试卷信息搜索试卷'
    }, {
      value: 2,
      label: '知识点搜索',
      holder: '请输入知识点搜索更多题目'
    }],
    value: '',
    select: '全部',
    input_message: ''
  },
  mutations: {
  },
  modules: {
    urls: urls,
    history: history
  }
})
