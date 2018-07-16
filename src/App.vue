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
      }
    }
  }
</script>

<style>
  *{
    margin:0;
    padding:0;
    text-decoration: none;
    list-style: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
  }
</style>
