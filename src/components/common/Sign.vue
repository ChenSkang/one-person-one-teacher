<template>
  <div>
    <!--<div id="mask" :style="{minHeight: minHeight + 'px'}" v-if="popoverFirst || popoverTwo">
      <div class="popoverOne" v-if="popoverFirst">
        <div class="popoverOne-arrow"></div>
        <p class="popover-p">点击可输入图片，搜索题目并且推荐同类型题目</p>
        <div><el-button type="warning" size="small" plain style="margin-left: 300px" @click="popoverClickOne()">我知道了</el-button></div>
      </div>
      <div class="popoverTwo" v-if="popoverTwo">
        <div class="popoverTwo-arrow"></div>
        <p class="popover-p">输入需要搜索的内容，在左侧选择搜索类型，在右侧选择题型</p>
        <div><el-button type="warning" size="small" plain style="margin-left: 500px" @click="popoverClickTwo()">我知道了</el-button></div>
      </div>
    </div>-->
    <my-head></my-head>
    <my-space></my-space>
    <el-dialog title="试题解析" :visible.sync="IFJX" width="70%" :append-to-body="true">
      <div class="ST TI" v-html="myTest[0].question"></div>
      <div class="JX TI"><span class="jx">解析：</span><span v-html="myTest[0].analysis"></span></div>
      <div class="JX TI"><span class="jx">解答：</span><span v-html="myTest[0].answer"></span></div>
    </el-dialog>
    <el-dialog :visible.sync="visible" width="60%" center :append-to-body="true">
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

    <div>
      <div class="first-head">
        <div class="search-logo">OPOT</div>
        <div class="header-concern">
          <div style="width: 584px; min-width: 584px; position: relative">
            <el-input v-model="$store.state.input_message" @keyup.native.enter="searchMsg()" placeholder="题干/知识点/试卷"></el-input>
            <div style="position: absolute; right: 15px; top: 6px; cursor: pointer">
              <img src="../../img/phone.png" width="28px" />
              <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
            </div>
          </div>
          <div class="btn-primary search-btn" @click="searchMsg()">
            <i class="el-icon-search">搜题</i>
          </div>
          <div class="btn-primary search-page">
            <i class="el-icon-document">组卷</i>
          </div>
        </div>
        <div class="fire" @click="searchHotMsg(fireMsg)">
          <img src="../../img/fire.png" width="16px" style="transform: translateY(-3px)" alt="" />&nbsp;&nbsp;<span>{{fireMsg}}</span>
        </div>
      </div>
      <div class="home-main">
        <div class="main-title">
          <div class="title-line">每日推荐</div>
        </div>
        <div class="note">
          <img @click="zsdShow = !zsdShow" src="../../img/note.png" alt="" />
          <div class="note-zsd" v-if="zsdShow">
            <zsd-tree></zsd-tree>
          </div>
        </div>
        <div class="main-popular">
          <div class="main-hot hot-left" v-if="hotQuestions.length">
            <div class="que-up">
              <img src="../../img/book.png" alt="" />
            </div>
            <div class="que-down">
              <div v-for="item in 6">
                <div class="que-show" @click="showMore(item - 1)">
                  <span>{{item}}.</span><span v-html="hotQuestions[item-1].question"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="main-hot hot-right">
            <div class="hot-search">热门搜索</div>
            <div class="hot-list">
              <ul>
                <li class="list" v-for="(value, index) in searchHot" @click="searchHotMsg(value)">
                  <img v-if="index < 3" src="../../img/fire.png" width="16px" style="transform: translateY(-3px);margin-right: 3px" alt="" />{{index + 1}}. {{value}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="main-foot">
          <div class="foot-text">
            <div><span>关于我们</span></div>
            <div>©2017-2019/冀ICP备18020905号 ©opot.net.cn版权所有</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import mySpace from './mySpace.vue'
  import myHead from './HomeHead.vue'
  import zsdTree from './zsdTree.vue'
  import myFoot from './footer.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import lrz from 'lrz'

  export default {
    data () {
      return {
        zsdShow: false,
        visible: false,
        imageSrc: '',
        hotQuestions: [],
        IFJX: false,
        myTest: [
          { que: '' },
          { answer: '' },
          { analysis: '' }
        ],
        minHeight: 0,
        popoverFirst: false,
        popoverTwo: false,
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
        ],
        fireMsg: '三角形辅助线做法',
        nowFire: 0
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
      },
      sureCrop () {
        this.visible = false
        let num = Math.random() * 10000
        let routeData = this.$router.resolve({
          path: '/imgSearch',
          query: {msg: this.$store.state.cropImg, page: 1, num: num}
        })
        window.open(routeData.href, '_blank')
      },
      searchMsg () {
        let num = Math.random() * 10000
        let routeData = this.$router.resolve({
          path: '/index',
          query: {servlet: 'wordSearch', msg: this.$store.state.input_message, page: 1, num: num}
        })
        window.open(routeData.href, '_blank')
      },
      searchHotMsg (hot) {
        let num = Math.random() * 10000
        let routeData = this.$router.resolve({
          path: '/index',
          query: {servlet: 'wordSearch', msg: hot, page: 1, num: num}
        })
        window.open(routeData.href, '_blank')
      },
      showMore (num) {
        this.myTest[0].question = this.hotQuestions[num].question
        this.myTest[0].answer = this.hotQuestions[num].answer
        this.myTest[0].analysis = this.hotQuestions[num].analysis
        this.IFJX = true
      },
      getHot () {
        let url = this.$store.state.urls.url + 'common/getHot'
        this.$axios.get(url, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.hotQuestions = response.data.data
        }, (res) => {
        })
      },
      againSearchs (x) {
        this.$router.push({path: '/index', query: {servlet: 'againSearch', msg: x}})
      },
      fireWord () {
        window.setInterval(() => {
          this.nowFire = (this.nowFire + 1) % 10
          this.fireMsg = this.searchHot[this.nowFire]
        }, 3000)
      }
     /* popoverClickOne () {
        this.popoverFirst = false
        this.popoverTwo = true
      },
      popoverClickTwo () {
        this.popoverTwo = false
        localStorage.setItem('ifFirst', 'false')
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = ''
        document.addEventListener('touchmove', mo, false)
      } */
    },
    beforeCreate () {
      if (!localStorage.getItem('ifFirst')) {
        localStorage.setItem('ifFirst', 'true')
      }
    },
    created () {
      this.getHot()
      this.fireWord()
      this.minHeight = document.documentElement.clientHeight
      /* if (localStorage.getItem('ifFirst') === 'true') {
        this.popoverFirst = true
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', mo, false)
      } */
    },
    components: {
      ElCol,
      ElRow,
      mySpace,
      VueCropper,
      myHead,
      myFoot,
      zsdTree
    }
  }
</script>

<style scoped>
  #mask{
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
    width: 400px;
    height: 120px;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    top: 160px;
    right: 16%;
  }
  .popoverOne-arrow{
    width: 0;
    height: 0;
    border: 20px solid;
    border-color: transparent transparent black transparent;
    opacity: .5;
    position: absolute;
    top: -40px;
    right: 50px;
  }
  .popover-p{
    line-height: 80px;
    color: #fff;
    letter-spacing: 1px;
    text-indent: 20px;
  }
  .popoverTwo{
    border-radius: 10px;
    width: 600px;
    height: 120px;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    top: 160px;
    right: 16%;
    transform: translateX(-250px);
  }
  .popoverTwo-arrow{
    width: 0;
    height: 0;
    border: 20px solid;
    border-color: transparent transparent black transparent;
    opacity: .5;
    position: absolute;
    top: -40px;
    right: 300px;
  }
  .first-head{
    width: 100%;
    height: 330px;
    position: relative;
    top: 50px;
    box-sizing: border-box;
    background-color: #2d8cf0
  }
  .header-concern {
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    position: relative;
    top: 90px;
  }
  .search-logo{
    height: 70px;
    text-align: center;
    font-size: 45px;
    line-height: 70px;
    color: #fff;
    position: relative;
    top: 80px;
  }
  .fire{
    font-size: 14px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    position: relative;
    top: 120px;
    text-align: center;
    cursor: pointer;
  }
  .home-main{
    width: 100%;
    position: relative;
    top: 50px;
    background-color: #fbfbfb;
  }
  .main-title{
    font-size: 16px;
    color: #333;
    margin: 0 auto 15px;
    width: 77%;
    min-width: 1000px;
    height: 40px;
    line-height: 40px;
  }
  .title-line{
    height: 40px;
    width: 73%;
    box-sizing: border-box;
    border-bottom: 1px solid #DCDFE6;
  }
  .note{
    position: absolute;
    top: -23px;
    right: 45px;
  }
  .note-zsd{
    position: absolute;
    right: 75px;
    z-index: 9;
    top: 40px;
  }
  .main-popular{
    position: relative;
    margin: 0 auto;
    width: 77%;
    min-width: 1000px;
    display: flex;
    flex-direction: row;
  }
  .hot-left{
    width: 73%;
    background-color: #fff;
    margin-right: 2%;
    font-size: 14px;
  }
  .que-up{
    margin-bottom: 20px;
  }
  .que-up img{
    width: 100%;
  }
  .que-down{
    box-sizing: border-box;
    border: 1px solid #eee;
  }
  .que-show{
    width: 95%;
    margin: 0 auto;
    padding: 10px 0;
    color: #333;
    font-size: 14px;
    letter-spacing: 1px;
    height: 100px;
    line-height: 30px;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 25px solid #fff;
    border-top: 1px solid #dcdfe6;
    cursor: pointer;
  }
  .hot-right{
    width: 25%;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
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
     cursor: pointer;
   }
  .list:hover{
    text-decoration: underline;
    color: #409EFF;
  }
  .main-foot{
    width: 100%;
    margin-top: 20px;
    height: 150px;
    box-sizing: border-box;
    border-top: 1px solid #DCDFE6;
  }
  .foot-text{
    line-height: 20px;
    font-size: 14px;
    color: #606266;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    width: 77%;
    min-width: 1000px;
  }
</style>
