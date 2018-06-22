<template>
  <div>
    <div>
      <el-dialog :title="msg" :visible.sync="signShow" width="30%" :modal="false">
        <el-form :model="signForm" :rules="signRule" ref="signForm" class="demo-ruleForm">
          <el-form-item prop="usr">
            <el-input type="text" v-model="signForm.usr" auto-complete="off" placeholder="手机/邮箱/用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="signForm.pass" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('signForm')">登录</el-button>
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
  </div>
</template>

<script>
  import bus from '../../bus'
  export default {
    data () {
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
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 保存的账号
            let name = this.signForm.usr
            // 保存的密码
            let pass = this.signForm.pass
            if (this.checked === true) {
              // 传入账号名，密码，和保存天数3个参数
              this.setCookie(name, pass, 7)
            } else {
              this.clearCookie()
            }
            let formData = new FormData()
            formData.append('tel', this.signForm.usr)
            formData.append('pass', this.signForm.pass)
            let url = this.$store.state.urls.local + 'LoginServlet'
            this.$axios.post(url, formData, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              withCredentials: true
            }).then((response) => {
              console.log(response.data.sessionId)
              console.log(response)
              if (response.data.sessionId) {
                sessionStorage.setItem('sessionId', response.data.sessionId)
                sessionStorage.setItem('nowUser', response.data.u.name)
                sessionStorage.setItem('userId', response.data.u.id)
              } else {
                this.$alert('账户名或密码错误', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'info',
                      message: `action: ${action}`
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
      goRegister () {
        this.signShow = false
        bus.$emit('register')
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
      }
    },
    mounted () {
      bus.$on('sign', () => {
        this.signShow = true
      })
      this.getCookie()
    }
  }
</script>

<style scoped>
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
