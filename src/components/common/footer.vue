<template>
  <div id="footer">
    <div class="main">
      <div class="foot-main left"><span>关于我们</span>丨</div>
      <div class="foot-main"><span>意见反馈</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<style scoped>
  #footer{
    width: 100%;
    height: 50px;
    position: relative;
    bottom: 0;
    top: 40px;
    background-color: #409EFF;
  }
  .main{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
  }
  .foot-main{
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #fff;
    text-align: center;
  }
  .foot-main:hover span{
    text-decoration: underline;
    color: #000;
  }
</style>
