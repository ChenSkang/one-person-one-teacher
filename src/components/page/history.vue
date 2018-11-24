<template>
  <div>
    <my-head></my-head>
    <mySpace></mySpace>
    <answer></answer>
    <div class="main">
      <div class="concern">
        <div class="exam" id="pdfDom">
          <div class="exam_something">
            <div class="exam-title">{{examName}}</div>
          </div>

          <div v-if="$store.state.history.XZ.length" class="TM">一.选择题（共{{$store.state.history.XZ.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.XZ" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div class="low-main">
                <div @click="showJX1(index)">解析</div>
                <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                <div @click="addPaper(value.unique)">添加试题篮</div>
              </div>
            </div>
          </div>

          <div v-if="$store.state.history.TK.length" class="TM">{{$store.state.history.XZ.length ? '二' : '一'}}.填空题（共{{$store.state.history.TK.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.TK" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{$store.state.history.XZ.length + index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div class="low-main">
                <div @click="showJX2(index)">解析</div>
                <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                <div @click="addPaper(value.unique)">添加试题篮</div>
              </div>
            </div>
          </div>

          <div v-if="$store.state.history.JD.length" class="TM">{{strjd}}.解答题（共{{$store.state.history.JD.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.JD" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{$store.state.history.XZ.length + $store.state.history.TK.length + index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div class="low-main">
                <div @click="showJX3(index)">解析</div>
                <div @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</div>
                <div @click="addPaper(value.unique)">添加试题篮</div>
              </div>
            </div>
          </div>
        </div>
        <div class="concern-right">
          <div class="right">
            <div class="right_up">
              <div class="set_title">试卷操作</div>
              <div><el-button class="btn" @click="$router.push('/myexam')" icon="el-icon-back" type="primary">返回</el-button></div>
              <div><el-button class="btn" @click="downExam()" type="primary" icon="el-icon-download">下载</el-button></div>
             </div>
            <div class="right-foot">
              <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
            </div>
          </div>
        </div>
      </div>
    </div>
    <gotop></gotop>
    <myFoot style="position: relative; bottom: 0"></myFoot>
  </div>
</template>

<script>
  import gotop from '../common/gotop.vue'
  import mySpace from '../common/mySpace.vue'
  import myHead from '../common/header.vue'
  import myFoot from '../common/footer.vue'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  import answer from '../common/anwer.vue'
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
      }
    },
    components: {
      mySpace,
      ElButton,
      myHead,
      myFoot,
      gotop,
      answer
    },
    methods: {
      downExam () {
        let url = this.$store.state.urls.url + 'PaperDownJump'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('paperId', sessionStorage.getItem('paper'))
        formData.append('name', sessionStorage.getItem('paperName'))
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
      showJX1 (x) {
        this.$store.state.myTest[0].que = this.$store.state.history.XZ[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.$store.state.history.XZ[x].answer
        this.$store.state.myTest[0].jx = this.$store.state.history.XZ[x].jx
        this.$store.state.IFJX = true
      },
      showJX2 (x) {
        this.$store.state.myTest[0].que = this.$store.state.history.TK[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.$store.state.history.TK[x].answer
        this.$store.state.myTest[0].jx = this.$store.state.history.TK[x].jx
        this.$store.state.IFJX = true
      },
      showJX3 (x) {
        this.$store.state.myTest[0].que = this.$store.state.history.JD[x].que
        this.$store.state.myTest[0].kddp = ''
        this.$store.state.myTest[0].zsd = ''
        this.$store.state.myTest[0].answer = this.$store.state.history.JD[x].answer
        this.$store.state.myTest[0].jx = this.$store.state.history.JD[x].jx
        this.$store.state.IFJX = true
      },
      addPaper (msg) {
        let sessionId = sessionStorage.getItem('sessionId')
        let form = new FormData()
        form.append('unique', msg)
        form.append('sessionId', sessionId)
        let url = this.$store.state.urls.url + 'AddQueServlet'
        this.$axios.post(url, form, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$message.success('试题添加成功')
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
      if (this.$store.state.history.paper) {
        let url = this.$store.state.urls.url + 'GetPaperQueServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('paperId', sessionStorage.getItem('paper'))
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.XZ = []
          this.$store.state.history.TK = []
          this.$store.state.history.JD = []
          for (let i = 0; i < response.data.length; i++) {
            switch (response.data[i].kind) {
              case '选择题':
                this.$store.state.history.XZ.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                break
              case '填空题':
                this.$store.state.history.TK.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                break
              case '解答题':
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                break
              default:
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
            }
          }
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    computed: {
      strjd: function () {
        if (this.$store.state.history.XZ.length && this.$store.state.history.TK.length) {
          return '三'
        } else if (this.$store.state.history.XZ.length || this.$store.state.history.TK.length) {
          return '二'
        } else {
          return '一'
        }
      },
      chartData: function () {
        let str = {
          columns: ['题型', '题目数量'],
          rows: [
            { '题型': '选择题', '题目数量': this.$store.state.history.XZ.length },
            { '题型': '填空题', '题目数量': this.$store.state.history.TK.length },
            { '题型': '解答题', '题目数量': this.$store.state.history.JD.length }
          ]
        }
        return str
      },
      examName: function () {
        return sessionStorage.getItem('paperName')
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
  .right-foot{
    margin-top: 20px;
    width: 100%;
    padding-bottom: 20px;
  }
  .exam-title{
    width: 100%;
    height: 40px;
    font: 22px Arial bold;
    line-height: 40px;
    text-align: center;
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
