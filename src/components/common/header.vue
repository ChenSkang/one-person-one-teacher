<template>
  <div class="head">
    <div class="top">
      <div class="row">
        <div class="logo">OPOT<span>.</span></div>
      </div>
      <div class="menu">
        <el-menu :default-active="$route.path"
                 active-text-color="#000" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/index">推题</el-menu-item>
          <el-menu-item index="/basket">试题篮</a></el-menu-item>
        </el-menu>
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
    display: flex;
    flex-direction: row;
  }
  .el-menu-item{
    font-size: 17px;
  }
  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid #DD356E !important;
    color: #303133;
  }
</style>
