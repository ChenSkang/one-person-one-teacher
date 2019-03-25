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
        let url = this.$store.state.urls.url + 'user/getHistory'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$store.state.history.searched = response.data.data
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
    // 试题篮
    Vue.prototype.goBasket = function () {
      if (sessionStorage.getItem('sessionId')) {
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
        }, (response) => {
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
    Vue.prototype.getPaperList = function () {
      if (sessionStorage.getItem('sessionId')) {
        let url = this.$store.state.urls.url + 'paper/getList'
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
          if (response.data.msg === '登陆超时，请重新登陆') {
            this.$message.error('登录超时')
            this.signOut()
          }
          this.$store.state.paperList = response.data.data
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      } else {
        this.signShows()
        this.$message('请先登录')
      }
    }
    Vue.prototype.createPaper = function (value) {
      if (this.$store.state.paperList.length >= 15) {
        this.$message('最多创建十五张试卷')
      } else {
        let url = this.$store.state.urls.url + 'paper/create'
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
          this.$store.state.paperList = response.data.data
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    }
    Vue.prototype.getPaper = function (x) {
      let url = this.$store.state.urls.url + 'paper/getPaper'
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
    Vue.prototype.addQue = function (pid, que) {
      let url = this.$store.state.urls.url + 'paper/addQue'
      let sessionId = sessionStorage.getItem('sessionId')
      let formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('pid', pid)
      formData.append('md5', que)
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        withCredentials: true
      }).then((response) => {
        if (response.data.msg === '登陆超时，请重新登陆') {
          this.$message.error('登录超时')
          this.signOut()
        }
        console.log(response.data)
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.deletePaper = function (x) {
      let url = this.$store.state.urls.url + 'paper/deletePaper'
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
        console.log(response)
        this.$store.state.paperList = response.data.data
      }, (response) => {
        this.$message.error('请求服务端失败')
      })
    }
    Vue.prototype.signOut = function () {
      let url = this.$store.state.urls.url + 'user/logout'
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
  }
}
