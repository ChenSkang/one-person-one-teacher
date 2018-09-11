<template>
  <div>
    <mySpace></mySpace>
    <el-popover
      slot="append"
      placement="bottom"
      title="提示"
      width="250"
      trigger="manual"
      v-model="visibleTwo">
      <p>此处可注册或者登录帐号，只有登录后才可以添加试题到试题篮以及体验后续功能</p>
      <div style="text-align: right; margin: 5px 0 0 0">
        <el-button type="primary" size="mini" @click="signThree()">我知道了</el-button>
      </div>
      <el-button slot="reference" class="signSpace"></el-button>
    </el-popover>
    <el-dialog title="提示" :visible.sync="visibles" width="40%" :modal="false">
      <span>OPOT是面向初中数学教育，包含搜题，组卷，下载的辅助学习功能性网站</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="signOne()">我知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="60%" :show-close="false">
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
        <el-button @click="rotateImage()">转圈</el-button>
        <el-button @click="cancelCrop">取消</el-button>
        <el-button type="primary" @click="sureCrop" v-loading.fullscreen.lock="load">确定</el-button>
      </span>
    </el-dialog>
    <el-container>
      <el-header height="20vh">
      </el-header>
      <el-main class="main">
        <el-row class="concern">
          <el-col :span="24"><div class="hi"><h1>opot</h1></div></el-col>
        </el-row>
        <el-row class="concern">
          <el-col :span="24">
          </el-col>
        </el-row>
        <el-row class="concern">
          <el-col :span="24">
            <el-input v-model="msg" v-on:keyup.enter="searchMsg()">
              <el-popover
                slot="append"
                placement="bottom"
                title="提示"
                width="200"
                trigger="manual"
                v-model="visibleOne">
                <p>点击可选择图片进行搜索并可添加试题至试题篮</p>
                <div style="text-align: right; margin: 5px 0 0 0">
                  <el-button type="primary" size="mini" @click="signTwo()">我知道了</el-button>
                </div>
                <el-button slot="reference" class="crop-demo"></el-button>
              </el-popover>
              <el-button @click="searchMsg()" slot="append" v-if="msg" class="crop-demo-btn">搜索</el-button>
              <el-button v-else slot="append" class="crop-demo-btn" icon="el-icon-picture-outline">
                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" icon="el-icon-search"/>
              </el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import mySpace from './mySpace.vue'
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
        visibles: false,
        visibleOne: false,
        visibleTwo: false
      }
    },
    methods: {
      signOne () {
        this.visibles = false
        this.visibleOne = true
      },
      signTwo () {
        this.visibleOne = false
        this.visibleTwo = true
      },
      signThree () {
        this.visibleTwo = false
        localStorage.setItem('ifFirst', 'noFirst')
      },
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
      VueCropper
    },
    beforeCreate () {
      if (!localStorage.getItem('ifFirst')) {
        localStorage.setItem('ifFirst', 'first')
      }
    },
    created () {
      if (localStorage.getItem('ifFirst') === 'first') {
        this.visibles = true
      }
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    text-align: center;
  }
  .concern{
    width: 45%;
    margin-left: 27.5%;
  }
  @media screen and (max-width: 500px) {
    .concern {
      width: 80%;
      margin-left: 10%;
    }
  }
  .hi > h1{
    margin-bottom: 20px;
    font-size: 5.4rem;
    line-height: 1.3;
    font-weight: 300;
    font-family: sans-serif;
    text-align: center;
    color: #000;
  }
  .crop-demo-btn{
    position: relative;
    width: 70px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    padding: 0 20px;
  }
  .crop-demo{
    position: relative;
    width: 0;
    height: 0;
    z-index: -1;
  }
  .crop-input{
    position: absolute;
    width: 70px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  .signSpace{
    border: none;
    width: 0;
    height: 0;
    position: absolute;
    top: 10px;
    right: 150px;
  }
</style>
