<template>
  <div>
    <div id="mask" :style="{minHeights: minHeights + 'px'}" v-if="popoverFirst"></div>
    <zsd-tree></zsd-tree>
    <my-head></my-head>
    <mySpace></mySpace>
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
    <div class="query" :class="{topfix2: topFixed}">{{nowQuery}}</div>
    <div class="first-head">
      <div class="transverse"></div>
      <div class="header-concern" :class="{topfix: topFixed}">
        <div v-if="$store.state.zsdTreeTags.length && $store.state.value === 2" class="zsd-tags">
          <el-tag
            style="margin-top: 5px"
            color="#fff"
            :key="tag"
            v-for="tag in $store.state.zsdTreeTags"
            closable
            @close="zsdTagsClose(tag)">
            {{tag}}
          </el-tag>
        </div>
        <div>
          <img src="./../../img/hand.png" alt="">
        </div>
        <div style="width: 120px">
          <el-select v-model="$store.state.value" placeholder="题干">
            <el-option
              v-for="item in $store.state.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="width: 70%">
          <el-input v-model="$store.state.input_message" :disabled="$store.state.value === 2" @keyup.native.enter="searchMsg()" :placeholder="$store.state.options[$store.state.value? $store.state.value : 0].holder">
            <template slot="append">
              <el-radio-group v-model="$store.state.select" size="mini">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="选择"></el-radio-button>
                <el-radio-button label="填空"></el-radio-button>
                <el-radio-button label="解答"></el-radio-button>
              </el-radio-group>
            </template>
          </el-input>
        </div>
        <div>
          <el-button @click="searchMsg()" type="primary" icon="el-icon-search" style="transform: translateX(-5px)">搜 索</el-button>
        </div>
        <div style="position: relative">
          <el-button icon="el-icon-picture-outline" type="warning">图片搜索
            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" icon="el-icon-search"/>
          </el-button>
        </div>
      </div>
    </div>
    <div id="main" v-if="$store.state.nowSub.length" :style="{minHeight: minHeight + 'px'}">
      <div class="block">
        <div>
          <img :src="$store.state.cropImg" @click="imgVisible = true" class="pre-img">
          <ul>
            <li class="ques" v-for="item in nowQues" :key="$store.state.nowSub[item + nowPage - 1].unique">
              <div class="up">
                <span class="TH">{{titleNumber(item + nowPage)}}</span>
                <span class="QUE" v-html="$store.state.nowSub[item + nowPage - 1].que"></span>
              </div>
              <div class="popoverOne" v-if="popoverFirst && item === 1">
                <div class="popoverOne-arrow"></div>
                <p class="popover-p">点击推荐本题的同类型题目</p>
                <div><el-button type="warning" size="mini" plain style="margin-left: 200px" @click="popoverClickOne()">我知道了</el-button></div>
              </div>
              <div class="low">
                <div><el-button type="primary" size="mini" @click="showJX(item + nowPage - 1)" icon="el-icon-document">查看解析</el-button></div>
                <div><el-button type="primary" @click="addPaper(item + nowPage - 1)" size="mini" icon="el-icon-plus">添加试题</el-button></div>
                <div><el-button type="danger" size="mini" @click="$router.push({path: '/index', query: {servlet: 'againSearch', msg:$store.state.nowSub[item + nowPage - 1].unique}})" icon="el-icon-search">相似推荐</el-button></div>
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
            :total="$store.state.nowSub.length">
          </el-pagination>
        </div>
      </div>
      <answer></answer>
    </div>
    <div v-else :style="{minHeight: minHeight + 'px'}">
      <p style="position: absolute; top: 250px; left: 50%; transform: translateX(-50%)">暂没有与搜索内容相关的题目</p>
    </div>
    <my-foot></my-foot>
    <gotop></gotop>
  </div>
</template>

<script>
  import zsdTree from '../common/zsdTree.vue'
  import gotop from '../common/gotop.vue'
  import mySpace from '../common/mySpace.vue'
  import VueCropper from 'vue-cropperjs'
  import myHead from '../common/header.vue'
  import myFoot from '../common/footer.vue'
  import answer from '../common/anwer.vue'
  import lrz from 'lrz'
  export default {
    components: {
      VueCropper,
      myHead,
      answer,
      myFoot,
      mySpace,
      gotop,
      zsdTree
    },
    data () {
      return {
        imgVisible: false,
        imageSrc: '',
        visible: false,
        minHeight: 0,
        minHeights: 0,
        topFixed: false,
        popoverFirst: false
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
        if (this.$store.state.value === 2) {
          let ms = this.$store.state.zsdTreeTags.join('；')
          this.$router.push({path: '/index', query: {servlet: 'wordSearch', msg: ms, kind: this.$store.state.select, way: 2, num: num}})
        } else {
          this.$router.push({path: '/index', query: {servlet: 'wordSearch', msg: this.$store.state.input_message, kind: this.$store.state.select, way: this.$store.state.value, num: num}})
        }
      },
      showJX (x) {
        this.$store.state.myTest[0].que = this.$store.state.nowSub[x].que
        this.$store.state.myTest[0].kddp = this.$store.state.nowSub[x].kddp
        this.$store.state.myTest[0].zsd = this.$store.state.nowSub[x].zsd
        this.$store.state.myTest[0].answer = this.$store.state.nowSub[x].answer
        this.$store.state.myTest[0].jx = this.$store.state.nowSub[x].jx
        this.$store.state.IFJX = true
      },
      addPaper (x) {
        let userId = sessionStorage.getItem('userId')
        let sessionId = sessionStorage.getItem('sessionId')
        if (sessionId) {
          let ida = this.$store.state.nowSub[x].unique
          let formData = new FormData()
          formData.append('userId', userId)
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
      titleNumber: function (index) {
        if (sessionStorage.getItem('title_number') === 'false') {
          return index + '.'
        } else {
          if (index === 1) {
            return '相似题:'
          } else {
            return index + '.'
          }
        }
      },
      nextPage (val) {
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
      },
      popoverClickOne () {
        this.popoverFirst = false
        localStorage.setItem('ifFirsts', 'false')
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = ''
        document.addEventListener('touchmove', mo, false)
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    computed: {
      nowPage: function () {
        return (this.$store.state.history.nowHomePage - 1) * 10
      },
      nowQues: function () {
        if (this.$store.state.history.nowHomePage <= this.$store.state.nowSub.length / 10) {
          return 10
        } else {
          return this.$store.state.nowSub.length % 10
        }
      },
      nowQuery: function () {
        return this.$route.query
      }
    },
    watch: {
      nowQuery: function (val) {
        if (this.$route.path === '/index') {
          switch (val.servlet) {
            case 'againSearch':
              this.againSearch(val.msg)
              break
            case 'wordSearch':
              this.$store.state.select = val.kind
              this.$store.state.value = parseInt(val.way)
              if (this.$store.state.value === 2) {
                this.$store.state.zsdTreeTags = val.msg.split('；')
              } else {
                this.$store.state.input_message = val.msg
              }
              this.wordSearch(val.msg)
              break
            case 'imgSearch':
              this.$store.state.cropImg = val.msg
              this.imgSearch()
              break
          }
        }
      }
    },
    beforeCreate () {
      if (!localStorage.getItem('ifFirsts')) {
        localStorage.setItem('ifFirsts', 'true')
      }
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 251
      this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      if (sessionStorage.getItem('subj')) { this.$store.state.nowSub = JSON.parse(sessionStorage.getItem('subj')) }
      switch (this.$route.query.servlet) {
        case 'againSearch':
          this.againSearch(this.$route.query.msg)
          break
        case 'wordSearch':
          this.$store.state.select = this.$route.query.kind
          this.$store.state.value = parseInt(this.$route.query.way)
          if (this.$store.state.value === 2) {
            this.$store.state.zsdTreeTags = this.$route.query.msg.split('；')
          } else {
            this.$store.state.input_message = this.$route.query.msg
          }
          this.wordSearch(this.$route.query.msg)
          break
        case 'imgSearch':
          this.$store.state.cropImg = this.$route.query.msg
          this.imgSearch()
          break
      }
      if (localStorage.getItem('ifFirsts') === 'true') {
        this.popoverFirst = true
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', mo, false)
      }
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
  }
  #main{
    width: 100%;
    position: relative;
    top: 40px;
    overflow: hidden;
  }
  .first-head{
    width: 100%;
    height: 160px;
    position: relative;
    top: 40px;
    box-sizing: border-box;
    background-image: url("./../../img/base_head.png");
    background-size: cover;
    z-index: 9;
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
  .block{
    width: 68%;
    margin: 20px 16% 20px 16%;
  }
  .ques{
    position: relative;
    width: 98%;
    clear: both;
    margin: 10px 1% 10px 1%;
    box-sizing: border-box;
    border-radius: 10px;
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
    height: 36px;
    position: relative;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    line-height: 36px;
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
    top: 40px;
    height: 40px;
  }
</style>
