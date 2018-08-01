<template>
  <div v-loading.fullscreen.lock="loading" element-loading-spinner="el-icon-loading" element-loading-text="正在推荐中">
    <my-head></my-head>
    <mySpace></mySpace>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="80%" :show-close="false">
      <vue-cropper ref='cropper'
                   :src="imageSrc"
                   :ready="cropImage"
                   :zoom="cropImage"
                   :cropmove="cropImage"
                   :autoCropArea = "0.99"
                   :background = 'false'
                   style="width:100%;height:100%;max-height: 80vh">
      </vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rotateImage()">转圈</el-button>
        <el-button @click="cancelCrop">取 消</el-button>
        <el-button type="primary" @click="sureCrop">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" width="96%">
      <img width="100%" :src="$store.state.cropImg">
    </el-dialog>
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
    <div id="main" v-if="$store.state.nowSub.length">
      <div class="block">
        <div>
          <img :src="$store.state.cropImg" @click="imgVisible = true" class="pre-img">
          <ul>
            <li class="ques">
              <div class="up">
                <span class="TH">原题：</span>
                <span class="QUE" v-html="$store.state.nowSub[0].que"></span>
              </div>
              <div class="low">
                <div @click="showJX(0)"><i class="el-icon-document"></i>解析</div>
                <div v-if="!($store.state.tests.indexOf($store.state.nowSub[0].unique) + 1)"><el-button type="primary" size="mini" @click="addPaper(0)" icon="el-icon-plus" round>试题</el-button></div>
                <div v-else><el-button @click="deletePaper(0)" type="info" size="mini" icon="el-icon-minus" round>试题</el-button></div>
              </div>
            </li>
          </ul>
          <ul>
            <li class="ques" v-for="index in $store.state.nowSub.length - 1" :key="index">
              <div class="up">
                <span class="TH">{{index + '.'}}</span>
                <span class="QUE" v-html="$store.state.nowSub[index].que"></span>
              </div>
              <div class="low">
                <div @click="showJX(index)"><i class="el-icon-document"></i>解析</div>
                <div v-if="!($store.state.tests.indexOf($store.state.nowSub[index].unique) + 1)"><el-button type="primary" @click="addPaper(index)" size="mini" icon="el-icon-plus" round>试题</el-button></div>
                <div v-else><el-button @click="deletePaper(index)" type="info" size="mini" icon="el-icon-minus" round>试题</el-button></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <answer></answer>
    </div>
    <gotop></gotop>
  </div>
</template>

<script>
  import gotop from '../common/gotop.vue'
  import mySpace from '../common/mySpace.vue'
  import VueCropper from 'vue-cropperjs'
  import myHead from '../common/header.vue'
  import myFoot from '../common/footer.vue'
  import answer from '../common/anwer.vue'
  import bus from '../../bus'
  export default {
    components: {
      VueCropper,
      myHead,
      answer,
      myFoot,
      mySpace,
      gotop
    },
    data () {
      return {
        msg: '',
        imgVisible: false,
        ifVisible: false,
        imageSrc: '',
        visible: false,
        loading: false
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
      handleBefore (file) {
        /*  const self = this
         let reader = new FileReader()
         reader.readAsDataURL(files)
         reader.onload = function () {
         self.upLoadData.img_base64 = this.result
         console.log('上传成功')
         }
         const isImg = file.type === 'image/*'
         const isLt10M = file.size / 1024 / 1024 < 10
         if (!isImg) {
         this.$message.error('亲，只能选择图片')
         }
         if (!isLt10M) {
         this.$message.error('上传图片大小不能超过 10MB!')
         }
         return isImg && isLt10M */
      },
      sureCrop () {
        this.loading = true
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
          this.loading = false
          this.$store.state.nowSub = ''
          this.$message.success('推荐成功')
          sessionStorage.setItem('defaultSrc', this.$store.state.cropImg)
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
          console.log(response.data)
        }, (response) => {
          this.loading = false
          this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
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
      },
      searchMsg () {
        this.loading = true
        const str = this.msg
        let url = this.$store.state.urls.url + 'wordServlet'
        this.$axios.post(url, str, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.cropImg = ''
          sessionStorage.setItem('defaultSrc', '')
          this.loading = false
          this.$message.success('推荐成功')
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          console.log(response.data)
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        }, (response) => {
          this.loading = false
          this.$message.error('请求服务端失败')
        })
      },
      showJX (x) {
        let que = this.$store.state.nowSub[x].que
        let kddp = this.$store.state.nowSub[x].kddp
        let zsd = this.$store.state.nowSub[x].zsd
        let answer = this.$store.state.nowSub[x].answer
        let jx = this.$store.state.nowSub[x].jx
        bus.$emit('JX', que, kddp, zsd, answer, jx)
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
          let url = this.$store.state.urls.local + 'AddQueServlet'
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
          this.$message('请先登录，谢谢')
        }
      },
      deletePaper (x) {
      }
    },
    created () {
      this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      if (sessionStorage.getItem('subj')) { this.$store.state.nowSub = JSON.parse(sessionStorage.getItem('subj')) }
      if (localStorage.getItem('tests')) {
        this.$store.state.tests = localStorage.getItem('tests')
      } else {
        localStorage.setItem('tests', 'tests')
      }
    },
    updated () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    },
    mounted () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }
</script>

<style scoped>
  #main{
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pre-img{
    max-width: 96%;
    max-height: 200px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-left: 50%;
    transform: translateX(-50%);
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
  .block{
    width: 84%;
    margin: 20px 8% 20px 8%;
  }
  .ques{
    position: relative;
    width: 98%;
    zoom: 1;
    clear: both;
    margin: 10px 1% 10px 1%;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    word-wrap: break-word;
    letter-spacing: 1px;
  }
  /* .ques:hover{
    display: inline-block;
    border: 2px solid #C0C4CC;
  } */
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
    flex-direction: row;
    line-height: 36px;
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
  .TH{
  }
</style>
