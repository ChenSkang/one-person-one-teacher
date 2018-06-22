<template>
  <div id="app">
    <router-view></router-view>
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
    },
    methods: {
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
