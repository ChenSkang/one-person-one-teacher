<template>
  <div>
    <div class="my-head">
      <div class="logo">一人一名师</div>
    </div>
    <div class="main" :style="{minHeight: minHeight + 'px'}">
      <div class="title">关于我们</div>
      <div class="introduction">
        <div class="first">
          我们的目标
        </div>
        <div class="first-one">
          我们致力于用技术手段提升教学效果，我们提供免费的找题工具，我们希望广大师生能够快速方便地找到所需要的题目。各位老师、家长、同学在使用过程中有任何建议，欢迎在意见反馈中留言，让我们一起配合，打造一款方便高效的找题利器。
        </div>
        <!-- <div class="first">
          团队成员
        </div>
        <div class="first-one">
          陈帅康、曹应平、黄承宏、黄佳新、扈亚恂、蓝贵才、林锴、梁颖琦、王莎莎、王怡、王育志、王政、谢添成、许迅、尹孟然、尧甜、郑传哲
        </div> -->
      </div>
    </div>
    <div class="foot">
      ©Powered by opot
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        minHeight: 0
      }
    },
    methods: {
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 100
    }
  }
</script>

<style scoped>
  .my-head{
    position: relative;
    top: 0;
    width: 100%;
    height: 50px;
  }
  .logo{
    line-height: 50px;
    color: #000;
    font-size: 25px;
    margin: 0;
    padding: 0;
    position: absolute;
    left: 16%;
  }
  .main{
    width: 100%;
    background-color: #F2F6FC;
    position: relative;
  }
  .title{
    width: 68%;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    color: #606266;
    position: relative;
    left: 16%;
    right: 16%;
  }
  .introduction{
    width: 68%;
    position: relative;
    left: 16%;
    right: 16%;
    background-color: #fff;
    min-height: 500px;
  }
  .first{
    margin-left: 20px;
    height: 60px;
    line-height: 60px;
    font-weight: 400;
    color: #606266;
    font-size: 22px;
    letter-spacing: 2px;
  }
  .first-one{
    margin-left: 20px;
    font-size: 14px;
    color: #909399;
    letter-spacing: 1px;
  }
   .foot {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #F2F6FC;
  }
</style>
