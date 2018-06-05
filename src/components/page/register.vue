<template>
  <div>
    <div>
      <el-dialog :title="denglu ? msg : ms" :visible.sync="signShow" width="30%">
        <el-form v-if="denglu" :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
          <el-form-item prop="usr">
            <el-input type="password" v-model="ruleForm2.usr" auto-complete="off" placeholder="手机/邮箱/用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
          <hr>
          <p>还没有账号，马上去<span class="to" @click="denglu = false">注册</span></p>
        </el-form>
        <el-form v-else :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="tel" label="电话号码">
            <el-input type="text" v-model.number="ruleForm.tel" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <hr>
          <p>已经有账号，马上去<span class="to" @click="denglu = true">登录</span></p>
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
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
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
        denglu: true,
        msg: '用户名密码登录',
        ms: '用户注册',
        signShow: false,
        ruleForm: {
          pass: '',
          checkPass: '',
          name: '',
          tel: ''
        },
        ruleForm2: {
          pass: '',
          usr: ''
        },
        rules: {
          pass: [
            { validator: validatePass, required: true, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, required: true, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          tel: [
            { required: true, validator: telCheck, trigger: 'blur' }
          ]
        },
        rules2: {
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
            console.log('4654')
            this.$http.post('http://10.14.4.133:8088/OPOT1/servlet/RegisterServlet', {usr: this.ruleForm.name, password: this.ruleForm.pass, phone: this.ruleForm.tel}, {emulateJSON: true}).then((response) => {
              this.$message.success('推荐成功')
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
      }
    },
    mounted () {
      bus.$on('sign', () => {
        this.signShow = true
        console.log('sdadsa')
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
