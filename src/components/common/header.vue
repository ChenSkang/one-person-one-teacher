<template>
  <div class="head">
    <el-row class="top">
      <el-col :span="4" class="row">
        <div class="logo" @click="$router.push('/')">OPOT<span>.</span></div>
      </el-col>
      <!--
      <div class="menu">
        <el-menu :default-active="$route.path"
                 active-text-color="#000" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/index">推题</el-menu-item>
          <el-menu-item index="/basket">试题篮</el-menu-item>
        </el-menu>
      </div> !-->
    </el-row>
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
    padding-left: 15px;
    padding-right: 15px;
  }
  .logo{
    color: #000;
    font-size: 2rem;
    margin: 0;
    padding: 0;
    font-weight: 700;
    font-family: "Inconsolata", Arial, sans-serif;
  }
  .logo > span {
    color: #DD356E;
  }
</style>
