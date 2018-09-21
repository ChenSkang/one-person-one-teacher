<template>
  <div>
    <my-head></my-head>
    <mySpace></mySpace>
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
        <el-button type="primary" @click="sureCrop" v-loading.fullscreen.lock="load">确 定</el-button>
        <el-button @click="cancelCrop" type="warning">取 消</el-button>
      </span>
    </el-dialog>

    <div>
      <div class="first-head">
        <div class="transverse"></div>
        <div class="header-concern">
          <div>
            <img src="./../../img/hand.png" alt="">
          </div>
          <div style="width: 80%">
            <el-input v-model="msg" v-on:keyup.enter="searchMsg()"></el-input>
          </div>
          <div>
            <el-button @click="searchMsg()" type="primary" icon="el-icon-search" style="transform: translateX(-10px)">搜索</el-button>
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
              <div class="down-main">
                <div class="down-que left-que" v-for="item in 3">
                  <div><p>{{hotQuestions[item - 1]}}</p></div>
                </div>
              </div>
              <div class="down-line">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <div class="down-main">
                <div class="down-que right-que" v-for="item in 3">
                  <div><p>{{hotQuestions[item + 2]}}</p></div>
                </div>
              </div>
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
  import myFoot from './footer.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import lrz from 'lrz'

  export default {
    data () {
      return {
        msg: '',
        visible: false,
        imageSrc: '',
        load: false,
        hotQuestions: [
          '一部长篇小说的字数约为3子子子子子这种630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）',
          '一部长篇小说的字数约为3630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）',
          '一部长篇小说的字数约为3630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）',
          '一部长篇小说的字数约为3630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）',
          '一部长篇小说的字数约为3630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）',
          '一部长篇小说的字数约为3630000字，用科学记数法表示为______字；1纳米=0.000000001米，用科学记数法表示为______（单位：米）'
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
        this.load = true
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
        let url = this.$store.state.urls.local + 'pictureServlet'
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
          this.load = false
          this.$router.push('/index')
          this.$message.success('推荐成功')
        }, (res) => {
          this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
          this.load = false
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
        this.load = true
        const str = this.msg
        let url = this.$store.state.urls.url + 'wordServlet'
        this.$axios.post(url, str, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.cropImg = ''
          sessionStorage.removeItem('defaultSrc')
          this.load = false
          this.$message.success('推荐成功')
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
          console.log(response.data)
          this.$router.push('/index')
        }, (response) => {
          this.load = false
          this.$alert('请检查文本内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: '未知错误'
              })
            }
          })
        })
      }
    },
    components: {
      ElCol,
      ElRow,
      mySpace,
      VueCropper,
      myHead,
      myFoot
    }
  }
</script>

<style scoped>
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
    width: 50%;
    position: relative;
    left: 25%;
    right: 25%;
  }
  .up-main p{
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
    width: 3px;
    height: 390px;
    background-color: #fff;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .down-que{
    width: 93%;
    height: 90px;
    background-color: rgba(124, 146, 203, .75);
    padding: 10px;
  }
  .down-que p{
    color: #fff;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .left-que{
    margin-bottom: 50px;
  }
  .right-que{
    float: right;
    margin-top: 50px;
  }
</style>
