<template>
  <div id="answer">
    <el-dialog title="试题解析" :visible.sync="IFJX" width="70%">
      <div class="ST TI" v-html="myTest[0].que"></div>
      <div class="ZSD TI" v-if="myTest[0].zsd"><span class="jx">考点：</span><span v-html="myTest[0].zsd"></span></div>
      <div class="JX TI"><span class="jx">解析：</span><span v-html="myTest[0].jx"></span></div>
      <div class="JX TI"><span class="jx">解答：</span><span v-html="myTest[0].answer"></span></div>
      <div class="KD TI" v-if="myTest[0].kddp"><span class="jx">点评：</span><span v-html="myTest[0].kddp"></span></div>
    </el-dialog>
  </div>
</template>

<script>
  import bus from '../../bus'
  export default {
    data () {
      return {
        IFJX: false,
        myTest: [
          { que: '' },
          { kddp: '' },
          { zsd: '' },
          { answer: '' },
          { jx: '' }
        ]
      }
    },
    mounted () {
      bus.$on('JX', (que, kddp, zsd, answer, jx) => {
        this.myTest[0].que = que
        this.myTest[0].kddp = kddp
        this.myTest[0].zsd = zsd
        this.myTest[0].answer = answer
        this.myTest[0].jx = jx
        this.IFJX = true
      })
    }
  }
</script>

<style scoped>
</style>
