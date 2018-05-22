<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app'
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
