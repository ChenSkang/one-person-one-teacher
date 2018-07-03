<template>
  <div>
    <el-row id="space">
      <el-col :span="6" v-if="nowuser"><div class="col" @click="signShows()"><span>登录</span></div></el-col>
      <el-col :span="4" v-else><div class="col"><span>{{$store.state.userNow}}</span></div></el-col>
      <el-col :span="6" v-if="nowuser"><div class="col" @click="goRegister()"><span>注册</span></div></el-col>
      <el-col :span="4" v-else><div class="col" @click="signOut()"><span>退出</span></div></el-col>
      <el-col :span="4" v-if="!nowuser"><div class="col" @click="$router.push('/myexam')"><span>历史试题</span></div></el-col>
      <el-col :span="4" v-if="!nowuser"><div class="col"><span>搜索历史</span></div></el-col>
      <el-col :span="nowuser ? 6 : 4"><div class="col" @click="$router.push('/basket')"><span>试题篮</span></div></el-col>
      <el-col :span="nowuser ? 6 : 4"><div class="col" @click="$router.push('/')"><span>首页</span></div></el-col>
    </el-row>
  </div>
</template>

<script>
  import bus from '../../bus'
  export default {
    data () {
      return {
      }
    },
    methods: {
      signShows () {
        bus.$emit('sign')
      },
      goRegister () {
        bus.$emit('register')
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
          this.$store.state.userNow = ''
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
  }
</style>
