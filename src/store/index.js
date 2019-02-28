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
    userNow: '',
    cropImg: '', // 裁切的图片
    TK: [], // 试题篮填空题
    XZ: [], // 试题篮选择题
    JD: [], // 试题篮解答题
    /* options: [{
      value: 0,
      label: '题干',
      holder: '请输入题干'
    }, {
      value: 1,
      label: '试卷',
      holder: '请输入中考试卷信息，例：2017潍坊'
    }, {
      value: 2,
      label: '知识点',
      holder: '请在左侧选择知识点'
    }],
    value: 0,
    select: '全部',
    zsdTreeTags: [], */
    input_message: '',
    myTest: [
      { que: '' },
      { kddp: '' },
      { zsd: '' },
      { answer: '' },
      { jx: '' }
    ],
    IFJX: false
  },
  mutations: {
  },
  modules: {
    urls: urls,
    history: history,
    temp: temp
  },
  paperList: []
})
