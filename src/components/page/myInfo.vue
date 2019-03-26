<template>
  <div>
    <my-head></my-head>
    <my-space></my-space>
    <el-dialog :visible.sync="visible" width="50%" center :append-to-body="true">
      <vue-cropper ref='cropper'
                   :src="imageSrc"
                   :ready="cropImage"
                   :zoom="cropImage"
                   :cropmove="cropImage"
                   :autoCropArea = "1"
                   style="width:100%;height:100%;max-height: 60vh">
      </vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureCrop">确 定</el-button>
        <el-button @click="cancelCrop" type="warning">取 消</el-button>
      </span>
    </el-dialog>
    <div class="main" :style="{minHeight: minHeight + 'px'}">
      <div class="title">
        <div class="title-info">个人中心</div>
      </div>
      <div class="changeInfo">
        <div class="left">
          <div class="info-name" @click="routerChange(0)">个人信息</div>
          <div class="info-name" @click="$router.push({path: '/userInfo', query: {info: '1'}})">密码修改</div>
          <div class="info-name" @click="routerChange(2)">手机绑定</div>
        </div>
        <div class="right">
          <div class="your-info" v-if="nowStep == 0">
            <div class="head-img">
              <img :src="$store.state.imgSrc" width="80px" alt="">
            </div>
            <div class="change-img">
              更换头像
              <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
            </div>
            <div class="three-info">
              <el-form label-position="right" label-width="80px" :model="threeInfo">
                <el-form-item label="用户名">
                  <el-input v-model="threeInfo.name" :placeholder="$store.state.userNow"></el-input>
                </el-form-item>
                <el-form-item label="年级">
                  <el-select v-model="classValue">
                    <el-option
                      v-for="item in theClasses"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="教材版本">
                  <el-select v-model="teachValue">
                    <el-option
                      v-for="item in theTeach"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div class="change-btn" @click="changeYourInfo()">保存</div>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="your-info" v-if="nowStep == 1">
            <div class="three-info">
              <el-form :model="passForm" :rules="passRule" status-icon ref="passForm" label-width="80px">
                <el-form-item prop="oldpass" label="旧密码">
                  <el-input type="password" v-model="passForm.oldpass"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="pass" label="新密码">
                  <el-input type="password" v-model="passForm.pass"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="ifPass" label="确认密码">
                  <el-input type="password" v-model="passForm.ifPass"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="passReset('passForm')">重置</el-button>
                  <el-button type="primary" @click="changePass('passForm')">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="your-info" v-if="nowStep == 2">
            <div class="three-info">
              <el-form label-position="right" label-width="80px">
                <el-form-item label="当前手机">
                  {{phoneNow}}
                </el-form-item>
                <el-form-item label="验证信息">
                  <el-col :span="11">
                    <el-input placeholder="手机验证码" v-model="code"></el-input>
                  </el-col>
                  <el-col :offset="1" :span="12">
                    <div class="btn-primary get-btn" @click="getCode(phoneNow)" v-if="total === '点击获取验证码'">{{total}}</div>
                    <div class="btn-primary get-btn" v-else>{{total}}</div>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <div class="change-btn" @click="checkNowPhone()">下一步</div>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="your-info" v-if="nowStep == 3">
            <div class="three-info">
              <el-form label-position="right" label-width="80px">
                <el-form-item label="新的手机">
                  <el-input v-model="phone" placeholder="手机号" value="number" @keyup.native.enter="myPhone()" clearable></el-input>
                </el-form-item>
                <el-form-item label="验证信息">
                  <el-col :span="11">
                    <el-input placeholder="手机验证码" v-model="code"></el-input>
                  </el-col>
                  <el-col :offset="1" :span="12">
                    <div class="btn-primary get-btn" @click="getCode(phone)">{{total}}</div>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <div class="change-btn" @click="phoneChanged()">确定</div>
                </el-form-item>
              </el-form>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="foot">
      ©Powered by opot
    </div>
  </div>
</template>

<script>
  import mySpace from '../common/mySpace.vue'
  import VueCropper from 'vue-cropperjs'
  import myHead from '../common/HomeHead.vue'
  export default {
    components: {
      mySpace,
      VueCropper,
      myHead
    },
    data () {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入密码'))
        } else {
          if (this.passForm.ifPass !== '') {
            this.$refs.passForm.validateField('ifPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请再次输入密码'))
        } else if (value !== this.passForm.pass) {
          return callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        phoneNow: '',
        imageSrc: '',
        threeInfo: {
          name: ''
        },
        idSession: '',
        cropImg: '',
        classValue: '',
        teachValue: '',
        theClasses: [{
          value: '七年级上'
        }, {
          value: '七年级下'
        }, {
          value: '八年级上'
        }, {
          value: '八年级下'
        }, {
          value: '九年级上'
        }, {
          value: '九年级下'
        }],
        theTeach: [{
          value: '人教新版'
        }, {
          value: '北师大新版'
        }, {
          value: '华师大新版'
        }, {
          value: '苏科新版'
        }, {
          value: '湘教新版'
        }, {
          value: '青鸟新版'
        }, {
          value: '浙教新版'
        }, {
          value: '冀教新版'
        }, {
          value: '沪科新版'
        }, {
          value: '鲁教五四新版'
        }, {
          value: '北京课改新版'
        }, {
          value: '沪教新版'
        }, {
          value: '人教五四新版'
        }, {
          value: '人教版'
        }, {
          value: '北师大版'
        }, {
          value: '华师大版'
        }, {
          value: '苏科版'
        }, {
          value: '湘教版'
        }, {
          value: '青鸟版'
        }, {
          value: '浙教版'
        }, {
          value: '冀教版'
        }, {
          value: '沪科版'
        }, {
          value: '鲁教五四版'
        }, {
          value: '北京课改版'
        }, {
          value: '沪教版'
        }, {
          value: '人教五四版'
        }],
        minHeight: 0,
        phone: '',
        code: '',
        passForm: {
          oldpass: '',
          pass: '',
          ifPass: ''
        },
        passRule: {
          oldpass: [
            { required: true, trigger: 'blur', message: '请输入原密码' }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          ifPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        totalTime: 60,
        total: '点击获取验证码'
      }
    },
    methods: {
      setImage (e) {
        const file = e.target.files[0]
        if (!file.type.includes('image/')) {
          return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          this.visible = true
          this.imageSrc = event.target.result
          this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
          e.target.value = ''
        }
        reader.readAsDataURL(file)
      },
      cropImage () {
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      },
      cancelCrop () {
        this.visible = false
        this.cropImg = this.$store.state.imgSrc
      },
      sureCrop () {
        this.visible = false
        let sessionId = sessionStorage.getItem('sessionId')
        if (sessionId) {
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
          fd.append('image', obj, 'image.png')
          fd.append('sessionId', sessionId)
          let url = this.$store.state.urls.url + 'user/changeHead'
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            console.log(response)
            sessionStorage.setItem('headImg', response.data.data)
            this.$store.state.imgSrc = response.data.data
          }, (response) => {
            this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
              confirmButtonText: '确定'
            })
          })
        } else {
          this.$message('请重新登录')
        }
      },
      routerChange (msg) {
        this.$router.push({path: '/userInfo', query: {info: msg}})
        this.passReset('passForm')
      },
      changeYourInfo () {
        let sessionId = sessionStorage.getItem('sessionId')
        if (sessionId) {
          const fd = new FormData()
          fd.append('jiaocai', this.teachValue)
          fd.append('nianji', this.classValue)
          fd.append('username', this.threeInfo.name)
          fd.append('sessionId', sessionId)
          let url = this.$store.state.urls.url + 'user/updateSelf'
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            console.log(response)
            sessionStorage.setItem('nowUser', response.data.data.username)
            sessionStorage.setItem('jiaocai', response.data.data.jiaocai)
            sessionStorage.setItem('nianji', response.data.data.nianji)
            this.$store.state.userNow = response.data.data.username
            this.$store.state.jiaocai = response.data.data.jiaocai
            this.$store.state.nianji = response.data.data.nianji
            this.$alert('修改个人信息成功', '成功', {
              confirmButtonText: '确定'
            })
          }, (response) => {
            this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
              confirmButtonText: '确定'
            })
          })
        } else {
          this.$message('请重新登录')
        }
      },
      changePass (formName) {
        let sessionId = sessionStorage.getItem('sessionId')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.$store.state.urls.url + '/user/checkOldPass'
            let fd = new FormData()
            fd.append('password', this.passForm.oldpass)
            fd.append('sessionId', sessionId)
            this.$axios.post(url, fd, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              console.log(response)
              if (response.data.msg === '旧密码验证正确') {
                this.changePassOver()
              } else if (response.data.msg === '登陆超时，请重新登陆') {
                this.$message.error('登录超时')
                this.signOut()
              } else {
                this.$message.error('原密码验证失败')
              }
            }, (response) => {
              this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
                confirmButtonText: '确定'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changePassOver () {
        let sessionId = sessionStorage.getItem('sessionId')
        let url = this.$store.state.urls.url + '/user/resetPass'
        let fd = new FormData()
        fd.append('password', this.passForm.pass)
        fd.append('sessionId', sessionId)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$alert('修改密码成功，下次请用新密码登录', '成功', {
            confirmButtonText: '确定'
          })
          this.passReset('passForm')
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      getCode (num) {
        let url = this.$store.state.urls.url + 'user/sendCode'
        let fd = new FormData()
        fd.append('phone', num)
        fd.append('way', 1)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.idSession = response.data.data.sessionId
          this.timeTo()
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      checkNowPhone () {
        let url = this.$store.state.urls.url + 'user/checkCode'
        let fd = new FormData()
        fd.append('sessionId', this.idSession)
        fd.append('code', this.code)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          if (response.data.msg === '成功') {
            this.code = ''
            this.total = '点击获取验证码'
            this.totalTime = -1
            this.$router.push({path: '/userInfo', query: {info: '3'}})
          } else {
            this.$message.error('验证出错')
          }
          console.log(response)
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      phoneChanged () {
        let url = this.$store.state.urls.url + 'user/checkCode'
        let fd = new FormData()
        fd.append('sessionId', this.idSession)
        fd.append('code', this.code)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          if (response.data.msg === '成功') {
            this.code = ''
            this.total = '点击获取验证码'
            this.totalTime = -1
            this.changePhone()
          } else {
            this.$message.error('验证出错')
          }
          console.log(response)
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      changePhone () {
        let sessionId = sessionStorage.getItem('sessionId')
        let url = this.$store.state.urls.url + 'user/resetPhone'
        let fd = new FormData()
        fd.append('sessionId', sessionId)
        fd.append('phone', this.phone)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          if (response.data.msg === '成功') {
            this.$message.success('更改成功')
            this.phone = ''
            this.$router.push({path: '/userInfo', query: {info: '1'}})
          } else {
            this.$message.error('验证出错')
          }
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      passReset (formName) {
        this.$refs[formName].resetFields()
      },
      timeTo () {
        this.totalTime = 60
        this.total = this.totalTime + 's后重新获取'
        let clock = window.setInterval(() => {
          this.totalTime --
          this.total = this.totalTime + 's后重新获取'
          if (this.totalTime <= 0) {
            window.clearInterval(clock)
            this.total = '点击获取验证码'
          }
        }, 1000)
      }
    },
    computed: {
      nowStep: function () {
        if (this.$route.query.info) {
          return parseInt(this.$route.query.info)
        } else {
          return 0
        }
      }
    },
    watch: {
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 100
      this.threeInfo.name = this.$store.state.userNow
      this.classValue = this.$store.state.nianji
      this.teachValue = this.$store.state.jiaocai
      this.phoneNow = this.$store.state.phone
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
    top: 50px;
    background-color: #fbfbfb;
  }
  .title{
    position: absolute;
    left: 10%;
    width: 80%;
    height: 120px;
  }
  .title-info{
    margin-top: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #303133;
    border-bottom: 1px solid #DCDFE6;
  }
  .changeInfo{
    position: absolute;
    left: 10%;
    top: 120px;
    width: 80%;
    height: 420px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #DCDFE6;
    background-color: #fff;
  }
  .left{
    width: 20%;
    padding-top: 10px;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
  }
  .info-name{
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    margin-top: 20px;
    color: #303133;
    font-size: 15px;
    letter-spacing: 1px;
    cursor: pointer;
  }
  .info-name:hover{
    background-color: #F2F6FC;
    font-weight: bold;
  }
  .right{
    width: 80%;
    position: relative;
  }
  .head-img{
    position: absolute;
    top: 30px;
    left: 10%;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid #DCDFE6;
  }
  .head-img img{
    border-radius: 50%;
  }
  .change-img {
    position: absolute;
    top: 120px;
    left: 10%;
    font-size: 14px;
    color: #3a8ee6;
    width: 80px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    border: 1px solid #3a8ee6;
    border-radius: 15px;
    text-align: center;
  }
  .three-info{
    position: absolute;
    top: 50px;
    left: 30%;
  }
  .foot {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #fbfbfb;
  }
  .change-btn{
    float: right;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    box-sizing: border-box;
    border: 1px solid #3a8ee6;
    border-radius: 15px;
    color: #3a8ee6;
    cursor: pointer;
  }
  .get-btn{
    background-color: #409eff;
    color: #fff;
  }
</style>
