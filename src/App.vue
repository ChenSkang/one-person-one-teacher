<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import 'babel-polyfill'
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    mounted () {
      if (sessionStorage.getItem('sessionId')) {
        this.$store.state.userNow = sessionStorage.getItem('nowUser')
        this.$store.state.imgSrc = sessionStorage.getItem('headImg')
        this.$store.state.jiaocai = sessionStorage.getItem('jiaocai')
        this.$store.state.nianji = sessionStorage.getItem('nianji')
        this.$store.state.phone = sessionStorage.getItem('phone')
      }
    }
  }
</script>

<style>
  @import "css/myapp.css";
  @import "css/math.css";
  @import "css/que.css";
  *{
    margin:0;
    padding:0;
    text-decoration: none;
    list-style: none;
  }
  #app {
    font-family: 微软雅黑, Arial, sans-serif;
    width: 100%;
    height: 100%;
    min-width: 1200px;
    min-height: 100%;
    font-size: 16px;
  }
</style>
