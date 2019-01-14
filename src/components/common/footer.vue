<template>
  <div id="footer">
    <div class="main">
      <div class="foot-main" style="display: inline" @click="about()"><span>关于我们</span>丨</div>
      <div class="foot-main" style="display: inline" @click="toSay()"><span>意见反馈</span></div>
      <div class="foot-main">冀ICP备18020905号 ©opot.net.cn版权所有</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      about () {
        window.open('#/enter')
      },
      toSay () {
        window.open('http://support.qq.com/product/38530')
      }
    }
  }
</script>

<style scoped>
  #footer{
    width: 100%;
    height: 50px;
    position: relative;
    top: 50px;
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
    cursor: pointer;
    letter-spacing: 1px;
  }
  .foot-main:hover span{
    text-decoration: underline;
    color: #000;
  }
</style>
