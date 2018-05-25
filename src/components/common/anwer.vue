<template>
  <div>
    <el-dialog title="试题解析" :visible.sync="IFJX" width="70%">
      <div class="ST TI">{{myTest[0].que}}</div>
      <div class="KD TI">【考点】{{myTest[0].kddp}}</div>
      <div class="ZSD TI">【知识点】{{myTest[0].zsd}}</div>
      <div class="JX TI">【解析】{{myTest[0].jx}}</div>
      <div class="JX TI">【解答】{{myTest[0].answer}}</div>
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
        this.IFJX = true
        this.myTest[0].que = que
        this.myTest[0].kddp = kddp
        this.myTest[0].zsd = zsd
        this.myTest[0].answer = answer
        this.myTest[0].jx = jx
      })
    }
  }
</script>

<style scoped>
  .TI{
    line-height: 25px;
    font-size: 14px;
    padding: 20px 20px 20px 20px;
  }
</style>
