<template>
  <div @scroll.prevent>
    <div id="mask" :style="{minHeight: minHeight + 'px'}" v-if="popoverFirst || popoverTwo">
      <div class="popoverOne" v-if="popoverFirst">
        <div class="popoverOne-arrow"></div>
        <p class="popover-p">点击可输入图片，搜索题目并且推荐同类型题目</p>
        <div><el-button type="warning" size="small" plain style="margin-left: 300px" @click="popoverClickOne()">我知道了</el-button></div>
      </div>
      <div class="popoverTwo" v-if="popoverTwo">
        <div class="popoverTwo-arrow"></div>
        <p class="popover-p">点击根据输入文字搜索题目，可在左侧选择输入类型，在右边选择输入题型</p>
        <div><el-button type="warning" size="small" plain style="margin-left: 500px" @click="popoverClickTwo()">我知道了</el-button></div>
      </div>
    </div>
    <my-head></my-head>
    <mySpace></mySpace>
    <zsd-tree></zsd-tree>
    <el-dialog title="试题解析" :visible.sync="IFJX" width="70%">
      <div class="ST TI" v-html="myTest[0].que"></div>
      <div class="JX TI"><span class="jx">解析：</span><span v-html="myTest[0].jx"></span></div>
      <div class="JX TI"><span class="jx">解答：</span><span v-html="myTest[0].answer"></span></div>
    </el-dialog>
    <el-dialog :visible.sync="visible" width="60%" center>
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
        <div class="transverse"></div>
        <div class="header-concern">
          <div v-if="$store.state.zsdTreeTags.length && $store.state.value === 2" class="zsd-tags">
            <el-tag
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
            <el-button @click="searchMsg()" type="primary" icon="el-icon-search" style="transform: translateX(-5px)">搜索</el-button>
          </div>
          <div style="position: relative">
            <el-button icon="el-icon-picture-outline" type="warning">图片搜索
              <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" icon="el-icon-search"/>
            </el-button>
          </div>
        </div>
      </div>
      <div class="first-middle">
        <div style="background-color: #fff">
          <div class="middle-up my-positions">
            <div class="up-title upt">
              <p>——<span>信息导航</span>——</p>
            </div>
            <div class="up-body">
              <div class="up-main" @click="signShows()">
                <img src="./../../img/base_four.png" alt=""/>
                <p>用户登录</p>
              </div>
              <div class="up-main" @click="goMyExam()">
                <img src="./../../img/base_one.png" alt=""/>
                <p>历史试题</p>
              </div>
              <div class="up-main" @click="searchHistory()">
                <img src="./../../img/base_three.png" alt=""/>
                <p>搜索历史</p>
              </div>
              <div class="up-main" @click="goBasket()">
                <img src="./../../img/base_two.png" alt=""/>
                <p>试题篮</p>
              </div>
            </div>
          </div>
        </div>
        <div class="down-middle">
          <div class="middle-down my-positions">
            <div class="up-title downt">
              <p>——<span>热门试题推荐</span>——</p>
            </div>
            <div class="up-body">
              <div class="down-main" v-if="hotQuestions.length">
                <div class="down-que left-que" v-for="item in 3" v-bind:key="hotQuestions[item - 1].unique">
                  <div>
                    <p><img src="./../../img/fire.png" /><span v-html="hotQuestions[item - 1].que"></span></p>
                    <div class="fire-foot">
                      <div class="fire-foot-div" @click="againSearch(hotQuestions[item - 1].unique)">推荐</div>
                      <div class="fire-foot-div" @click="showMore(item - 1)">解析</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="down-main" v-else></div>
              <div class="down-line">
                <div class="line"></div>
              </div>
              <div class="down-main" v-if="hotQuestions.length">
                <div class="down-que right-que" v-for="item in hotQuestions.length-3" v-bind:key="hotQuestions[item + 2].unique">
                  <div>
                    <p><img src="./../../img/fire.png" /><span v-html="hotQuestions[item + 2].que"></span></p>
                    <div class="fire-foot">
                      <div class="fire-foot-div" @click="againSearch(hotQuestions[item + 2].unique)">推荐</div>
                      <div class="fire-foot-div" @click="showMore(item + 2)">解析</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="down-main" v-else></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <my-foot></my-foot>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import mySpace from './mySpace.vue'
  import myHead from './header.vue'
  import zsdTree from './zsdTree.vue'
  import myFoot from './footer.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import lrz from 'lrz'

  export default {
    data () {
      return {
        visible: false,
        imageSrc: '',
        hotQuestions: [],
        IFJX: false,
        myTest: [
          { que: '' },
          { answer: '' },
          { jx: '' }
        ],
        minHeight: 0,
        popoverFirst: false,
        popoverTwo: false
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
        this.$store.state.history.loading = true
        this.visible = false
        const page = this.$store.state.cropImg
        let arr = page.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        const obj = new Blob([u8arr], {type: mime})
        const fd = new FormData()
        fd.append('upfile', obj, 'image.png')
        let url = this.$store.state.urls.url + 'pictureServlet'
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.nowSub = []
          sessionStorage.setItem('defaultSrc', this.$store.state.cropImg)
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
          this.$store.state.history.loading = false
          this.$router.push({path: '/index', query: {servlet: 'pictureServlet', msg: this.$store.state.cropImg}})
          this.$message.success('推荐成功')
        }, (res) => {
          this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
          this.$store.state.history.loading = false
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: '未知错误'
              })
            }
          })
        })
      },
      searchMsg () {
        this.wordSearch(this.$store.state.input_message)
      },
      showMore (num) {
        this.myTest[0].que = this.hotQuestions[num].que
        this.myTest[0].answer = this.hotQuestions[num].answer
        this.myTest[0].jx = this.hotQuestions[num].jx
        this.IFJX = true
      },
      getHot () {
        let url = this.$store.state.urls.url + 'GetHotServlet'
        this.$axios.get(url, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.hotQuestions = response.data
        }, (res) => {
        })
      },
      popoverClickOne () {
        this.popoverFirst = false
        this.popoverTwo = true
      },
      popoverClickTwo () {
        this.popoverTwo = false
        localStorage.setItem('ifFirst', 'false')
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = ''
        document.addEventListener('touchmove', mo, false)
      }
    },
    beforeCreate () {
      if (!localStorage.getItem('ifFirst')) {
        localStorage.setItem('ifFirst', 'true')
      }
    },
    created () {
      this.getHot()
      this.minHeight = document.documentElement.clientHeight
      if (localStorage.getItem('ifFirst') === 'true') {
        this.popoverFirst = true
        const mo = function (e) { e.preventDefault() }
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', mo, false)
      }
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
    height: 160px;
    position: relative;
    top: 40px;
    box-sizing: border-box;
    background-image: url("./../../img/base_head.png");
    background-size: cover;
  }
  .first-middle{
    width: 100%;
    position: relative;
    top: 40px;
  }
  .middle-up {
    height: 240px;
  }
  .up-title{
    text-align: center;
    font-size: 19px;
    font-family: 微软雅黑;
  }
  .upt{
    height: 60px;
    color: #409EFF;
    line-height: 60px;
  }
  .downt{
    height: 60px;
    color: #fff;
    line-height: 60px;
  }
  .up-title p span{
    margin-left: 20px;
    letter-spacing: 20px;
  }
  .up-body{
    display: flex;
    flex-direction: row;
  }
  .up-main{
    height: 180px;
    width: 25%;
    cursor: pointer;
  }
  .up-main img{
    height: 130px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .up-main p{
    height: 50px;
    line-height: 50px;
    text-align: center;
    letter-spacing: 3px;
    font-weight: 500;
  }
  .up-main:hover p{
    text-decoration: underline;
    font-style: oblique;
  }
  .down-middle{
    background-image: url("./../../img/base.png");
    background-size: cover;
  }
  .middle-down{
    height: 480px;
  }
  .down-main{
    width: 50%;
    height: 420px;
  }
  .down-line{
    width: 30px;
  }
  .line{
    width: 2px;
    height: 420px;
    background-color: #fff;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .down-que{
    position: relative;
    width: 93%;
    height: 90px;
    background-color: rgba(124, 146, 203, .75);
  }
  .down-que img{
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .down-que p{
    font-size: 14px;
    color: #fff;
    display: -webkit-box;
    overflow: hidden;
    margin: 15px 20px 10px 20px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .left-que{
    float: left;
    margin-bottom: 50px;
  }
  .right-que{
    float: right;
    margin-top: 50px;
  }
  .down-que:hover .fire-foot{
    opacity: 1;
  }
  .fire-foot{
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row-reverse;
    opacity: 0;
    transition: .5s;
  }
  .fire-foot-div{
    margin-right: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
  }
</style>
