<template>
  <div id="space">
    <el-tooltip class="item" effect="light" content="点击进入试题篮" placement="bottom-start">
      <el-button icon="el-icon-document" @click="$router.push('/basket')" circle></el-button>
    </el-tooltip>
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
#space{
  position: absolute;
  top: 30px;
  right: 10%;
}
</style>
