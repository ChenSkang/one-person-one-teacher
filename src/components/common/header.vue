<template>
  <div class="head">
    <el-row class="top">
      <el-col :span="4" class="row">
        <div class="logo" @click="$router.push('/')">OPOT<span>.</span></div>
      </el-col>
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
    z-index: 999;
    position: fixed;
    width: 100%;
    height: 40px;
    background-image: url("./../../img/base_title.png");
    background-size: cover;
  }
  .top {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .row{
    position: relative;
    left: 16%;
  }
  .logo{
    color: #fff;
    font-size: 25px;
    margin: 0;
    padding: 0;
    font-weight: 700;
    font-family: "Inconsolata", Arial, sans-serif;
  }
</style>
