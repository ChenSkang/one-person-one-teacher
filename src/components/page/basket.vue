<template>
  <div style="background-color: #ededed">
    <my-head style="background-color: #fff"></my-head>
    <el-button @click="$router.push('/')">返回</el-button>
    <div class="set_exam">
      <el-checkbox v-for="(city, index) in cities" v-model="showSet[index]" :key="city">{{city}}</el-checkbox>
    </div>
    <el-button @click="getPdf()" size="small" type="primary">下载</el-button>
    <el-button @click="deleteall = true" size="small" type="primary">清空试题</el-button>
    <el-dialog
      title="提示"
      :visible.sync="deleteall"
      width="30%">
      <span>清空后不可恢复，确认清空？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteall = false">取 消</el-button>
        <el-button type="primary" @click="deleteAll()">确 定</el-button>
      </span>
    </el-dialog>

    <div class="exam" id="pdfDom">
      <div class="exam_left" v-if="showSet[4]" title="装订线">
        <img src="../../img/peal_line.png" alt="">
      </div>
      <div v-if="showSet[0]" title="点击设置试卷主标题"><input type="text" class="exam_name exam_name1" v-model="examName" @change="sureName()"></div>
      <div v-if="showSet[5]" title="点击设置试卷副标题"><input type="text" class="exam_name exam_name2" v-model="examSecondName"></div>
      <div v-if="showSet[6]" title="点击设置试卷信息"><input type="text" class="exam_name exam_name3" v-model="examThirdName"></div>
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
        <p v-for="(attention, index) in attentions" :key="index">
          {{index + 1 + '.'+ '&nbsp;' + attention}}
        </p>
      </div>

      <div v-if="$store.state.XZ.length" class="TM">一.选择题（共{{$store.state.XZ.length}}小题）</div>
      <draggable v-model="$store.state.XZ" @end="endMove" :options="dragOption1">
        <transition-group tag="div" class="item-ul">
          <div v-for="(value, index) in $store.state.XZ" class="ques" :key="index">
            <div class="up">
              <span class="TH">{{index + 1}}</span>
              <span>{{$store.state.XZ[index]}}</span>
            </div>
            <div class="low">
              <div @click="deleteX(index)">删除</div>
              <div @click="upX(index)">上移</div>
              <div @click="downX(index)">下移</div>
            </div>
          </div>
        </transition-group>
      </draggable>

      <div v-if="$store.state.TK.length" class="TM">{{$store.state.XZ.length ? '二' : '一'}}.填空题（共{{$store.state.TK.length}}小题）</div>
      <draggable v-model="$store.state.TK" @end="endMove" :options="dragOption2">
        <transition-group tag="div" class="item-ul">
          <div v-for="(value, index) in $store.state.TK" class="ques" :key="index">
            <div class="up">
              <span class="TH">{{$store.state.XZ.length + index + 1}}</span>
              <span>{{value}}</span>
            </div>
            <div class="low">
              <div @click="deleteT(index)">删除</div>
              <div @click="upT(index)">上移</div>
              <div @click="downT(index)">下移</div>
            </div>
          </div>
        </transition-group>
      </draggable>

      <div v-if="$store.state.JD.length" class="TM">{{strjd}}.解答题（共{{$store.state.JD.length}}小题）</div>
      <draggable v-model="$store.state.JD" @end="endMove" :options="dragOption3">
        <transition-group tag="div" class="item-ul">
          <div v-for="(value, index) in $store.state.JD" class="ques" :key="index">
            <div class="up">
              <span class="TH">{{$store.state.XZ.length + $store.state.TK.length + index + 1}}</span>
              <span>{{value}}</span>
            </div>
            <div class="low">
              <div @click="deleteJ(index)">删除</div>
              <div @click="upJ(index)">上移</div>
              <div @click="downJ(index)">下移</div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <myFoot></myFoot>
  </div>
</template>

<script>
  /* import $ from 'jquery' */
  import myHead from '../common/header.vue'
  import draggable from 'vuedraggable'
  import bus from '../../bus'
  import myFoot from '../common/footer.vue'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  const cityOptions = ['标题', '考生信息', '总分栏', '注意事项', '装订线', '副标题', '试卷信息']
  export default {
    data () {
      return {
        deleteall: false,
        cities: cityOptions,
        showSet: [true, true, true, true, true, true, true],
        examName: '初中数学测试试卷',
        examSecondName: '试卷副标题',
        examThirdName: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
        examFourName: '学校：________姓名：________班级：________学号：________',
        attentions: [
          '答题前填写好自己的姓名、班级、学号',
          '请将答案填写到答题卡上面'
        ],
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
        },
        htmlTitle: 'test'
      }
    },
    components: {
      ElButton,
      myHead,
      draggable,
      myFoot
    },
    methods: {
      sureName () {
        localStorage.examname = this.examName
      },
      endMove () {
        localStorage.xz = JSON.stringify(this.$store.state.XZ)
        localStorage.tk = JSON.stringify(this.$store.state.TK)
        localStorage.jd = JSON.stringify(this.$store.state.JD)
      },
      deleteT (x) {
        this.$store.state.TK.splice(x, 1)
        localStorage.tk = JSON.stringify(this.$store.state.TK)
      },
      deleteJ (x) {
        this.$store.state.JD.splice(x, 1)
        localStorage.jd = JSON.stringify(this.$store.state.JD)
      },
      deleteX (x) {
        this.$store.state.XZ.splice(x, 1)
        localStorage.xz = JSON.stringify(this.$store.state.TK)
      },
      upT (x) {
        if (x > 0) {
          let temp = this.$store.state.TK[x]
          this.$store.state.TK.splice(x, 1)
          this.$store.state.TK.splice(x - 1, 0, temp)
          localStorage.tk = JSON.stringify(this.$store.state.TK)
        }
      },
      upX (x) {
        if (x > 0) {
          let temp = this.$store.state.XZ[x]
          this.$store.state.XZ.splice(x, 1)
          this.$store.state.XZ.splice(x - 1, 0, temp)
          localStorage.xz = JSON.stringify(this.$store.state.XZ)
        }
      },
      upJ (x) {
        if (x > 0) {
          let temp = this.$store.state.JD[x]
          this.$store.state.JD.splice(x, 1)
          this.$store.state.JD.splice(x - 1, 0, temp)
          localStorage.jd = JSON.stringify(this.$store.state.JD)
        }
      },
      downT (x) {
        if (x < this.$store.state.TK.length) {
          let temp = this.$store.state.TK[x]
          this.$store.state.TK.splice(x, 1)
          this.$store.state.TK.splice(x + 1, 0, temp)
          localStorage.getItem('tk', JSON.stringify(this.$store.state.TK))
        }
      },
      downX (x) {
        if (x < this.$store.state.XZ.length) {
          let temp = this.$store.state.XZ[x]
          this.$store.state.XZ.splice(x, 1)
          this.$store.state.XZ.splice(x + 1, 0, temp)
          localStorage.getItem('xz', JSON.stringify(this.$store.state.XZ))
        }
      },
      downJ (x) {
        if (x < this.$store.state.JD.length) {
          let temp = this.$store.state.JD[x]
          this.$store.state.JD.splice(x, 1)
          this.$store.state.JD.splice(x + 1, 0, temp)
          localStorage.getItem('jd', JSON.stringify(this.$store.state.JD))
        }
      },
      deleteAll () {
        this.deleteall = false
        this.$store.state.tests = ''
        this.$store.state.xzt = []
        this.$store.state.tkt = []
        this.$store.state.jdt = []
        this.$store.state.TK = []
        localStorage.tk = ''
        this.$store.state.XZ = []
        localStorage.xz = ''
        this.$store.state.JD = []
        localStorage.jd = ''
        this.$notify({
          title: '提示',
          message: '清空试题篮成功',
          type: 'success'
        })
      }
      /*
      upLoad () {
        $('#exam').wordExport($('#leader_name').text() + '试卷')
      } */
    },
    created () {
      bus.$on('STL', (str, kind) => {
        console.log('123')
      })
    },
    computed: {
      strjd: function () {
        if (this.$store.state.XZ.length && this.$store.state.TK.length) {
          return '三'
        } else if (this.$store.state.XZ.length || this.$store.state.TK.length) {
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
  .exam{
    background-color: #fff;
    position: relative;
    margin-left: 200px;
    width: 915px;
    padding: 40px 40px 40px 100px;
    min-height: 910px;
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
    font: 22px Arial bold;
    line-height: 40px;
  }
  .exam_name2{
    font: 18px Arial;
    line-height: 1.5em;
  }
  .exam_name3{
    font: 14px 微软雅黑;
    height: 50px;
    line-height: 50px;
  }
  .exam_name4{
    font: 14px 微软雅黑;
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
  .low{
    height: 36px;
    position: relative;
    bottom: 0;
    display: flex;
    flex-direction: row;
    line-height: 36px;
    padding: 0 20px;
    color: #fff;
    font-size: 12px;
    border-radius: 0 0 10px 10px;
  }
  .low div{
    margin-left: 15px;
    cursor: pointer;
  }
  .TH{
    font-size: 16px;
  }
  .item-ul::-webkit-scrollbar{
    width: 0;
  }
  .TM{
    font-family: 新宋体;
    font-weight: bold;
    font-size: 17px;
  }
</style>
