/**
 * Created by getYou on 2018/5/8.
 */
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function () {
      let title = this.htmlTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        scale: 2,
        allowTaint: false,
        useCORS: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    }
    // 搜索历史
    Vue.prototype.searchHistory = function () {
      if (sessionStorage.getItem('sessionId')) {
        let url = this.$store.state.urls.url + 'GetHistoryServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.find = false
          this.$store.state.history.searched = response.data
          if (this.$route.path !== '/searched') {
            this.$router.push('/searched')
          }
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      } else {
        this.signShows()
        this.$message('请先登录')
      }
    }
    // 历史试题
    Vue.prototype.goMyExam = function () {
      if (sessionStorage.getItem('sessionId')) {
        let url = this.$store.state.urls.url + 'GetPaperServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.myexam = false
          this.$store.state.history.exam = []
          for (let i = 0; i < response.data.length; i++) {
            this.$store.state.history.exam.push({time: response.data[i].time, title: response.data[i].title, id: response.data[i].id})
          }
          if (this.$route.path !== '/myexam') {
            this.$router.push('/myexam')
          }
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      } else {
        this.signShows()
        this.$message('请先登录')
      }
    }
    // 试题篮
    Vue.prototype.goBasket = function () {
      if (sessionStorage.getItem('sessionId')) {
        this.$store.state.history.loading = true
        let url = this.$store.state.urls.url + 'GetBasketServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.basket = false
          this.$store.state.XZ = []
          this.$store.state.TK = []
          this.$store.state.JD = []
          for (let i = 0; i < response.data.length; i++) {
            switch (response.data[i].kind) {
              case '选择题':
                this.$store.state.XZ.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer, area: 0})
                break
              case '填空题':
                this.$store.state.TK.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer, area: 0})
                break
              case '解答题':
                this.$store.state.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer, area: 0})
                break
              default:
                this.$store.state.JD.push({que: response.data[i].que, unique: response.data[i].unique, jx: response.data[i].jx, answer: response.data[i].answer, area: 0})
            }
          }
          this.$store.state.history.loading = false
          if (this.$route.path !== '/basket') {
            this.$router.push('/basket')
          }
        }, (response) => {
          this.$store.state.history.loading = false
          this.$message.error('请求服务端失败')
        })
      } else {
        this.signShows()
        this.$message('请先登录')
      }
    }
    // 登录
    Vue.prototype.signShows = function () {
      if (sessionStorage.getItem('sessionId')) {
        this.$message('请不要重复登录')
      } else {
        this.$store.state.signShow = true
      }
    }
    // 文字搜索
    Vue.prototype.wordSearch = function (msg) {
      const way = this.$store.state.value ? this.$store.state.value + 1 : 1
      this.$store.state.history.loading = true
      const kind = this.$store.state.select + '题'
      let formData = new FormData()
      if (way === 3) {
        let ms = this.$store.state.zsdTreeTags.join('；')
        formData.append('word', ms)
      } else {
        formData.append('word', msg)
      }
      formData.append('way', way)
      formData.append('kind', kind)
      let url = this.$store.state.urls.url + 'wordServlet'
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        this.$store.state.cropImg = ''
        sessionStorage.removeItem('defaultSrc')
        this.$store.state.history.loading = false
        sessionStorage.setItem('subj', JSON.stringify(response.data))
        console.log(response.data)
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        if (way === 1) {
          sessionStorage.setItem('title_number', 'true')
        } else {
          sessionStorage.setItem('title_number', 'false')
        }
        this.$store.state.history.nowHomePage = 1
      }, (response) => {
        this.$store.state.history.loading = false
        this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
          confirmButtonText: '确定'
        })
      })
    }
    // 重新推题
    Vue.prototype.againSearch = function (msg) {
      this.$store.state.history.loading = true
      let formData = new FormData()
      formData.append('md5', msg)
      let url = this.$store.state.urls.url + 'GetSimilarServlet'
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        this.$store.state.cropImg = ''
        sessionStorage.removeItem('defaultSrc')
        this.$store.state.history.loading = false
        sessionStorage.setItem('subj', JSON.stringify(response.data))
        console.log(response.data)
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        sessionStorage.setItem('title_number', 'true')
        this.$store.state.history.nowHomePage = 1
        this.$router.push({path: '/index', query: {servlet: 'againSearch', msg: msg}})
      }, (response) => {
        this.$store.state.history.loading = false
        this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
          confirmButtonText: '确定'
        })
      })
    }
    Vue.prototype.zsdTagsClose = function (tag) {
      this.$store.state.zsdTreeTags.splice(this.$store.state.zsdTreeTags.indexOf(tag), 1)
    }
    Vue.prototype.getPaperList = function () {
      if (sessionStorage.getItem('sessionId')) {
        let url = this.$store.state.urls.url + 'GetPaperListServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response.data)
          this.$store.state.paperList = response.data
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      } else {
        this.signShows()
        this.$message('请先登录')
      }
    }
    Vue.prototype.createPaper = function (value) {
      let url = this.$store.state.urls.url + 'CreatePaperServlet'
      let sessionId = sessionStorage.getItem('sessionId')
      let formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('title', value)
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response.data)
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.getPaper = function (x) {
      let url = this.$store.state.urls.url + 'GetPaperServlet'
      let sessionId = sessionStorage.getItem('sessionId')
      let formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('pid', x)
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response.data)
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.deletePaper = function (x) {
      let url = this.$store.state.urls.url + 'DeletePaperServlet'
      let sessionId = sessionStorage.getItem('sessionId')
      let formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('pid', x)
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        console.log(response.data)
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.signOut = function () {
      let url = this.$store.state.urls.url + '/user/logout'
      let sessionId = sessionStorage.getItem('sessionId')
      let formData = new FormData()
      formData.append('sessionId', sessionId)
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        sessionStorage.removeItem('sessionId')
        sessionStorage.removeItem('nowUser')
        localStorage.removeItem('thisUser')
        localStorage.removeItem('thisPass')
        this.$store.state.userNow = ''
        this.$router.push('/')
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.imgSearch = function () {
      this.$store.state.history.loading = true
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
      fd.append('upfile', obj, 'image.png')
      let url = this.$store.state.urls.url + 'pictureServlet'
      this.$axios.post(url, fd, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        this.$store.state.history.loading = false
        this.$store.state.nowSub = ''
        sessionStorage.setItem('defaultSrc', this.$store.state.cropImg)
        sessionStorage.setItem('subj', JSON.stringify(response.data))
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        this.$router.push({path: '/index', query: {servlet: 'imgSearch', msg: this.$store.state.cropImg}})
        this.$store.state.history.nowHomePage = 1
        console.log(response.data)
      }, (response) => {
        this.$store.state.history.loading = false
        this.$store.state.cropImg = sessionStorage.getItem('defaultSrc')
        this.$alert('请检查图片内容并确认网络是否正常', '未知错误', {
          confirmButtonText: '确定'
        })
      })
    }
    Vue.prototype.searchQuestion = function (msg, page) {
      this.$store.state.history.loadingTwo = true
      let formData = new FormData()
      formData.append('question', msg)
      formData.append('page', page)
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
         /* console.log(response.data)
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj) */
        this.$store.state.history.nowHomePage = page
      }, (response) => {
        this.$store.state.history.loadingTwo = false
        this.$alert('请检查文本内容并确认网络是否正常', '搜索出错', {
          confirmButtonText: '确定'
        })
      })
    }
  }
}
