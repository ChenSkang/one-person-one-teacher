<template>
  <div id="answer">
    <el-dialog title="试题解析" :visible.sync="$store.state.IFJX" width="70%" :append-to-body="true">
      <div class="ST TI" v-html="$store.state.myTest[0].question"></div>
      <div class="ZSD TI" v-if="$store.state.myTest[0].knowledge"><span class="jx">考点：</span><span v-html="$store.state.myTest[0].knowledge"></span></div>
      <div class="JX TI"><span class="jx">解析：</span><span v-html="$store.state.myTest[0].analysis"></span></div>
      <div class="JX TI"><span class="jx">解答：</span><span v-html="$store.state.myTest[0].answer"></span></div>
      <div class="KD TI" v-if="$store.state.myTest[0].kddp"><span class="jx">点评：</span><span v-html="$store.state.myTest[0].kddp"></span></div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>
