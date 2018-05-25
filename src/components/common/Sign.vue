<template>
  <div>
    <myHead></myHead>
    <div class="main">
      <div class="concern">
        <div class="hi">
          <h1>This is a piece of text &amp; Please replace me</h1>
        </div>
        <div class="ipt">
          <el-input suffix-icon="el-icon-search"></el-input>
        </div>
        <div class="btn">
          <div class="search btn_text" @click="turn">文字说明</div>
          <div class="basket btn_text" @click="$router.push('/basket')">试题篮</div>
        </div>
      </div>
    </div>
    <myFoot style="position: absolute; bottom: 0"></myFoot>
  </div>
</template>

<script>
  import myHead from './header.vue'
  import myFoot from './footer.vue'
  export default {
    data () {
      return {
      }
    },
    methods: {
      turn () {
        this.$router.push('/index')
      }
    },
    components: {
      myHead,
      myFoot
    },
    created () {
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
  }
  .concern{
    width: 45%;
    margin-left: 27.5%;
    margin-top: 100px;
  }
  .hi > h1{
    margin-bottom: 20px;
    font-size: 54px;
    line-height: 1.3;
    font-weight: 300;
    font-family: sans-serif;
    text-align: center;
    color: #000;
  }
  .btn {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .btn_text {
    width: 160px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 30px;
    font-size: 18px;
    transition: 0.5s;
  }
  .btn_text:hover{
    box-shadow: 0 10px 10px -3px #ccc;
  }
  .search{
    background: #dd356e;
    color: #fff;
    margin-left: 50%;
    transform: translateX(-180px);
  }
  .basket{
    background: #fee856;
    color: #000;
    transform: translateX(-140px);
  }
</style>
