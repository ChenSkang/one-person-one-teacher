<template>
  <div>
    <my-head></my-head>
    <mySpace></mySpace>
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
    <span>{{abc}}</span>
    <div class="main" v-if="subject[0].que">
      <div class="block">
        <div v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="正在推荐中">
          <img :src="$store.state.cropImg" @click="imgVisible = true" class="pre-img">
          <ul>
            <li class="ques">
              <div class="up">
                <span class="TH">原题：&nbsp;</span>
                <span class="QUE">{{subject[0].que}}</span>
              </div>
              <div class="low">
                <div @click="showJX(0)"><i class="el-icon-document"></i>解析</div>
                <div v-if="!($store.state.tests.indexOf(subject[0].id) + 1)"><el-button type="primary" size="mini" @click="addPaper(0)" icon="el-icon-plus" round>试题</el-button></div>
                <div v-else><el-button @click="deletePaper(0)" type="info" size="mini" icon="el-icon-minus" round>试题</el-button></div>
              </div>
            </li>
          </ul>
          <ul v-for="index in 5" :key="index">
            <li class="ques">
              <div class="up">
                <span class="TH">{{index + '.'}}&nbsp;</span>
                <span class="QUE">{{subject[index].que}}</span>
              </div>
              <div class="low">
                <div @click="showJX(index)"><i class="el-icon-document"></i>解析</div>
                <div v-if="!($store.state.tests.indexOf(subject[index].id) + 1)"><el-button type="primary" @click="addPaper(index)" size="mini" icon="el-icon-plus" round>试题</el-button></div>
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
        abc: '（2016•宁德）解不等式\\(\\frac{x}{2}\\)﹣1≤\\(\\left( {\\frac{{70 - x}}{3}} \\right)\\)，并把解集在数轴上表示出来．',
        msg: '',
        imgVisible: false,
        ifVisible: false,
        imageSrc: '',
        visible: false,
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
        this.$http.post('http://47.94.215.104:8080/OPOT1/servlet/pictureServlet', fd, {emulateJSON: true}).then((response) => {
          this.loading = false
          this.$message.success('推荐成功')
          sessionStorage.setItem('defaultSrc', this.$store.state.cropImg)
          /* for (let i in response.data) {
            console.log(response.data[i])
          } */
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.subject = JSON.parse(sessionStorage.subj)
        }, (response) => {
          this.loading = false
          this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
          this.$message.error('请求服务端失败')
        })
      },
      searchMsg () {
        this.loading = true
        const str = this.msg
        this.$http.post('http://47.94.215.104:8080/OPOT1/servlet/wordServlet', str, {emulateJSON: true}).then((response) => {
          this.$store.state.cropImg = ''
          sessionStorage.setItem('defaultSrc', '')
          this.loading = false
          this.$message.success('推荐成功')
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          console.log(response.data)
          this.subject = JSON.parse(sessionStorage.subj)
        }, (response) => {
          this.loading = false
          this.$message.error('请求服务端失败')
        })
      },
      showJX (x) {
        let que = this.subject[x].que
        let kddp = this.subject[x].kddp
        let zsd = this.subject[x].zsd
        let answer = this.subject[x].answer
        let jx = this.subject[x].jx
        bus.$emit('JX', que, kddp, zsd, answer, jx)
      },
      addPaper (x) {
        let str = this.subject[x].que
        let kind = this.subject[x].kind
        let ida = this.subject[x].id
        switch (kind) {
          case '选择题':
            if (localStorage.xz) {
              this.$store.state.XZ = JSON.parse(localStorage.xz)
            }
            this.$store.state.XZ.push({que: str, id: ida})
            localStorage.xz = JSON.stringify(this.$store.state.XZ)
            break
          case '填空题':
            if (localStorage.tk) {
              this.$store.state.TK = JSON.parse(localStorage.tk)
            }
            this.$store.state.TK.push({que: str, id: ida})
            localStorage.tk = JSON.stringify(this.$store.state.TK)
            break
          case '解答题':
            if (localStorage.jd) {
              this.$store.state.JD = JSON.parse(localStorage.jd)
            }
            this.$store.state.JD.push({que: str, id: ida})
            localStorage.jd = JSON.stringify(this.$store.state.JD)
            break
        }
        this.$message.success('添加试题篮成功')
        localStorage.setItem('tests', this.$store.state.tests.concat(ida))
        this.$store.state.tests = localStorage.getItem('tests')
        console.log(this.$store.state.tests)
      },
      deletePaper (x) {
        let kind = this.subject[x].kind
        let ida = this.subject[x].id
        switch (kind) {
          case '选择题':
            for (let i = 0; i < this.$store.state.XZ.length; i++) {
              if (ida === this.$store.state.XZ[i].id) {
                this.$store.state.XZ.splice(i, 1)
                break
              }
            }
            localStorage.xz = JSON.stringify(this.$store.state.XZ)
            break
          case '填空题':
            for (let i = 0; i < this.$store.state.TK.length; i++) {
              if (ida === this.$store.state.TK[i].id) {
                this.$store.state.TK.splice(i, 1)
                break
              }
            }
            localStorage.tk = JSON.stringify(this.$store.state.TK)
            break
          case '解答题':
            for (let i = 0; i < this.$store.state.JD.length; i++) {
              if (ida === this.$store.state.JD[i].id) {
                this.$store.state.JD.splice(i, 1)
                break
              }
            }
            localStorage.jd = JSON.stringify(this.$store.state.JD)
            break
        }
        localStorage.setItem('tests', this.$store.state.tests.replace(ida, ''))
        this.$store.state.tests = localStorage.getItem('tests')
        console.log(this.$store.state.tests)
      }
    },
    created () {
      this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
      if (sessionStorage.getItem('subj')) { this.subject = JSON.parse(sessionStorage.getItem('subj')) }
      if (localStorage.getItem('xz')) { this.$store.state.XZ = JSON.parse(localStorage.getItem('xz')) }
      if (localStorage.getItem('tk')) { this.$store.state.TK = JSON.parse(localStorage.getItem('tk')) }
      if (localStorage.getItem('jd')) { this.$store.state.JD = JSON.parse(localStorage.getItem('jd')) }
      if (localStorage.getItem('tests')) {
        this.$store.state.tests = localStorage.getItem('tests')
      } else {
        localStorage.setItem('tests', 'tests')
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
    overflow: hidden;
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
    font-size: 1rem;
  }
</style>
