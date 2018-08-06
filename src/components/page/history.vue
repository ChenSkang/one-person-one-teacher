<template>
  <div style="overflow: hidden">
    <my-head></my-head>
    <mySpace></mySpace>
    <div class="main">
      <div class="concern">
        <div class="exam" id="pdfDom">
          <div class="exam_something">
            <div class="exam_left" v-if="showSets[2]" title="装订线">
              <img src="../../img/peal_line.png" alt="">
            </div>
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
            <div class="attentions" v-if="showSet[3]" title="注意事项">
              <span>注意事项：</span>
              <p v-for="(attention, index) in attentions" :key="attention">
                {{index + 1 + '.'+ '&nbsp;' + attention}}
              </p>
            </div>
          </div>

          <div v-if="$store.state.history.XZ.length" class="TM">一.选择题（共{{$store.state.history.XZ.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.XZ" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div @click="deleteX(index)"></div>
              <div @click="upX(index)"></div>
              <div @click="downX(index)"></div>
            </div>
          </div>

          <div v-if="$store.state.history.TK.length" class="TM">{{$store.state.history.XZ.length ? '二' : '一'}}.填空题（共{{$store.state.history.TK.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.TK" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{$store.state.history.XZ.length + index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div @click="deleteT(index)"></div>
              <div @click="upT(index)"></div>
              <div @click="downT(index)"></div>
            </div>
          </div>

          <div v-if="$store.state.history.JD.length" class="TM">{{strjd}}.解答题（共{{$store.state.history.JD.length}}小题）</div>
          <div v-for="(value, index) in $store.state.history.JD" class="ques" :key="value.unique">
            <div class="up">
              <span class="TH">{{$store.state.history.XZ.length + $store.state.history.TK.length + index + 1}}</span>
              <span v-html="value.que"></span>
            </div>
            <div class="low">
              <div @click="deleteJ(index)"></div>
              <div @click="upJ(index)"></div>
              <div @click="downJ(index)"></div>
            </div>
          </div>
        </div>
        <div class="concern-right">
          <div class="right">
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
  const firstOptions = ['主标题', '考生信息', '总分栏', '注意事项']
  const secondOptions = ['副标题', '试卷信息', '装订线']
  export default {
    data () {
      return {
        deleteall: false,
        cities: firstOptions,
        mations: secondOptions,
        showSet: [true, false, true, true],
        showSets: [true, false, true],
        examName: '初中数学测试试卷',
        examSecondName: '试卷副标题',
        examThirdName: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
        examFourName: '学校：________姓名：________班级：________学号：________',
        attentions: [
          '答题前填写好自己的姓名、班级、学号',
          '请将答案填写到答题卡上面'
        ],
        htmlTitle: 'test'
      }
    },
    components: {
      mySpace,
      ElButton,
      myHead,
      myFoot,
      gotop
    },
    methods: {
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
                this.$store.state.history.XZ.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              case '填空题':
                this.$store.state.history.TK.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              case '解答题':
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              default:
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique})
            }
          }
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    mounted () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    },
    updated () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
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
      }
    }
  }
</script>

<style scoped>
  /* @import "../../someJs/demo.css"; */
  .main {
    width: 100%;
    position: relative;
    background-color: #F2F6FC;
    padding-top: 20px;
    padding-bottom: 20px;
    letter-spacing: 1px;
  }
  .concern{
    width: 84%;
    margin-left: 8%;
    display: flex;
    flex-direction: row
  }
  .tops{
    display: none;
  }
  @media screen and (max-width: 1100px){
    .concern-right{
      display: none;
    }
    .tops{
      display: block;
      text-align: center;
      margin-bottom: 20px;
    }
    .exam{
      width: 100%;
    }
  }
  .concern-right{
    width: 25%;
  }
  @media screen and (max-width: 800px){
    .exam_something{
      display: none;
    }
    .exam{
      padding: 40px 10px 40px 10px !important;
    }
  }
  .exam{
    width: 915px;
    background-color: #fff;
    position: relative;
    padding: 40px 40px 40px 100px;
    min-height: 910px;
  }
  .right{
    width: 90%;
    margin-left: 5%;
  }
  .right_down{
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    padding-bottom: 20px;
  }
  .set_title{
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 1rem;
    text-align: center;
    background-color: #EBEEF5;
    border-bottom: 1px solid #E4E7ED;
    margin-bottom: 10px;
  }
  .set_exam{
    width: 80%;
    margin-left: 10%;
  }
  .set_exam div{
    margin-top: 10px;
  }
  .exam_left img{
    position: absolute;
    left: 7px;
    top: 0;
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
    font: 1.375rem Arial bold;
    line-height: 40px;
  }
  .exam_name2{
    font: 1.125rem Arial;
    line-height: 1.5em;
  }
  .exam_name3{
    font: 0.875rem 微软雅黑;
    height: 50px;
    line-height: 50px;
  }
  .exam_name4{
    font: 0.875rem 微软雅黑;
    line-height: 1.5em;
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
    font-size: 0.75rem;
  }
  .attentions{
    width: 100%;
    color: #999999;
    font-size: 0.75rem;
    margin-bottom: 5mm;
  }
  .attentions span{
    font-size: 0.9375rem;
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
    font-size: 0.875rem;
    padding: 20px 20px 10px 20px;
  }
  .low{
    height: 36px;
    position: relative;
    bottom: 0;
    display: flex;
    flex-direction: row;
    line-height: 36px;
    padding: 0 20px;
    color: #fff;
    font-size: 0.75rem;
    border-radius: 0 0 10px 10px;
  }
  .low div{
    margin-left: 15px;
    cursor: pointer;
  }
  .TH{
  }
  .TM{
    font-family: 新宋体;
    font-weight: bold;
    font-size: 1.0625rem;
  }
</style>
