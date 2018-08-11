<template>
  <div>
    <mySpace></mySpace>
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
              <el-button @click="searchMsg()" slot="append" v-if="msg">搜索</el-button>
              <el-upload
                v-else
                slot="append"
                class="avatar-uploader"
                :show-file-list="false"
                action="http://47.94.215.104:8080/OPOT1/servlet/pictureServlet"
                :on-change="handleChange"
                :before-upload="handleBefore"
                :auto-upload="false">
                <el-button icon="el-icon-picture" style="background-color: #fff" @click="ifVisible = false"></el-button>
              </el-upload>
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

  export default {
    data () {
      return {
        msg: '',
        ifVisible: false,
        visible: false,
        imageSrc: '',
        load: false
      }
    },
    methods: {
      handleChange (files) {
        if (this.ifVisible === false) {
          this.ifVisible = true
          this.visible = true
          this.imageSrc = files.url
          this.$refs.cropper && this.$refs.cropper.replace(files.url)
        }
      },
      handleBefore (file) {
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
          this.$message.error('请求服务端失败')
        })
      },
      searchMsg () {
        const str = this.msg
        let url = this.$store.state.urls.url + 'wordServlet'
        this.$axios.post(url, str, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$message.success('推荐成功')
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          console.log(response.data)
          this.$router.push('/index')
        }, (response) => {
          this.$alert('请检查图片或文本内容并确认网络是否正常', '未知错误', {
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
    created () {
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
</style>
