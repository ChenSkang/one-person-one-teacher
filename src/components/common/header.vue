<template>
  <div class="head">
    <div class="top">
      <div class="row"><div class="logo" @click="$router.push('/')">OPOT</div></div>
      <div class="row"><div class="navigation" @click="$router.push('/')">搜索</div></div>
      <div class="row"><div class="navigation" @click="$router.push('/')">我的试卷</div></div>
      <div class="row"><div class="navigation" @click="$router.push('/')">搜索历史</div></div>
    </div>
    <div class="user">
      <div class="name" v-if="$store.state.userNow">{{$store.state.userNow}}</div>
      <div class="name" v-else>注册帐号</div>
      <div class="port">
        <img :src="imgSrc" alt="">
      </div>
      <div class="user-info">
        <div class="info">个人中心</div>
        <div class="info">用户反馈</div>
        <div class="info">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        imgSrc: require('../../img/user.png')
      }
    },
    created () {
    }
  }
</script>

<style scoped>
  .head{
    z-index: 990;
    position: fixed;
    width: 100%;
    height: 50px;
  }
  .top {
    float: left;
    height: 50px;
    line-height: 50px;
    display: flex;
    flex-direction: row;
  }
  .row{
    position: relative;
    left: 20px;
    color: #fff;
    margin-right: 20px;
    cursor: pointer;
  }
  .logo{
    font-size: 19px;
    margin: 0;
    padding: 0;
    font-weight: 500;
  }
  navigation{
    font-size: 14px;
    color: #fff;
  }
  .user{
    float: right;
    height: 50px;
    display: flex;
    flex-direction: row;
  }
  .name{
    line-height: 50px;
    color: #fff;
    margin-right: 8px;
  }
  .port{
    margin-top: 11px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: white;
    margin-right: 20px;
  }
  .port img{
    width: 28px;
    height: 28px;
  }
  .user-info{
    color: #606266;
    position: absolute;
    top: 50px;
    background-color: #fff;
    padding:2px 0;
    border-radius: 2px;
  }
  .info{
    cursor: pointer;
    padding: 5px 10px;
  }
  .info:hover{
    background-color: #409eff;
  }
</style>
