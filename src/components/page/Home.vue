<template>
  <div>
    <!--<div id="mask" :style="{minHeights: minHeights + 'px'}" v-if="popoverFirst && $store.state.nowSub.length"></div>-->
    <my-head></my-head>
    <mySpace></mySpace>
    <top-search v-if="topFixed"></top-search>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="60%" center :append-to-body="true">
      <vue-cropper ref='cropper'
                   :src="imageSrc"
                   :ready="cropImage"
                   :zoom="cropImage"
                   :cropmove="cropImage"
                   :autoCropArea = "0.99"
                   :background = 'false'
                   style="width:100%;height:100%;max-height: 60vh">
      </vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rotateImage()">旋 转</el-button>
        <el-button type="primary" @click="sureCrop">确 定</el-button>
        <el-button @click="cancelCrop" type="warning">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" width="70%" :append-to-body="true">
      <img style="max-height: 60vh; margin-left: 50%; transform: translateX(-50%)" :src="$store.state.cropImg">
    </el-dialog>
    <div class="query">{{nowQuery}}</div>
    <div class="home-main" :style="{minHeight: minHeight + 'px'}">
      <div class="main-middle">
        <div class="main-left">
          <div class="header-concern">
            <div style="width: 100%; position: relative">
              <el-input v-model="$store.state.input_message" @keyup.native.enter="searchMsg()" placeholder="题干/知识点/试卷"></el-input>
              <div style="position: absolute; right: 15px; top: 6px; cursor: pointer">
                <img src="../../img/phone.png" width="28px" />
                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
              </div>
            </div>
            <div class="btn-primary search-btn" @click="searchMsg()">
              <i class="el-icon-search">搜题</i>
            </div>
            <div class="btn-primary search-page" @click="searchMsg()">
              <i class="el-icon-document">组卷</i>
            </div>
          </div>
          <div class="screen">
            <div class="screen-title">
              <div class="screen-name" @click="screenShow = !screenShow">筛选</div>
              <div class="screen-menu"><img src="../../img/menu.png" alt="" /></div>
              <div class="screen-edition">人教版：七年级上</div>
            </div>
            <transition name="el-zoom-in-top">
              <div class="screen-window" v-if="screenShow">
                <div class="screen-list">
                  <div class="screen-ul">题型</div>
                  <div class="screen-li" :class="{choice: screenChoiceOne[0]}" @click="choiceOne(0)">全部</div>
                  <div class="screen-li" :class="{choice: screenChoiceOne[1]}" @click="choiceOne(1)">选择题</div>
                  <div class="screen-li" :class="{choice: screenChoiceOne[2]}" @click="choiceOne(2)">填空题</div>
                  <div class="screen-li" :class="{choice: screenChoiceOne[3]}" @click="choiceOne(3)">解答题</div>
                </div>
                <div class="screen-list">
                  <div class="screen-ul">难度</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[0]}" @click="choiceTwo(0)">全部</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[1]}" @click="choiceTwo(1)">易</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[2]}" @click="choiceTwo(2)">较易</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[3]}" @click="choiceTwo(3)">中档</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[4]}" @click="choiceTwo(4)">较难</div>
                  <div class="screen-li" :class="{choice: screenChoiceTwo[5]}" @click="choiceTwo(5)">难</div>
                </div>
              </div>
            </transition>
          </div>
          <div class="block" v-if="$store.state.nowSub.length"
               v-loading="$store.state.history.loadingTwo"
               element-loading-text="加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.1)"
               >
            <div>
              <img :src="$store.state.cropImg" @click="imgVisible = true" class="pre-img">
              <ul>
                <li class="ques" v-for="(value, index) in $store.state.nowSub" :key="value.unique">
                  <div class="up">
                    <span class="TH">{{$store.state.nowSubs}}{{index + 1}}</span>
                    <span class="QUE" v-html="value.question"></span>
                  </div>
                  <!--<div class="popoverOne" v-if="popoverFirst && item === 1">
                    <div class="popoverOne-arrow"></div>
                    <p class="popover-p">点击推荐本题的同类型题目</p>
                    <div><el-button type="warning" size="mini" plain style="margin-left: 200px" @click="popoverClickOne()">我知道了</el-button></div>
                  </div>-->
                  <div class="low">
                    <div><el-button type="primary" size="mini" @click="showJX(index)">查看解析</el-button></div>
                    <div><el-button type="primary" @click="getPaperLi()" size="mini">添加试题</el-button></div>
                    <div><el-button type="danger" size="mini" @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:value.unique}})">相似推荐</el-button></div>
                  </div>
                </li>
              </ul>
              <el-pagination
                class="que-page"
                background
                layout="prev, pager, next"
                :page-size="10"
                :current-page.sync="$store.state.history.nowHomePage"
                @current-change="nextPage"
                :total="500">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div class="right-fix">
            <div class="hot-search">热门搜索</div>
            <div class="hot-list">
              <ul>
                <li class="list" v-for="(value, index) in searchHot">
                  <img v-if="index < 3" src="../../img/fire.png" width="16px" style="transform: translateY(-3px);margin-right: 3px" alt="" />{{index + 1}}. {{value}}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <answer></answer>
    <div v-if="!$store.state.nowSub.length" :style="{minHeight: minHeight + 'px'}">
      <p style="position: absolute; top: 250px; left: 50%; transform: translateX(-50%)">暂没有与搜索内容相关的题目</p>
    </div>
  </div>
</template>

<script>
  import mySpace from '../common/mySpace.vue'
  import VueCropper from 'vue-cropperjs'
  import myHead from '../common/header.vue'
  import answer from '../common/anwer.vue'
  import topSearch from '../common/SearchTop.vue'
  import lrz from 'lrz'
  export default {
    components: {
      VueCropper,
      myHead,
      answer,
      mySpace,
      topSearch
    },
    data () {
      return {
        imgVisible: false,
        imageSrc: '',
        visible: false,
        minHeight: 0,
        minHeights: 0,
        topFixed: false,
        // popoverFirst: false,
        screenShow: true,
        screenChoiceOne: [true, false, false, false],
        screenChoiceTwo: [true, false, false, false, false, false],
        searchHot: [
          '三角形辅助线做法',
          '二次函数综合题',
          '一元一次方程的应用',
          '2018长沙市中考试卷',
          '二次函数的动点问题',
          '初中数学新定义问题',
          '中考压轴题',
          '一元一次方程的基础测试',
          '一元一次方程的典型例题',
          '全等三角形培优经典题目'
        ]
      }
    },
    methods: {
      setImage (e) {
        const that = this
        const file = e.target.files[0]
        if (!file.type.includes('image/')) {
          return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          e.target.value = ''
          lrz(event.target.result, { width: 1080 }).then(function (rst) {
            that.visible = true
            that.imageSrc = rst.base64
            that.$refs.cropper && that.$refs.cropper.replace(rst.base64)
          }).catch(function (err) {
            console.log('压缩失败' + err)
          }).always(function () {
          })
        }
        reader.readAsDataURL(file)
      },
      cropImage () {
        this.$store.state.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      },
      rotateImage () {
        this.$refs.cropper.rotate(90)
      },
      cancelCrop () {
        this.visible = false
        this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      },
      sureCrop () {
        this.visible = false
        this.$router.push({path: '/index', query: {servlet: 'imgSearch', msg: this.$store.state.cropImg}})
      },
      searchMsg () {
        let num = Math.random() * 10000
        this.$router.push({path: '/index', query: {servlet: 'wordSearch', msg: this.$store.state.input_message, page: 1, num: num}})
      },
      choiceOne (num) {
        for (let i = 0; i < this.screenChoiceOne.length; i++) {
          this.screenChoiceOne[i] = false
        }
        this.$set(this.screenChoiceOne, num, true)
      },
      choiceTwo (num) {
        for (let i = 0; i < this.screenChoiceTwo.length; i++) {
          this.screenChoiceTwo[i] = false
        }
        this.$set(this.screenChoiceTwo, num, true)
      },
      showJX (x) {
        this.$store.state.myTest[0].question = this.$store.state.nowSub[x].question
        this.$store.state.myTest[0].kddp = this.$store.state.nowSub[x].kddp
        this.$store.state.myTest[0].knowledge = this.$store.state.nowSub[x].knowledge
        this.$store.state.myTest[0].answer = this.$store.state.nowSub[x].answer
        this.$store.state.myTest[0].analysis = this.$store.state.nowSub[x].analysis
        this.$store.state.IFJX = true
      },
      getPaperLi () {
        this.getPaperList()
      },
      addPaper (x) {
        let sessionId = sessionStorage.getItem('sessionId')
        if (sessionId) {
          let ida = this.$store.state.nowSub[x].unique
          let formData = new FormData()
          formData.append('sessionId', sessionId)
          formData.append('unique', ida)
          let url = this.$store.state.urls.url + 'AddQueServlet'
          this.$axios.post(url, formData, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            this.$message.success('试题添加成功')
          }, (response) => {
            this.$message.error('请求服务端失败')
          })
        } else {
          this.signShows()
        }
      },
      /* titleNumber: function (index) {
        if (sessionStorage.getItem('title_number') === 'false') {
          return index + '.'
        } else {
          if (index === 1) {
            return '相似题:'
          } else {
            return index + '.'
          }
        }
      }, */
      nextPage (val) {
        this.$router.push({path: '/index', query: {servlet: 'wordSearch', msg: this.$store.state.input_message, page: val}})
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= 200) {
          this.topFixed = true
        } else {
          this.topFixed = false
        }
      }/* ,
      popoverClickOne () {
        this.popoverFirst = false
        localStorage.setItem('ifFirsts', 'false')
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = ''
        document.addEventListener('touchmove', mo, false)
      } */
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      nowQuery: function () {
        return this.$route.query
      }
    },
    watch: {
      nowQuery: function (val) {
        if (this.$route.path === '/index') {
          switch (val.servlet) {
            case 'wordSearch':
              this.$store.state.input_message = val.msg
              let page = parseInt(val.page)
              this.searchQuestion(val.msg, page)
              break
            case 'imgSearch':
              this.$store.state.cropImg = val.msg
              this.imgSearch()
              break
          }
        }
      }
    },
    /* beforeCreate () {
      if (!localStorage.getItem('ifFirsts')) {
        localStorage.setItem('ifFirsts', 'true')
      }
    }, */
    created () {
      this.minHeight = document.documentElement.clientHeight - 251
      this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      switch (this.$route.query.servlet) {
        case 'wordSearch':
          this.$store.state.input_message = this.$route.query.msg
          let page = parseInt(this.$route.query.page)
          this.searchQuestion(this.$route.query.msg, page)
          break
        case 'imgSearch':
          this.$store.state.cropImg = this.$route.query.msg
          this.imgSearch()
          break
      }
      /* if (localStorage.getItem('ifFirsts') === 'true') {
        this.popoverFirst = true
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', mo, false)
      } */
    }
  }
</script>

<style scoped>
 /* #mask{
    width: 100%;
    height: 100%;
    min-width: 1200px;
    background-color: rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
    position: absolute;
    z-index: 998;
  }
  .popoverOne{
    border-radius: 10px;
    width: 300px;
    height: 120px;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    bottom: 60px;
    right: 10px;
    z-index: 999;
  }
  .popoverOne-arrow{
    width: 0;
    height: 0;
    border: 20px solid;
    border-color: black transparent transparent transparent;
    opacity: .5;
    position: absolute;
    bottom: -40px;
    right: 50px;
  }
  .popover-p{
    line-height: 80px;
    color: #fff;
    letter-spacing: 1px;
    text-indent: 20px;
  }*/
  .home-main{
    width: 100%;
    position: relative;
    top: 50px;
    z-index: 9;
    background-color: #fbfbfb;
  }
  .main-middle{
    width: 86%;
    min-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
  }
  .main-left{
    width: 75%;
    margin: 20px 2% 20px 0;
  }
  .main-right{
    margin-top: 20px;
  }
  .right-fix{
    width: 23%;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    position: fixed;
  }
  .screen{
  }
  .screen-title{
    display: flex;
    flex-direction: row;
  }
  .screen-name{
    margin: 10px 3px 10px 0;
    cursor: pointer;
    color: #333;
  }
  .screen-name:hover{
    text-decoration: underline;
  }
  .screen-edition{
    margin: 10px 3px 10px 0;
    cursor: pointer;
    color: #409EFF;
    font-weight: bold;
  }
  .screen-menu{
    margin-top: 8px;
  }
  .screen-menu img{
    width: 32px;
    height: 25px;
  }
  .screen-window{
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    padding: 10px;
    background-color: #fff;
  }
  .screen-list{
    margin: 10px 0 10px 20px;
    display: flex;
    flex-direction: row;
    color: #333;
  }
  .screen-ul{
    font-size: 14px;
    font-weight: 600;
    font-family: "PingFang SC";
    letter-spacing: 1px;
    margin-right: 20px;
  }
  .screen-li{
    font-size: 14px;
    letter-spacing: 1px;
    margin-right: 20px;
    border-radius: 3px;
    padding: 2px 3px;
    cursor: pointer;
  }
  .choice{
    background-color: #409EFF;
    color: #fff;
  }
  .hot-search{
    height: 35px;
    line-height: 35px;
    color: #333;
    font-size: 17px;
    font-family: 黑体;
    width: 90%;
    margin: 0 auto 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #DCDFE6;
  }
  .list{
    letter-spacing: 1px;
    width: 88%;
    margin: 0 auto;
    color: #333;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .pre-img{
    max-width: 96%;
    max-height: 200px;
    border: 1px solid #eee;
    border-radius: 5px;
    box-sizing: border-box;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .header-concern {
    display: flex;
    flex-direction: row;
    position: relative;
  }
  .block{
  }
  .ques{
    position: relative;
    clear: both;
    margin: 10px 0;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #DCDFE6;
    word-wrap: break-word;
    letter-spacing: 1px;
  }
  .up{
    line-height: 25px;
    font-size: 0.875rem;
    padding: 20px 20px 20px 20px;
  }
  .low{
    background-color: #f4f4f4;
    height: 40px;
    position: relative;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    line-height: 40px;
    box-sizing: border-box;
    border-top: 1px solid #dadada;
    padding: 0 20px;
    color: #666666;
    border-radius: 0 0 10px 10px;
    font-size: 0.8125rem;
  }
  .low div{
    margin-left: 15px;
    cursor: pointer;
  }
  .que-page{
    text-align: center;
    margin: 50px 0;
    font-size: 16px;
  }
  .topfix {
    position: fixed !important;
    top: 60px;
    z-index: 999;
    background-color: #fff;
  }
  .query {
    color:#F2F6FC;
    width: 100%;
    background-color: #F2F6FC;
    text-align: center;
    position: fixed;
    top: 50px;
    height: 0;
    opacity: 0;
  }
</style>
