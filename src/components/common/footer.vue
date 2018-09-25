<template>
  <div id="footer">
    <div class="main">
      <div class="foot-main" style="display: inline"><span>关于我们</span>丨</div>
      <div class="foot-main" style="display: inline"><span>意见反馈</span></div>
      <div class="foot-main"> ©opot.com版权所有</div>
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
    top: 40px;
    bottom: 0;
    background-color: #409EFF;
  }
  .main{
    font-size: 12px;
    color: #fff;
    text-align: center;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
  }
  .foot-main{
  }
  .foot-main:hover span{
    text-decoration: underline;
    color: #000;
  }
</style>
