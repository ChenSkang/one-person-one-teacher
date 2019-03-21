<template>
  <div>
    <answer></answer>
    <my-head></my-head>
    <mySpace></mySpace>
    <el-dialog
      title="提示"
      :visible.sync="deleteall"
      width="30vmax" :append-to-body="true">
      <span>清空后不可恢复，确认清空？</span>
      <span slot="footer" class="dialog-footer">
              <el-button @click="deleteall = false" size="small">取 消</el-button>
              <el-button type="primary" @click="deleteAll()" size="small">确 定</el-button>
            </span>
    </el-dialog>
    <div class="main">
      <div class="concern">
        <div class="exam">
          <div class="exam_something">
            <div v-if="showSet[0]" title="点击设置试卷主标题"><input type="text" class="exam_name exam_name1" v-model="examName"></div>
            <div v-if="showSets[0]" title="点击设置试卷副标题"><input type="text" class="exam_name exam_name2" v-model="examSecondName"></div>
            <div v-if="showSets[1]" title="点击设置试卷信息"><input type="text" class="exam_name exam_name3" v-model="examThirdName"></div>
            <div v-if="showSet[1]" title="点击设置考生信息"><input type="text" class="exam_name exam_name4" v-model="examFourName"></div>
            <div class="scores" v-if="showSet[2]" title="打分栏">
              <table border="1" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td>题号</td>
                  <td>一</td>
                  <td>二</td>
                  <td>三</td>
                  <td>总分</td>
                </tr>
                <tr>
                  <td>得分</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
            <div class="attentions" v-if="showSets[2]" title="注意事项">
              <span>注意事项：</span>
              <p v-for="(attention, index) in attentions" :key="attention">
                {{index + 1 + '.'+ '&nbsp;' + attention}}
              </p>
            </div>
          </div>

          <div v-if="XZ.length" class="TM">一.选择题（共{{XZ.length}}小题）</div>
          <draggable v-model="XZ" @end="endMove" :options="dragOption1">
            <transition-group tag="div" class="item-ul">
              <div v-for="(value, index) in XZ" class="ques" :key="value.unique">
                <div class="up">
                  <span class="TH">{{index + 1}}.</span>
                  <span v-html="value.que"></span>
                  <div :style="{width: 10 + 'px', height: value.area + 'px'}"></div>
                  <div v-if="showSet[4]">
                    <span class="jx">解析：</span><span v-html="value.jx"></span>
                  </div>
                  <div v-if="showSet[3]">
                    <span class="jx">解答：</span><span v-html="value.answer"></span>
                  </div>
                </div>
                <div class="low">
                  <div class="low-main">
                    <div @click="showJX1(index)">解析</div>
                    <div @click="deleteX(index)">删除</div>
                    <div @click="upX(index)">上移</div>
                    <div @click="downX(index)">下移</div>
                    <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                    <div v-if="value.area >= 50" @click="value.area -= 50">减少答题区</div>
                    <div @click="value.area += 50">增加答题区</div>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>

          <div v-if="TK.length" class="TM">{{XZ.length ? '二' : '一'}}.填空题（共{{TK.length}}小题）</div>
          <draggable v-model="TK" @end="endMove" :options="dragOption2">
            <transition-group tag="div" class="item-ul">
              <div v-for="(value, index) in TK" class="ques" :key="value.unique">
                <div class="up">
                  <span class="TH">{{XZ.length + index + 1}}.</span>
                  <span v-html="value.que"></span>
                  <div :style="{width: 10 + 'px', height: value.area + 'px'}"></div>
                  <div v-if="showSet[4]">
                    <span class="jx">解析：</span><span v-html="value.jx"></span>
                  </div>
                  <div v-if="showSet[3]">
                    <span class="jx">解答：</span><span v-html="value.answer"></span>
                  </div>
                </div>
                <div class="low">
                  <div class="low-main">
                    <div @click="showJX2(index)">解析</div>
                    <div @click="deleteT(index)">删除</div>
                    <div @click="upT(index)">上移</div>
                    <div @click="downT(index)">下移</div>
                    <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                    <div v-if="value.area >= 50" @click="value.area -= 50">减少答题区</div>
                    <div @click="value.area += 50">增加答题区</div>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>

          <div v-if="JD.length" class="TM">{{strjd}}.解答题（共{{JD.length}}小题）</div>
          <draggable v-model="JD" @end="endMove" :options="dragOption3">
            <transition-group tag="div" class="item-ul">
              <div v-for="(value, index) in JD" class="ques" :key="value.unique">
                <div class="up">
                  <span class="TH">{{XZ.length + TK.length + index + 1}}.</span>
                  <span v-html="value.que"></span>
                  <div :style="{width: 10 + 'px', height: value.area + 'px'}"></div>
                  <div v-if="showSet[4]">
                    <span class="jx">解析：</span><span v-html="value.jx"></span>
                  </div>
                  <div v-if="showSet[3]">
                    <span class="jx">解答：</span><span v-html="value.answer"></span>
                  </div>
                </div>
                <div class="low">
                  <div class="low-main">
                    <div @click="showJX3(index)">解析</div>
                    <div @click="deleteJ(index)">删除</div>
                    <div @click="upJ(index)">上移</div>
                    <div @click="downJ(index)">下移</div>
                    <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                    <div v-if="value.area >= 50" @click="value.area -= 50">减少答题区</div>
                    <div @click="value.area += 50">增加答题区</div>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>

          <div v-if="showSets[3] || showSets[4]">
            <div v-for="(value, index) in XZ" class="ques" :key="value.answer">
              <div class="up">
                <div>
                  <span>{{index + 1}}.</span>
                  <span v-if="showSets[4]">解析：<span v-html="value.jx"></span></span><br/>
                  <span v-if="showSets[3]">解答：<span v-html="value.answer"></span></span>
                </div>
              </div>
            </div>
            <div v-for="(value, index) in TK" class="ques" :key="value.answer">
              <div class="up">
                <div>
                  <span>{{XZ.length + index + 1}}.</span>
                  <span v-if="showSets[4]">解析：<span v-html="value.jx"></span></span><br/>
                  <span v-if="showSets[3]">解答：<span v-html="value.answer"></span></span>
                </div>
              </div>
            </div>
            <div v-for="(value, index) in JD" class="ques" :key="value.answer">
              <div class="up">
                <div>
                  <span>{{XZ.length + TK.length + index + 1}}.</span>
                  <span v-if="showSets[4]">解析：<span v-html="value.jx"></span></span><br/>
                  <span v-if="showSets[3]">解答：<span v-html="value.answer"></span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="concern-right">
          <div class="right">
            <div class="right_up">
              <div class="set_title">试卷操作</div>
              <div><el-button class="btn" @click="wordDown()" type="primary" icon="el-icon-download">下载试题</el-button></div>
              <div><el-button class="btn" @click="deleteall = true" type="primary" icon="el-icon-delete">清空试题</el-button></div>
            </div>
            <div class="right_down">
              <div class="set_title">试卷信息</div>
              <div class="set_exam">
                <el-row>
                  <el-col :span="12">
                    <div v-for="(city, index) in cities" :key="city">
                      <el-checkbox  v-model="showSet[index]" :key="city">{{city}}</el-checkbox>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div v-for="(mation, index) in mations" :key="mation">
                      <el-checkbox  v-model="showSets[index]" :key="mation">{{mation}}</el-checkbox>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="right-foot">
              <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
            </div>
          </div>
        </div>
      </div>
    </div>
    <gotop></gotop>
    <myFoot></myFoot>
  </div>
</template>

<script>
  import gotop from '../common/gotop.vue'
  import mySpace from '../common/mySpace.vue'
  import myHead from '../common/header.vue'
  import draggable from 'vuedraggable'
  import myFoot from '../common/footer.vue'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  import answer from '../common/anwer.vue'
  const firstOptions = ['主标题', '考生信息', '总分栏', '显示答案', '显示解析']
  const secondOptions = ['副标题', '试卷信息', '注意事项', '答案后置', '解析后置']
  export default {
    data () {
      this.chartSettings = {
        radius: 80,
        offsetY: 150,
        label: {
          show: true,
          position: 'inside'
        }
      }
      return {
        deleteall: false,
        cities: firstOptions,
        mations: secondOptions,
        showSet: [true, false, false, true, true],
        showSets: [false, false, false, false, false],
        examName: '初中数学测试试卷',
        examSecondName: '试卷副标题',
        examThirdName: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
        examFourName: '学校：________姓名：________班级：________学号：________',
        attentions: [
          '答题前填写好自己的姓名、班级、学号',
          '请将答案填写到答题卡上面'
        ],
        XZ: [],
        TK: [],
        JD: [],
        dragOption1: {
          animation: 120,
          scroll: true,
          group: 'sortlist1',
          ghostClass: 'ghost-style'
        },
        dragOption2: {
          animation: 120,
          scroll: true,
          group: 'sortlist2',
          ghostClass: 'ghost-style'
        },
        dragOption3: {
          animation: 120,
          scroll: true,
          group: 'sortlist3',
          ghostClass: 'ghost-style'
        }
      }
    },
    components: {
      mySpace,
      ElButton,
      myHead,
      draggable,
      myFoot,
      gotop,
      answer
    },
    methods: {
      endMove () {
        let arr = []
        for (let i = 0; i < this.XZ.length; i++) {
          arr.push(this.XZ[i].unique)
        }
        for (let i = 0; i < this.TK.length; i++) {
          arr.push(this.TK[i].unique)
        }
        for (let i = 0; i < this.JD.length; i++) {
          arr.push(this.JD[i].unique)
        }
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('questions', arr)
        let url = this.$store.state.urls.url + 'MoveBasketServlet'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log('success')
        }, (response) => {
          this.$message.error('未知错误')
        })
      },
      showJX1 (x) {
        this.$store.state.myTest[0].que = this.XZ[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.XZ[x].answer
        this.$store.state.myTest[0].jx = this.XZ[x].jx
        this.$store.state.IFJX = true
      },
      showJX2 (x) {
        this.$store.state.myTest[0].que = this.TK[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.TK[x].answer
        this.$store.state.myTest[0].jx = this.TK[x].jx
        this.$store.state.IFJX = true
      },
      showJX3 (x) {
        this.$store.state.myTest[0].que = this.JD[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.JD[x].answer
        this.$store.state.myTest[0].jx = this.JD[x].jx
        this.$store.state.IFJX = true
      },
      deleteT (x) {
        let sessionId = sessionStorage.getItem('sessionId')
        let ida = this.TK[x].unique
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('uniqueId', ida)
        let url = this.$store.state.urls.url + 'RemoveQueServlet'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$message.success('删除成功')
          this.TK.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      deleteJ (x) {
        let sessionId = sessionStorage.getItem('sessionId')
        let ida = this.JD[x].unique
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('uniqueId', ida)
        let url = this.$store.state.urls.url + 'RemoveQueServlet'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$message.success('删除成功')
          this.JD.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      deleteX (x) {
        let sessionId = sessionStorage.getItem('sessionId')
        let ida = this.XZ[x].unique
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('uniqueId', ida)
        let url = this.$store.state.urls.url + 'RemoveQueServlet'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$message.success('删除成功')
          this.XZ.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      upT (x) {
        if (x > 0) {
          let temp = this.TK[x]
          this.TK.splice(x, 1)
          this.TK.splice(x - 1, 0, temp)
          this.endMove()
        }
      },
      upX (x) {
        if (x > 0) {
          let temp = this.XZ[x]
          this.XZ.splice(x, 1)
          this.XZ.splice(x - 1, 0, temp)
          this.endMove()
        }
      },
      upJ (x) {
        if (x > 0) {
          let temp = this.JD[x]
          this.JD.splice(x, 1)
          this.JD.splice(x - 1, 0, temp)
          this.endMove()
        }
      },
      downT (x) {
        if (x < this.TK.length) {
          let temp = this.TK[x]
          this.TK.splice(x, 1)
          this.TK.splice(x + 1, 0, temp)
          this.endMove()
        }
      },
      downX (x) {
        if (x < this.XZ.length) {
          let temp = this.XZ[x]
          this.XZ.splice(x, 1)
          this.XZ.splice(x + 1, 0, temp)
          this.endMove()
        }
      },
      downJ (x) {
        if (x < this.JD.length) {
          let temp = this.JD[x]
          this.JD.splice(x, 1)
          this.JD.splice(x + 1, 0, temp)
          this.endMove()
        }
      },
      wordDown () {
        let arr = []
        let arrTwo = []
        for (let i = 0; i < this.XZ.length; i++) {
          arr.push(this.XZ[i].unique)
          arrTwo.push(this.XZ[i].area)
        }
        for (let i = 0; i < this.TK.length; i++) {
          arr.push(this.TK[i].unique)
          arrTwo.push(this.TK[i].area)
        }
        for (let i = 0; i < this.JD.length; i++) {
          arr.push(this.JD[i].unique)
          arrTwo.push(this.JD[i].area)
        }
        let sessionId = sessionStorage.getItem('sessionId')
        let config = this.showSet.concat(this.showSets)
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('questions', arr)
        formData.append('name', this.examName)
        formData.append('nameTwo', this.examSecondName)
        formData.append('shijuanxinxi', this.examThirdName)
        formData.append('config', config)
        formData.append('hangju', arrTwo)
        let url = this.$store.state.urls.url + 'BasketDownJump'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          window.open(response.data)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      deleteAll () {
        this.deleteall = false
        let url = this.$store.state.urls.url + 'CleanBasketServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.XZ = []
          this.TK = []
          this.JD = []
          this.$notify({
            title: '提示',
            message: '清空试题篮成功',
            type: 'success'
          })
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
    },
    computed: {
      strjd: function () {
        if (this.XZ.length && this.TK.length) {
          return '三'
        } else if (this.XZ.length || this.TK.length) {
          return '二'
        } else {
          return '一'
        }
      },
      chartData: function () {
        let str = {
          columns: ['题型', '题目数量'],
          rows: [
            { '题型': '选择题', '题目数量': this.XZ.length },
            { '题型': '填空题', '题目数量': this.TK.length },
            { '题型': '解答题', '题目数量': this.JD.length }
          ]
        }
        return str
      }
    }
  }
</script>

<style scoped>
  .main {
    width: 100%;
    position: relative;
    top: 40px;
    background-color: #F2F6FC;
    padding-top: 20px;
    padding-bottom: 20px;
    letter-spacing: 1px;
    overflow: hidden;
  }
  .concern{
    width: 84%;
    margin-left: 8%;
    display: flex;
    flex-direction: row
  }
  .concern-right{
    width: 25%;
  }
  .exam{
    width: 915px;
    background-color: #fff;
    position: relative;
    padding: 40px 50px 40px 50px;
    min-height: 910px;
  }
  .right{
    width: 90%;
    margin-left: 5%;
    min-width: 240px;
  }
  .right_up{
    width: 100%;
    text-align: center;
    background-color: #fff;
  }
  .right_down{
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    padding-bottom: 20px;
  }
  .right-foot{
    margin-top: 20px;
    width: 100%;
    padding-bottom: 20px;
  }
  .set_exam{
    width: 80%;
    margin-left: 10%;
  }
  .set_exam div{
    margin-top: 10px;
  }
  .set_title{
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    text-align: center;
    background-color: #EBEEF5;
    border-bottom: 1px solid #E4E7ED;
    margin-bottom: 10px;
  }
  .exam_name{
    width: 100%;
    text-align: center;
    border: 1px solid #fff;
  }
  .exam_name:hover{
    background-color: #FEF7D7;
    border: 1px solid #CCC;
  }
  .exam_name:focus{
    background-color: #FEF7D7;
    border: 1px solid #fff;
  }
  .exam_name1{
    font: 22px Arial bold;
    line-height: 40px;
  }
  .exam_name2{
    font: 18px Arial;
    line-height: 15px;
  }
  .exam_name3{
    font: 14px 微软雅黑;
    height: 50px;
    line-height: 50px;
  }
  .exam_name4{
    font: 14px 微软雅黑;
    line-height: 15px;
  }
  .scores{
    margin: 15px 0;
  }
  .scores table{
    border-collapse: collapse;
    margin: 0 auto;
  }
  .scores table td{
    width: 50px;
    height: 25px;
    text-align: center;
    font-size: 12px;
  }
  .attentions{
    width: 100%;
    color: #999999;
    font-size: 12px;
    margin-bottom: 5mm;
  }
  .attentions span{
    font-size: 15px;
  }
  .attentions p{
    line-height: 20px;
  }
  .ques{
    position: relative;
    width: 100%;
    zoom: 1;
    clear: both;
    box-sizing: border-box;
    border: 1px solid #ffffff;
    transition: 0.5s;
  }
  .ques:hover{
    border-radius: 10px;
    border: 1px solid #DCDFE6;
  }
  .ques:hover .low{
    background-color: #409EFF;
    border-top: 1px solid #dadada;
  }
  .up{
    line-height: 25px;
    font-size: 14px;
    padding: 20px 20px 10px 20px;
  }
  .jx{
    color: #409EFF;
    font-weight: bold;
  }
  .low{
    height: 36px;
    position: relative;
    bottom: 0;
    line-height: 36px;
    padding: 0 20px;
    color: #fff;
    font-size: 12px;
    border-radius: 0 0 10px 10px;
  }
  .low-main{
    display: flex;
    justify-content:flex-end;
  }
  .low div{
    margin-left: 15px;
    cursor: pointer;
  }
  .item-ul::-webkit-scrollbar{
    width: 0;
  }
  .TM{
    font-family: 新宋体;
    font-weight: bold;
    font-size: 17px;
  }
  .btn {
    width: 120px;
    margin: 10px 0 10px 0;
  }
</style>
