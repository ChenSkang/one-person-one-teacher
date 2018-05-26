<template>
  <div>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="80%" :show-close="false">
      <vue-cropper ref='cropper'
                   :src="imageSrc"
                   :ready="cropImage"
                   :zoom="cropImage"
                   :cropmove="cropImage"
                   :autoCropArea = "0.99"
                   style="width:100%;height:100%;">
      </vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCrop">取消</el-button>
        <el-button type="primary" @click="sureCrop">确定</el-button>
      </span>
    </el-dialog>
    <el-container>
      <el-header height="100px">
        <mySpace></mySpace>
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
            <el-input placeholder="请输入内容" v-model="msg">
              <el-upload
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
        msg: 'Welcome to Your Vue.js App',
        ifVisible: false,
        visible: false,
        imageSrc: ''
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
      cancelCrop () {
        this.visible = false
        this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      },
      sureCrop () {
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
        this.$http.post('http://47.94.215.104:8080/OPOT1/servlet/pictureServlet', fd, {emulateJSON: true}).then((response) => {
          this.$message.success('推荐成功')
          sessionStorage.setItem('defaultSrc', this.$store.state.cropImg)
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$router.push('/index')
        }, (response) => {
          this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
          this.$message.error('请求服务端失败')
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
    padding-top: 10%;
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
 /* .btn {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .btn_text {
    width: 160px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 30px;
    font-size: 18px;
    transition: 0.5s;
  }
  .btn_text:hover{
    box-shadow: 0 10px 10px -3px #ccc;
  }
  .search{
    background: #dd356e;
    color: #fff;
    margin-left: 50%;
    transform: translateX(-180px);
  }
  .basket{
    background: #fee856;
    color: #000;
    transform: translateX(-140px);
  }*/
</style>
