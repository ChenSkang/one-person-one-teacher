<template>
  <div class="head">
    <div class="top">
      <div class="row">
        <div class="logo">OPOT<span>.</span></div>
      </div>
      <div class="menu">
        <div class="menus" @click="$router.push('/')" :class="{now: $store.state.menu1}">首页<div :class="{under: $store.state.menu1}"></div></div>
        <div class="menus" @click="$router.push('/index')" :class="{now: $store.state.menu2}">推题<div :class="{under: $store.state.menu2}"></div></div>
        <div class="menus" @click="$router.push('/basket')" :class="{now: $store.state.menu3}">试题篮<div :class="{under: $store.state.menu3}"></div></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    created () {
    }
  }
</script>

<style scoped>
  .head{
    width: 100%;
    min-width: 1200px;
    padding: 28px 0;
    background: #fff;
  }
  .top {
    width: 100%;
    height: 55px;
    line-height: 55px;
    display: flex;
    flex-direction: row;
  }
  .row{
    position: relative;
    left: 12%;
    padding-left: 15px;
    padding-right: 15px;
    width: 16.66667%;
  }
  .logo{
    color: #000;
    font-size: 32px;
    margin: 0;
    padding: 0;
    font-weight: 700;
    font-family: "Inconsolata", Arial, sans-serif;
  }
  .logo > span {
    color: #DD356E;
  }
  .menu{
    position: absolute;
    right: 12%;
    color: rgba(0, 0, 0, 0.7);
    font-size: 18px;
    width: 33%;
    display: flex;
    flex-direction: row;
  }
  .menus{
    transition: 0.5s;
    padding: 0 15px;
    position: relative;
    text-align: center;
  }
  .menus div{
    transition: 0.5s;
  }
  .menus:hover{
    color: #000;
  }
  .now{
    color: #000;
  }
  .under{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 13px;
    width: 30px;
    height: 2px;
    background-color: #DD356E;
  }
</style>
