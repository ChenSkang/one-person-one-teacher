<template>
  <div class="search">
    <div class="header-concern">
      <div style="width: 100%; position: relative">
        <el-input v-model="$store.state.input_message" @keyup.native.enter="searchMsg()" placeholder="题干/知识点/试卷"></el-input>
        <div style="position: absolute; right: 15px; top: 6px; cursor: pointer">
          <img src="../../img/phone.png" width="28px" />
        </div>
      </div>
      <div class="btn-primary search-btn" @click="searchMsg()">
        <i class="el-icon-search">搜题</i>
      </div>
      <div class="btn-primary search-page">
        <i class="el-icon-document">组卷</i>
      </div>
    </div>
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
  .search{
    z-index: 990;
    position: fixed;
    width: 100%;
    height: 62px;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #DCDFE6;
    box-shadow:0 0 5px 0 #DCDFE6;
  }
  .header-concern {
    margin: 11px 7%;
    width: 80%;
    display: flex;
    flex-direction: row;
    position: relative;
  }
</style>
