<template>
  <div>
    <my-head></my-head>
    <el-dialog title="裁剪图片" :visible.sync="visible" width="50%" :show-close="false">
      <vue-cropper ref='cropper'
                   :src="imageSrc"
                   :ready="cropImage"
                   :zoom="cropImage"
                   :cropmove="cropImage"
                   :autoCropArea = "0.99"
                   style="width:100%;height:400px;">
      </vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCrop">取 消</el-button>
        <el-button type="primary" @click="sureCrop">确 定</el-button>
      </span>
    </el-dialog>
    <div class="main">
      <div class="crop-demo">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          action="http://47.94.215.104:8080/OPOT1/servlet/pictureServlet"
          :on-change="handleChange"
          :before-upload="handleBefore"
          :auto-upload="false">
          <el-button icon="el-icon-edit" slot="trigger" size="small" type="primary" @click="ifVisible = false">选取</el-button>
        </el-upload>
        <img :src="cropImg" class="pre-img">
      </div>
      <div class="block" v-if="subject[0].que">
        <el-container>
          <el-aside width="20%">
            <h3 @click="run('/Basket')">试题篮</h3>
            <!--
            <ul class="textPaper">
              <li v-for="(myPaper, index) in myPapers">
                <span>{{myPapers[index].name + ':' + myPapers[index].value}}</span>
              </li>
            </ul> -->
          </el-aside>
          <el-main  v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="正在推荐中">
            <ul>
              <li class="ques">
                <div class="up">
                  <span class="TH">原题：&nbsp;</span>
                  <span class="QUE">{{subject[0].que}}</span>
                </div>
                <div class="low">
                  <div @click="showJX(0)"><i class="el-icon-document"></i>解析</div>
                  <div v-if="subject[0].unique"><el-button type="primary" size="mini" @click="addPaper(0)" icon="el-icon-plus" round>试题</el-button></div>
                  <div v-else><el-button type="info" size="mini" icon="el-icon-minus" round>试题</el-button></div>
                </div>
              </li>
            </ul>
            <span>$$	\cfrac{2}{c + \cfrac{2}{d + \cfrac{2}{4}}} =a$$</span>

            <ul v-for="index in 5" :key="index">
              <li class="ques">
                <div class="up">
                  <span class="TH">{{index + '.'}}&nbsp;</span>
                  <span class="QUE">{{subject[index].que}}</span>
                </div>
                <div class="low">
                  <div @click="showJX(index)"><i class="el-icon-document"></i>解析</div>
                  <div v-if="subject[index].unique"><el-button type="primary" @click="addPaper(index)" size="mini" icon="el-icon-plus" round>试题</el-button></div>
                  <div v-else><el-button type="info" size="mini" icon="el-icon-minus" round>试题</el-button></div>
                </div>
              </li>
            </ul>
          </el-main>
        </el-container>
        <answer></answer>
      </div>
    </div>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import myHead from '../common/header.vue'
  import answer from '../common/anwer.vue'
  import bus from '../../bus'
  export default {
    components: {
      VueCropper,
      myHead,
      answer
    },
    data () {
      return {
        defaultSrc: sessionStorage.defaultSrc,
        ifVisible: false,
        imageSrc: '',
        cropImg: '',
        visible: false,
        subj: sessionStorage.subj,
        subject: [{
          que: ''
        }],
        thisTi: 0,
        myPapers: [
          {name: '选择题', value: 0},
          {name: '填空题', value: 0},
          {name: '解答题', value: 0}
        ],
        loading: false
      }
    },
    methods: {
      run (name) {
        this.$router.push(name)
      },
      handleChange (files) {
        if (this.ifVisible === false) {
          this.ifVisible = true
          this.visible = true
          this.imageSrc = files.url
          this.$refs.cropper && this.$refs.cropper.replace(files.url)
        }
      },
      cropImage () {
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      },
      cancelCrop () {
        this.visible = false
        this.cropImg = sessionStorage.defaultSrc
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
        const page = this.cropImg
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
          this.loading = false
          this.$message.success('推荐成功')
          sessionStorage.defaultSrc = this.cropImg
          for (let i in response.data) {
            console.log(response.data[i])
          }
          sessionStorage.subj = JSON.stringify(response.data)
          this.subject = JSON.parse(sessionStorage.subj)
        }, (response) => {
          this.loading = false
          this.cropImg = sessionStorage.defaultSrc
          this.$message.error('请求服务端失败')
          console.log('上传失败')
        })
      },
      showJX (x) {
        let que = this.subject[x].que
        let kddp = this.subject[x].kddp
        let zsd = this.subject[x].zsd
        let answer = this.subject[x].answer
        bus.$emit('JX', que, kddp, zsd, answer)
      },
      addPaper (x) {
        let str = this.subject[x].que
        let kind = this.subject[x].kind
        bus.$emit('STL', str, kind)
        this.$message.success('添加试题篮成功')
        this.subject[x].unique = false
        sessionStorage.subj = JSON.stringify(this.subject)
      }
    },
    created () {
      this.cropImg = sessionStorage.defaultSrc
      if (sessionStorage.subj) {
        this.subject = JSON.parse(sessionStorage.subj)
      }
    },
    mounted () {
    },
    computed: {
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pre-img{
    margin-left: 25%;
    max-width: 70%;
    max-height: 200px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .block{
    width: 90%;
    margin: 20px 5% 20px 5%;
  }
  .ques{
    position: relative;
    width: 100%;
    zoom: 1;
    clear: both;
    margin: 10px 20px 10px 20px;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid #DCDFE6;
  }
  /* .ques:hover{
    display: inline-block;
    border: 2px solid #C0C4CC;
  } */
  .up{
    line-height: 25px;
    font-size: 14px;
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
    font-size: 13px;
  }
  .low div{
    margin-left: 15px;
    cursor: pointer;
  }
  .TH{
    font-size: 16px;
  }
</style>
