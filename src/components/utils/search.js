/**
 * Created by getYou on 2019/3/19.
 */
export default {
  install (Vue, options) {
    // 文字搜索
    Vue.prototype.searchQuestion = function (msg, page, kind, nianji, jiaocai, way) {
      if (msg.length === 0 || msg.split(' ').join('').length === 0) {
        this.$message.error('搜索内容不能为空')
      } else {
        this.$store.state.history.loadingTwo = true
        let sessionId = sessionStorage.getItem('sessionId') ? sessionStorage.getItem('sessionId') : ''
        let formData = new FormData()
        formData.append('question', msg)
        formData.append('page', page)
        formData.append('sessionId', sessionId)
        formData.append('kind', kind)
        formData.append('nianji', nianji)
        formData.append('jiaocai', jiaocai)
        /* formData.append('way', way) */
        let url = this.$store.state.urls.url + 'search/wordSearch'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          if (response.data.msg === '没有找到题目噢') {
            this.$store.state.history.loadingTwo = false
            this.$alert('没有找到搜索相关的题目', '抱歉', {
              confirmButtonText: '确定'
            })
          } else {
            this.$store.state.nowSub = response.data.data
            this.$store.state.history.loadingTwo = false
            this.$store.state.history.nowHomePage = page
          }
        }, (response) => {
          this.$store.state.history.loadingTwo = false
          this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
            confirmButtonText: '确定'
          })
        })
      }
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
      this.$store.state.history.loading = true
      this.$axios.post(url, fd, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response)
        this.$store.state.nowSub = response.data.data
        this.$store.state.nowSubs = response.data.msg
        this.$store.state.history.loading = false
      }, (response) => {
        this.$store.state.history.loading = false
        this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
          confirmButtonText: '确定'
        })
      })
    }
    // 以题推题
    Vue.prototype.searchSimilar = function (msg) {
      if (msg.length === 0) {
        this.$message.error('搜索内容不能为空')
      } else {
        let sessionId = sessionStorage.getItem('sessionId') ? sessionStorage.getItem('sessionId') : ''
        let formData = new FormData()
        formData.append('md5', msg)
        formData.append('sessionId', sessionId)
        let url = this.$store.state.urls.url + 'search/similarSearch'
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$store.state.nowSub = response.data.data
          this.$store.state.nowSubs = response.data.msg
        }, (response) => {
          this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
            confirmButtonText: '确定'
          })
        })
      }
    }
    Vue.prototype.searchHotMsg = function (hot) {
      let num = Math.random() * 10000
      let routeData = this.$router.resolve({
        path: '/index',
        query: {
          servlet: 'wordSearch',
          msg: hot,
          page: 1,
          kind: '全部',
          nianji: this.$store.state.nianji,
          jiaocai: this.$store.state.jiaocai,
          way: 0,
          num: num
        }
      })
      window.open(routeData.href, '_blank')
    }
    // md5推题
    Vue.prototype.similarSearch = function (msg) {
      let num = Math.random() * 10000
      let routeData = this.$router.resolve({
        path: '/similarSearch',
        query: {
          servlet: 'similar',
          msg: msg,
          num: num
        }
      })
      window.open(routeData.href, '_blank')
    }
    // 列表获取
    Vue.prototype.getWordList = function (msg) {
      let url = this.$store.state.urls.url + 'search/getMould'
      let formData = new FormData()
      formData.append('question', msg)
      if (msg.length > 0 && msg.split(' ').join('').length > 0) {
        this.$axios.post(url, formData).then((res) => {
          if (res.data.code === 1) {
            this.$store.state.myData = res.data.data
          }
          console.log(res)
        }, (res) => {
          console.log('error')
        })
      } else {
        this.$store.state.myData = []
      }
    }
  }
}
