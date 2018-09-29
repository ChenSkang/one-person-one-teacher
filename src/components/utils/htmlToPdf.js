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
      if (sessionStorage.getItem('sessionId') || this.$route.path !== '/searched') {
        let url = this.$store.state.urls.local + 'GetHistoryServlet'
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
          this.$router.push('/searched')
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
      if (sessionStorage.getItem('sessionId') && this.$route.path !== '/myexam') {
        let url = this.$store.state.urls.local + 'GetPaperServlet'
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
          this.$router.push('/myexam')
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
      if (sessionStorage.getItem('sessionId') && this.$route.path !== '/basket') {
        this.$store.state.history.loading = true
        let url = this.$store.state.urls.local + 'GetBasketServlet'
        let userId = sessionStorage.getItem('userId')
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('userId', userId)
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
          this.$router.push('/basket')
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
      this.$store.state.history.loading = true
      const way = this.$store.state.value ? this.$store.state.value + 1 : 1
      const kind = this.$store.state.select + '题'
      let formData = new FormData()
      formData.append('word', msg)
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
        this.$message.success('推荐成功')
        sessionStorage.setItem('subj', JSON.stringify(response.data))
        console.log(response.data)
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        if (way === 1) {
          sessionStorage.setItem('title_number', 'true')
        } else {
          sessionStorage.setItem('title_number', 'false')
        }
        if (this.$route.path !== '/index') {
          this.$router.push('/index')
        }
      }, (response) => {
        this.$store.state.history.loading = false
        this.$alert('请检查文本内容并确认网络是否正常', '未知错误', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: '未知错误'
            })
          }
        })
      })
    }
    // 重新推题
    Vue.prototype.againSearch = function (msg) {
      this.$store.state.history.loading = true
      const way = 1
      const kind = '全部题'
      let formData = new FormData()
      formData.append('word', msg)
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
        this.$message.success('推荐成功')
        sessionStorage.setItem('subj', JSON.stringify(response.data))
        console.log(response.data)
        this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        sessionStorage.setItem('title_number', 'true')
        if (this.$route.path !== '/index') {
          this.$router.push('/index')
        }
      }, (response) => {
        this.$store.state.history.loading = false
        this.$alert('请检查文本内容并确认网络是否正常', '未知错误', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: '未知错误'
            })
          }
        })
      })
    }
  }
}
