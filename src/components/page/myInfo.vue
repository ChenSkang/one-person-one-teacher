<template>
  <div>
    <my-head></my-head>
    <my-space></my-space>
    <div class="main" :style="{minHeight: minHeight + 'px'}">
      <div class="title">
        <div class="title-info"><p>个人中心</p></div>
      </div>
      <div class="changeInfo">
        <div class="left">
          <div class="info-name" @click="$router.push({path: '/userInfo', query: {info: '0'}})">个人信息</div>
          <div class="info-name" @click="$router.push({path: '/userInfo', query: {info: '1'}})">密码修改</div>
          <div class="info-name" @click="$router.push({path: '/userInfo', query: {info: '2'}})">手机绑定</div>
        </div>
        <div class="right">
          <div class="your-info" v-if="nowStep == 0">
            <div class="head-img">
              <img :src="$store.state.imgSrc" width="80px" alt="">
            </div>
            <div class="change-img">
              更换头像
            </div>
            <div class="three-info">
              <el-form label-position="right" label-width="80px" :model="threeInfo">
                <el-form-item label="用户名">
                  <el-input v-model="threeInfo.name" :placeholder="$store.state.userNow"></el-input>
                </el-form-item>
                <el-form-item label="年级">
                  <el-select v-model="classValue" placeholder="八年级">
                    <el-option
                      v-for="item in theClasses"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="教材版本">
                  <el-select v-model="teachValue" placeholder="人教版">
                    <el-option
                      v-for="item in theTeach"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div class="change-btn">保存</div>
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
                  <el-button type="primary" @click="passSure('passForm')">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="your-info" v-if="nowStep == 2">
            <div class="three-info">
              <el-form label-position="right" label-width="80px" :model="threeInfo">
                <el-form-item label="当前手机">
                  {{18831299176}}
                </el-form-item>
                <el-form-item label="验证信息">
                  <el-col :span="11">
                    <el-input placeholder="手机验证码" v-model="code"></el-input>
                  </el-col>
                  <el-col :offset="1" :span="12">
                    <div class="btn-primary get-btn" @click="getCode()">点击获取验证码</div>
                  </el-col>
                </el-form-item>
                <el-form-item label="新的手机">
                  <el-input v-model="phone" placeholder="手机号" value="number" @keyup.native.enter="myPhone()" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="change-btn">确定</div>
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
        threeInfo: {
          name: ''
        },
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
            { required: true, trigger: 'blur' }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          ifPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        getCode: true,
        totalTime: 60,
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
          let url = this.$store.state.urls.url + '/user/sendCode'
          let fd = new FormData()
          fd.append('phone', this.phone)
          fd.append('way', 1)
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            withCredentials: true
          }).then((response) => {
            console.log(response)
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
          let url = this.$store.state.urls.url + '/user/checkCode'
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
            if (response.data.msg === '成功') {
              console.log(response)
              this.$router.push({path: '/safe', query: {now: 'pass_input', step: 2}})
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
      passSure (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.$store.state.urls.url + '/user/reset'
            let fd = new FormData()
            fd.append('password', this.passForm.oldpass)
            fd.append('password', this.passForm.pass)
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
    height: 150px;
    background-color: blue;
  }
  .title-info{
    font-size: 20px;
    color: #303133;
    z-index: 999;
  }
  .changeInfo{
    position: absolute;
    left: 10%;
    top: 150px;
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
