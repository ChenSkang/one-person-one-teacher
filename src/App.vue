<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/') {
          this.$store.state.menu2 = false
          this.$store.state.menu3 = false
          this.$store.state.menu4 = false
          this.$store.state.menu1 = true
          console.log('sdada')
        }
        if (to.path === '/index') {
          this.$store.state.menu2 = true
          this.$store.state.menu3 = false
          this.$store.state.menu4 = false
          this.$store.state.menu1 = false
        }
        if (to.path === '/basket') {
          this.$store.state.menu3 = true
          this.$store.state.menu2 = false
          this.$store.state.menu4 = false
          this.$store.state.menu1 = false
        }
      }
    },
    methods: {
    }
  }
</script>

<style>
  @import "CSS/animate.css";
  *{
    margin:0;
    padding:0;
    text-decoration: none;
    list-style: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
  }
</style>
