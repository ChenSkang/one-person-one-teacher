<template>
  <div>
    <div>

    </div>
  </div>
</template>

<script>
  import bus from '../../bus'
  export default {
    data () {

    },
    methods: {

    },
    mounted () {
      bus.$on('register', () => {
        this.registerShow = true
      })
    }
  }
</script>

<style scoped>

</style>
