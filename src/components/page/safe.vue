<template>
  <div>
    <div class="my-head">
      <div class="logo" @click="$router.push('/')">一人一名师</div>
    </div>
    <div class="main" :style="{minHeight: minHeight + 'px'}">
      <div class="step">
        <div class="step-center">
            <el-steps :active="nowStep" finish-status="success" align-center>
                <el-step title="帐号填写"></el-step>
                <el-step title="验证身份"></el-step>
                <el-step title="设置新密码"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </div>
      </div>
      <div class="four-step">
        <div class="step-main" v-if="nowStep == 0">
            <p>帐号：</p>
            <el-input v-model="phone" placeholder="手机号" value="number" @keyup.native.enter="myPhone()" clearable style="margin-top: 5px;"></el-input>
            <el-button type="primary" style="margin-top: 15px;" @click="myPhone()">确定</el-button>
        </div>
      </div>
      <div class="four-step" v-if="nowStep == 1">
        <div class="step-main">
            <p>您的帐号为：{{phone}}</p>
            <el-button v-if="getCode" type="primary" style="margin-top: 15px;" @click="prove()">点击获取验证码</el-button>
            <el-button v-else type="primary" style="margin-top: 15px;">{{total}}</el-button>
            <br/>
            <el-input v-model="code" placeholder="请输入验证码" @keyup.native.enter="proveOver()" value="number" style="margin-top: 15px; width: 200px;"></el-input>
            <br/>
            <el-button type="primary" style="margin-top: 15px;" @click="proveOver()">确定</el-button>
        </div>
      </div>
      <div class="four-step" v-if="nowStep == 2">
        <div class="step-main">
            <el-form :model="passForm" :rules="passRule" status-icon ref="passForm" label-width="0px">
                <el-form-item prop="pass">
                    <p>密码：</p>
                    <el-input type="password" v-model="passForm.pass"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="ifPass">
                    <p>确认密码：</p>
                    <el-input type="password" v-model="passForm.ifPass"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="passReset('passForm')">重置</el-button>
                    <el-button type="primary" @click="passSure('passForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
      </div>
      <div class="four-step" v-if="nowStep == 4">
        <div class="step-main">
            <img src="../../img/finishi.png" alt="">
            <br/>
            <el-button type="primary" style="margin-top: 15px;" @click="passFinishi">返回登录</el-button>
        </div>
      </div>
    </div>
    <div class="foot">
      ©Powered by opot
    </div>
  </div>
</template>

<script>
  export default {
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
        minHeight: 0,
        phone: '',
        code: '',
        passForm: {
          pass: '',
          ifPass: ''
        },
        passRule: {
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          ifPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        getCode: true,
        totalTime: 300,
        total: ''
      }
    },
    methods: {
      myPhone () {
        if (this.phone.length < 11) {
          this.$alert('请输入正确的手机号', '手机号错误', {
            confirmButtonText: '确定'
          })
        } else {
          this.$router.push({path: '/safe', query: {now: 'identity', step: 1}})
        }
      },
      prove () {
        if (this.phone.length < 11) {
          this.$message('请输入正确的手机号')
          this.$router.push({path: '/safe', query: {now: 'phone', step: 0}})
        } else {
          let url = this.$store.state.urls.url + 'GetCodeServlet'
          let fd = new FormData()
          fd.append('phone', this.phone)
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            if (response.data.status === 0) {
              this.$message.error('当前用户不存在')
            } else {
              this.$message.success('验证码已发送')
              this.getCode = false
              this.timeTo()
              sessionStorage.setItem('session', response.data.sessionId)
            }
          }, (response) => {
            this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
              confirmButtonText: '确定'
            })
          })
        }
      },
      proveOver () {
        if (this.code.length < 4) {
          this.$message('请输入正确的验证码')
        } else {
          let url = this.$store.state.urls.url + 'CheckCodeServlet'
          let session = sessionStorage.getItem('session')
          let fd = new FormData()
          fd.append('code', this.code)
          fd.append('sessionId', session)
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            if (response.data.status === 0) {
              console.log(response)
              this.$message.error('请输入正确的验证码')
            } else {
              console.log(response)
              this.$router.push({path: '/safe', query: {now: 'pass_input', step: 2}})
            }
          }, (response) => {
            this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
              confirmButtonText: '确定'
            })
          })
        }
      },
      passSure (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.$store.state.urls.url + 'SetPassServlet'
            let session = sessionStorage.getItem('session')
            let fd = new FormData()
            fd.append('pass', this.passForm.pass)
            fd.append('sessionId', session)
            this.$axios.post(url, fd, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              if (response.data.status === 0) {
                this.$message.error('超时，请重试')
                this.$router.push({path: '/safe', query: {now: 'phone', step: 0}})
              } else {
                this.$router.push({path: '/safe', query: {now: 'finish', step: 4}})
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
      passReset (formName) {
        this.$refs[formName].resetFields()
      },
      passFinishi () {
        this.$router.push('/')
        sessionStorage.removeItem('session')
        this.$store.state.signShow = true
      },
      timeTo () {
        this.total = this.totalTime + 's后重新获取'
        let clock = window.setInterval(() => {
          this.totalTime --
          this.total = this.totalTime + 's后重新获取'
          if (this.totalTime <= 0) {
            window.clearInterval(clock)
            this.getCode = true
          }
        }, 1000)
      }
    },
    computed: {
      nowStep: function () {
        if (this.$route.query.step) {
          return parseInt(this.$route.query.step)
        } else {
          return 0
        }
      }
    },
    watch: {
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 100
    }
  }
</script>

<style scoped>
  .my-head{
    position: relative;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: #409eff;
  }
  .logo{
    line-height: 50px;
    color: #fff;
    font-size: 25px;
    margin: 0;
    padding: 0;
    position: absolute;
    left: 16%;
  }
  .main{
    width: 100%;
    position: relative;
  }
  .step{
    position: relative;
    width: 100%;
    height: 100px;
    background-color: #F2F6FC;
  }
  .step-center{
      width: 66%;
      position: absolute;
      left: 17%;
      top: 50px;
      transform: translateY(-50%)
  }
  .four-step{
      width: 100%;
  }
  .step-main{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 50px;
  }
  .foot {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #F2F6FC;
  }
</style>
