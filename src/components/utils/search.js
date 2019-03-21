/**
 * Created by getYou on 2019/3/19.
 */
export default {
  install (Vue, options) {
    // 文字搜索
    Vue.prototype.searchQuestion = function (msg, page) {
      this.$store.state.history.loadingTwo = true
      let sessionId = sessionStorage.getItem('sessionId') ? sessionStorage.getItem('sessionId') : ''
      let formData = new FormData()
      formData.append('question', msg)
      formData.append('page', page)
      formData.append('sessionId', sessionId)
      let url = this.$store.state.urls.url + 'search/wordSearch'
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response)
        this.$store.state.nowSub = response.data.data
        this.$store.state.nowSubs = response.data.msg
        this.$store.state.history.loadingTwo = false
        this.$store.state.history.nowHomePage = page
      }, (response) => {
        this.$store.state.history.loadingTwo = false
        this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
          confirmButtonText: '确定'
        })
      })
    }
    // 图片搜索
    Vue.prototype.imgSearch = function () {
      let sessionId = sessionStorage.getItem('sessionId') ? sessionStorage.getItem('sessionId') : ''
      const page = this.$store.state.cropImg
      let arr = page.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const obj = new Blob([u8arr], {type: mime})
      const fd = new FormData()
      fd.append('image', obj, 'image.png')
      fd.append('sessionId', sessionId)
      let url = this.$store.state.urls.url + 'search/pictureSearch'
      this.$axios.post(url, fd, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response)
        this.$store.state.nowSub = response.data.data
        this.$store.state.nowSubs = response.data.msg
      }, (response) => {
        this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
          confirmButtonText: '确定'
        })
      })
    }
  }
}
