<template>
  <div id="head">
    <div class="top">
      <el-row>
        <el-col :span="12"><div></div></el-col>
        <el-col :span="12"><div></div></el-col>
      </el-row>
    </div>
    <div class="main">
      <div class="title">OPOT</div>
    </div>
    <div class="down"></div>
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
  #head{
    width: 100%;
    height: 120px;
  }
  .top {
    width: 100%;
    min-width: 1200px;
    height: 40px;
    line-height: 40px;
    text-align: right;
    border-bottom: 1px solid #dadada;
    background: #fff;
  }
  .main{
    height: 80px;
  }
  .title{
    width: 30%;
    text-align: center;
    line-height: 80px;
    font-size: 40px;
  }
</style>
