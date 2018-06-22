<template>
  <div>
    <div>
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
            <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
            <el-button @click="resetForm('registerForm')">重置</el-button>
          </el-form-item>
          <hr>
          <p>已经有账号，马上去<span class="to" @click="gosign()">登录</span></p>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import bus from '../../bus'
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
      submitForm (formName) {
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
              this.$message.success('注册成功')
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
      gosign () {
        this.registerShow = false
        bus.$emit('sign')
      }
    },
    mounted () {
      bus.$on('register', () => {
        this.registerShow = true
      })
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
</style>
