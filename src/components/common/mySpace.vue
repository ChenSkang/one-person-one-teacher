<template>
  <div  v-loading.fullscreen.lock="$store.state.history.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
    <div id="space" style="display: none">
      <div class="col col-hover" @click="$router.push('/')"><span>首页</span></div><div class="col">丨</div>
      <div class="col col-hover" v-show="nowuser" @click="signShows()"><span>登录</span></div>
      <div class="col col-name col-hover" v-show="!nowuser">
        <span>{{$store.state.userNow}}</span>
        <div class="col-out" @click="signOut()"><span>退出</span></div>
      </div><div class="col">丨</div>
      <div class="col col-hover" v-show="nowuser" @click="registerShows()"><span>注册</span></div>
      <div class="col col-hover" v-show="!nowuser"><span>搜索历史</span></div><div class="col" v-show="!nowuser">丨</div>
      <div class="col col-hover" v-show="!nowuser" @click="$router.push('/testPapers')"><span>我的试卷</span></div>
    </div>
    <el-dialog :title="ms" :visible.sync="registerShow" width="50%" :append-to-body="true">
      <el-form :model="registerForm" status-icon :rules="registerRule" ref="registerForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" placeholder="密码" v-model="registerForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="ifPass">
          <el-input type="password" placeholder="确认密码" v-model="registerForm.ifPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="tel">
          <el-input type="text" placeholder="手机号" v-model.number="registerForm.tel" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            年级：
            <el-select v-model="classValue" placeholder="八年级">
              <el-option
                v-for="item in theClasses"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :offset="1" :span="12">
            教材版本：
            <el-select v-model="teachValue" placeholder="人教版">
              <el-option
                v-for="item in theTeach"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-input placeholder="手机验证码" v-model="code"></el-input>
          </el-col>
          <el-col :offset="1" :span="12">
            <div class="btn-primary get-btn" @click="getCode()">点击获取手机验证码</div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div class="btn-primary register-btn" @click="prove()">注册</div>
        </el-form-item>
        <hr>
        <p>已经有账号，马上去<span class="to" @click="gosign()">登录</span></p>
      </el-form>
    </el-dialog>
    <el-dialog :title="msg" :visible.sync="$store.state.signShow" width="30%" :append-to-body="true">
      <el-form :model="signForm" :rules="signRule" ref="signForm" class="demo-ruleForm">
        <el-form-item prop="usr">
          <el-input type="text" v-model="signForm.usr" auto-complete="off" placeholder="手机/用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="signForm.pass" @keyup.native.enter="submitSignForm('signForm')" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSignForm('signForm')">登录</el-button>
        </el-form-item>
        <hr>
        <div style="padding: 1rem 0 2rem 0;" class="clear">
          <span class="lf" style="color:#0489cc;">帮助</span>
          <div class="rt">
            <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
            <span @click="forgetPass()" style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">忘记密码？</span>
          </div>
        </div>
        <p>还没有账号，马上去<span class="to" @click="goRegister()">注册</span></p>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
  export default {
    components: {ElInput},
    data () {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入密码'))
        } else {
          if (this.registerForm.ifPass !== '') {
            this.$refs.registerForm.validateField('ifPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.pass) {
          return callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let telCheck = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('电话号码是必须的'))
        } else if (!Number.isInteger(value)) {
          return callback(new Error('电话号码必须是数字'))
        } else if (value.toString().length !== 11) {
          return callback(new Error('电话号码必须是11位数字'))
        } else {
          callback()
        }
      }
      return {
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
        code: '',
        sessionID: '',
        msg: '用户名密码登录',
        checked: true,
        signForm: {
          usr: '',
          pass: ''
        },
        radio: '全部',
        signRule: {
          usr: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          pass: [
            {required: true, trigger: 'blur'}
          ]
        },
        ms: '用户注册',
        registerShow: false,
        registerForm: {
          pass: '', // 密码
          ifPass: '', // 确认密码
          name: '', // 用户名
          tel: '' // 手机号
        },
        registerRule: {
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          ifPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          tel: [
            { required: true, validator: telCheck, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitSignForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let name = this.signForm.usr
            let pass = this.signForm.pass
            let formData = new FormData()
            formData.append('username', name)
            formData.append('password', pass)
            let url = this.$store.state.urls.url + 'user/login'
            this.$axios.post(url, formData, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              console.log(response)
              if (response.data.data) {
                sessionStorage.setItem('sessionId', response.data.data.sessionId)
                sessionStorage.setItem('nowUser', response.data.data.username)
                sessionStorage.setItem('jiaocai', response.data.data.jiaocai)
                sessionStorage.setItem('nianji', response.data.data.nianji)
                sessionStorage.setItem('phone', response.data.data.phone)
                sessionStorage.setItem('headImg', response.data.data.head)
                this.$store.state.userNow = response.data.data.username
                this.$store.state.imgSrc = response.data.data.head
                this.$store.state.jiaocai = response.data.data.jiaocai ? response.data.data.jiaocai : this.$store.state.jiaocai
                this.$store.state.nianji = response.data.data.nianji ? response.data.data.nianji : this.$store.state.nianji
                this.$store.state.phone = response.data.data.phone
                if (this.checked === true) {
                  this.clearCookie()
                  this.setCookie(name, pass, 7)
                } else {
                  this.clearCookie()
                }
                this.$message.success('登录成功')
                this.$store.state.signShow = false
                localStorage.setItem('thisUser', name)
                localStorage.setItem('thisPass', pass)
                this.resetForm('signForm')
              } else {
                this.$alert('账户名或密码错误', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'info',
                      message: '账户名或密码错误'
                    })
                  }
                })
              }
            }, (response) => {
              this.$message.error('请求服务端失败')
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      setCookie (cname, cpwd, exdays) {
        let exdate = new Date()
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)
        window.document.cookie = 'userName' + '=' + cname + ';path=/;expires=' + exdate.toGMTString()
        window.document.cookie = 'userPwd' + '=' + cpwd + ';path=/;expires=' + exdate.toGMTString()
      },
      getCookie: function () {
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; ')
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('=')
            if (arr2[0] === 'userName') {
              this.signForm.usr = arr2[1]
            } else if (arr2[0] === 'userPwd') {
              this.signForm.pass = arr2[1]
            }
          }
        }
      },
      clearCookie: function () {
        this.setCookie('', '', -1)
      },
      getCode () {
        let url = this.$store.state.urls.url + 'user/sendCode'
        let fd = new FormData()
        fd.append('phone', this.registerForm.tel)
        fd.append('way', 0)
        this.$axios.post(url, fd, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          if (response.data.msg === '用该手机号已注册') {
            this.$message.error('当前手机号已经注册')
          } else {
            this.sessionID = response.data.data.sessionId
          }
        }, (response) => {
          this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
            confirmButtonText: '确定'
          })
        })
      },
      prove () {
        if (this.code.length < 4) {
          this.$message('请输入正确的验证码')
        } else {
          let url = this.$store.state.urls.url + '/user/checkCode'
          let session = this.sessionID
          let fd = new FormData()
          fd.append('code', this.code)
          fd.append('sessionId', session)
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            if (response.data.msg === '成功') {
              console.log(response)
              this.submitRegisterForm('registerForm')
            } else {
              console.log(response)
              this.$message.error('请输入正确的验证码')
            }
          }, (response) => {
            this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
              confirmButtonText: '确定'
            })
          })
        }
      },
      submitRegisterForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData()
            formData.append('username', this.registerForm.name)
            formData.append('password', this.registerForm.pass)
            formData.append('phone', this.registerForm.tel)
            formData.append('sessionId', this.sessionID)
            formData.append('nianji', this.classValue)
            formData.append('jiaocai', this.teachValue)
            let url = this.$store.state.urls.url + 'user/register'
            this.$axios.post(url, formData, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              switch (response.data.message) {
                case '手机号格式不正确':
                  this.$message.info('请输入正确的手机号')
                  break
                case '该手机号已存在':
                  this.$message.info('手机号已存在，请重新注册')
                  break
                case '该用户名已存在':
                  this.$message.info('用户名重复，请重新输入')
                  break
                default:
                  this.$message.success('注册成功')
                  this.registerShow = false
                  this.resetForm('registerForm')
              }
            }, (response) => {
              this.$message.error('请求服务端失败')
            })
          } else {
            return false
          }
        })
      },
      gosign () {
        this.$store.state.signShow = true
        this.registerShow = false
      },
      registerShows () {
        this.registerShow = true
      },
      goRegister () {
        this.registerShow = true
        this.$store.state.signShow = false
      },
      forgetPass () {
        this.$store.state.signShow = false
        this.$router.push({path: '/safe', query: {now: 'phone', step: 0}})
      }
    },
    mounted () {
      this.getCookie()
      if (localStorage.getItem('thisUser') && !this.$store.state.userNow) {
        let name = localStorage.getItem('thisUser')
        let pass = localStorage.getItem('thisPass')
        let formData = new FormData()
        formData.append('username', name)
        formData.append('password', pass)
        let url = this.$store.state.urls.url + 'user/login'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          if (response.data.data.sessionId) {
            sessionStorage.setItem('sessionId', response.data.data.sessionId)
            sessionStorage.setItem('nowUser', response.data.data.username)
            sessionStorage.setItem('jiaocai', response.data.data.jiaocai)
            sessionStorage.setItem('nianji', response.data.data.nianji)
            sessionStorage.setItem('phone', response.data.data.phone)
            sessionStorage.setItem('headImg', response.data.data.head)
            this.$store.state.userNow = response.data.data.username
            this.$store.state.imgSrc = response.data.data.head
            this.$store.state.jiaocai = response.data.data.jiaocai ? response.data.data.jiaocai : this.$store.state.jiaocai
            this.$store.state.nianji = response.data.data.nianji ? response.data.data.nianji : this.$store.state.nianji
            this.$store.state.phone = response.data.data.phone
          } else {
            this.$alert('自动登录失效', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: '自动登录失效'
                })
              }
            })
          }
        }, (response) => {
          this.$message.error('自动登录失效')
        })
      }
    },
    computed: {
      nowuser: function () {
        if (this.$store.state.userNow) {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style scoped>
  #space{
    height: 40px;
    position: fixed;
    right: 16%;
    top: 0;
    z-index: 990;
    display: flex;
    flex-direction: row;
  }
  .col{
    color: #FFF;
    text-align: center;
    font-size: 14px;
    font-family: 微软雅黑;
    letter-spacing: 1px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .col-name{
    position: relative;
  }
  .col-name:hover .col-out{
    display: block;
    background-color: #C0C4CC;
  }
  .col-out {
    width: 100%;
    height: 40px;
    position:absolute;
    top:40px;
    display: none;
  }
  .col-hover:hover{
    color: #303133;
  }
  .demo-ruleForm{
    text-align: center;
  }
  .to {
    color: #67C23A;
    cursor: pointer;
  }
  .lf{
    float: left;
  }
  .rt{
    float: right;
  }
  .get-btn{
    background-color: #409eff;
    color: #fff;
  }
  .register-btn{
    background-color: #2d8cf0;
    color: #fff;
  }
</style>
