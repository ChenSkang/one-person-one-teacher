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
    jiaocai: '人教新版',
    nianji: '七年级上',
    phone: '',
    imgSrc: '', // 头像
    cropImg: '', // 裁切的图片
    TK: [], // 试题篮填空题
    XZ: [], // 试题篮选择题
    JD: [], // 试题篮解答题
    config: [true, false, false, false, false, false, false, false, false, false],
    examName: '初中数学测试试卷',
    examSecondName: '试卷副标题',
    examThirdName: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
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
