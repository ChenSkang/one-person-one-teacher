<template>
  <div>
    <el-button class="btn" size="small" @click="gotop">⇑</el-button>
  </div>
</template>

<script>
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  export default {
    components: {ElButton},
    data () {
      return {
      }
    },
    methods: {
      gotop () {
        /* let gotoTop = function () {
          let currentPosition = document.documentElement.scrollTop || document.body.scrollTop
          currentPosition -= 10
          if (currentPosition > 0) {
            window.scrollTo(0, currentPosition)
          } else {
            window.scrollTo(0, 0)
            clearInterval(timer)
            timer = null
          }
        }
        let timer = setInterval(gotoTop, 0.1)
      } */
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }
    }
  }
</script>

<style scoped>
.btn{
  text-align: center;
  font-size: 1.05rem;
  position: fixed;
  bottom: 50px;
  right: 2%;
}
</style>
