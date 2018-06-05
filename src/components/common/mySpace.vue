<template>
  <div id="space">
    <el-tooltip class="item" effect="light" content="点击登录" placement="bottom-start">

    </el-tooltip>
    <el-dropdown>
      <el-button icon="el-icon-document" size="small" @click="signShows()"></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native ="$router.push('/basket')">试题篮</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import bus from '../../bus'
  export default {
    data () {
      return {
      }
    },
    methods: {
      signShows () {
        bus.$emit('sign')
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
