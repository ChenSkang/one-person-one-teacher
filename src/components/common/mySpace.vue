<template>
  <div>
    <el-row id="space">
      <el-col :span="8" v-if="nowuser"><div class="col" @click="signShows()"><span>登录</span></div></el-col>
      <el-col :span="4" v-else><div class="col"><span>{{$store.state.userNow}}</span></div></el-col>
      <el-col :span="8" v-if="nowuser"><div class="col" @click="registerShows()"><span>注册</span></div></el-col>
      <el-col :span="4" v-else><div class="col" @click="signOut()"><span>退出</span></div></el-col>
      <el-col :span="4" v-if="!nowuser"><div class="col" @click="goMyExam()"><span>历史试题</span></div></el-col>
      <el-col :span="4" v-if="!nowuser"><div class="col" @click="searchHistory()"><span>搜索历史</span></div></el-col>
      <el-col :span="4" v-if="!nowuser"><div class="col" @click="goBasket()"><span>试题篮</span></div></el-col>
      <el-col :span="nowuser ? 8 : 4"><div class="col" @click="$router.push('/')"><span>首页</span></div></el-col>
    </el-row>
    <el-dialog :title="ms" :visible.sync="registerShow" width="30%" :modal="false">
      <el-form :model="registerForm" status-icon :rules="registerRule" ref="registerForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="user">
          <el-input v-model="registerForm.user"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="registerForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ifPass">
          <el-input type="password" v-model="registerForm.ifPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="电话号码">
          <el-input type="text" v-model.number="registerForm.tel" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
        <hr>
        <p>已经有账号，马上去<span class="to" @click="gosign()">登录</span></p>
      </el-form>
    </el-dialog>
    <el-dialog :title="msg" :visible.sync="signShow" width="30%" :modal="false">
      <el-form :model="signForm" :rules="signRule" ref="signForm" class="demo-ruleForm">
        <el-form-item prop="usr">
          <el-input type="text" v-model="signForm.usr" auto-complete="off" placeholder="手机/邮箱/用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="signForm.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSignForm('signForm')">登录</el-button>
        </el-form-item>
        <hr>
        <div style="padding: 1rem 0 2rem 0;" class="clear">
          <span class="lf" style="color:#0489cc;">帮助</span>
          <div class="rt">
            <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
            <span @click="clearCookie" style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">忘记密码？</span>
          </div>
        </div>
        <p>还没有账号，马上去<span class="to" @click="goRegister()">注册</span></p>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
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
        msg: '用户名密码登录',
        checked: true,
        signShow: false,
        signForm: {
          usr: '',
          pass: ''
        },
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
          user: '', // 昵称
          pass: '', // 密码
          ifPass: '', // 确认密码
          name: '', // 用户名
          tel: '' // 手机号
        },
        registerRule: {
          user: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          ifPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
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
            // 保存的账号
            let name = this.signForm.usr
            // 保存的密码
            let pass = this.signForm.pass
            let formData = new FormData()
            formData.append('tel', name)
            formData.append('pass', pass)
            let url = this.$store.state.urls.local + 'LoginServlet'
            this.$axios.post(url, formData, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              if (response.data.sessionId) {
                sessionStorage.setItem('sessionId', response.data.sessionId)
                sessionStorage.setItem('nowUser', response.data.u.name)
                sessionStorage.setItem('userId', response.data.u.id)
                this.$store.state.userNow = response.data.u.name
                if (this.checked === true) {
                  this.clearCookie()
                  // 传入账号名，密码，和保存天数3个参数
                  this.setCookie(name, pass, 7)
                } else {
                  this.clearCookie()
                }
                this.$message.success('登录成功')
                this.signShow = false
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
      // 设置cookie
      setCookie (cname, cpwd, exdays) {
        let exdate = new Date() // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
        // 字符串拼接cookie
        window.document.cookie = 'userName' + '=' + cname + ';path=/;expires=' + exdate.toGMTString()
        window.document.cookie = 'userPwd' + '=' + cpwd + ';path=/;expires=' + exdate.toGMTString()
      },
      // 读取cookie
      getCookie: function () {
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('=') // 再次切割
            // 判断查找相对应的值
            if (arr2[0] === 'userName') {
              this.signForm.usr = arr2[1] // 保存到保存数据的地方
            } else if (arr2[0] === 'userPwd') {
              this.signForm.pass = arr2[1]
            }
          }
        }
      },
      // 清除cookie
      clearCookie: function () {
        this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
      },
      submitRegisterForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData()
            formData.append('name', this.registerForm.user)
            formData.append('username', this.registerForm.name)
            formData.append('pass', this.registerForm.pass)
            formData.append('tel', this.registerForm.tel)
            let url = this.$store.state.urls.local + 'RegisterServlet'
            this.$axios.post(url, formData, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              switch (response.data.message) {
                case '注册成功':
                  this.$message.success('注册成功')
                  this.registerShow = false
                  this.resetForm('registerForm')
                  break
                case '该手机号已存在':
                  this.$message.info('手机号已存在，请重新注册')
                  break
                default:
                  this.$message.warning('未知错误')
              }
              console.log(response)
            }, (response) => {
              this.$message.error('请求服务端失败')
            })
          } else {
            return false
          }
        })
      },
      gosign () {
        this.registerShow = false
        this.signShow = true
      },
      signShows () {
        this.signShow = true
      },
      registerShows () {
        this.registerShow = true
      },
      goRegister () {
        this.signShow = false
        this.registerShow = true
      },
      signOut () {
        let url = this.$store.state.urls.local + 'LogoutServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          sessionStorage.removeItem('sessionId')
          sessionStorage.removeItem('userId')
          sessionStorage.removeItem('nowUser')
          localStorage.removeItem('thisUser')
          localStorage.removeItem('thisPass')
          this.$store.state.userNow = ''
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      goBasket () {
        if (sessionStorage.getItem('sessionId')) {
          let url = this.$store.state.urls.local + 'GetBasketServlet'
          let userId = sessionStorage.getItem('userId')
          let sessionId = sessionStorage.getItem('sessionId')
          let formData = new FormData()
          formData.append('userId', userId)
          formData.append('sessionId', sessionId)
          this.$axios.post(url, formData, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            this.$store.state.history.basket = false
            this.$store.state.XZ = []
            this.$store.state.TK = []
            this.$store.state.JD = []
            for (let i = 0; i < response.data.length; i++) {
              switch (response.data[i].kind) {
                case '选择题':
                  this.$store.state.XZ.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                  break
                case '填空题':
                  this.$store.state.TK.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                  break
                case '解答题':
                  this.$store.state.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
                  break
                default:
                  this.$store.state.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer})
              }
            }
            this.$router.push('/basket')
          }, (response) => {
            this.$message.error('请求服务端失败')
          })
        } else {
          this.signShows()
          this.$message('请先登录')
        }
      },
      goMyExam () {
        let url = this.$store.state.urls.local + 'GetPaperServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.myexam = false
          this.$store.state.history.exam = []
          for (let i = 0; i < response.data.length; i++) {
            this.$store.state.history.exam.push({time: response.data[i].time, title: response.data[i].title, id: response.data[i].id})
          }
          this.$router.push('/myexam')
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      searchHistory () {
        let url = this.$store.state.urls.local + 'GetHistoryServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.find = false
          this.$store.state.history.searched = response.data
          this.$router.push('/searched')
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    mounted () {
      this.getCookie()
      if (localStorage.getItem('thisUser')) {
        let name = localStorage.getItem('thisUser')
        let pass = localStorage.getItem('thisPass')
        let formData = new FormData()
        formData.append('tel', name)
        formData.append('pass', pass)
        let url = this.$store.state.urls.url + 'LoginServlet'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          if (response.data.sessionId) {
            sessionStorage.setItem('sessionId', response.data.sessionId)
            sessionStorage.setItem('nowUser', response.data.u.name)
            sessionStorage.setItem('userId', response.data.u.id)
            this.$store.state.userNow = response.data.u.name
            this.signShow = false
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
          this.$message.error('请求服务端失败')
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
    background-color: #fff;
    height: 33px;
    position: fixed;
    right: 10px;
    top: 0;
    z-index: 9;
  }
  .col{
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.75rem;
    height: 33px;
    line-height: 33px;
    text-decoration: underline;
    text-align: center;
    cursor: pointer;
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
</style>
