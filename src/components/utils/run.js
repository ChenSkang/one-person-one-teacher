/**
 * Created by getYou on 2018/5/27.
 */
export default{
  install (Vue, options) {
    Vue.prototype.run = function (path) {
      this.$router.push({
        path,
        query: {
          t: +new Date()
      }
      })
    }
  }
}
