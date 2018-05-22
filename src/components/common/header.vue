<template>
  <div class="head">
    <div class="top">
      <div class="row">
        <div class="logo">OPOT<span>.</span></div>
      </div>
      <div class="menu"></div>
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
  }
  .row{
    position: relative;
    left: 12%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    float: left;
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
</style>
