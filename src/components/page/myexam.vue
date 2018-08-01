<template>
<div>
  <myHead></myHead>
  <el-container>
    <el-header height="20vh">
      <mySpace></mySpace>
    </el-header>
    <el-main class="main">
      <el-row class="concern">
        <div class="exam">
          <ul>
            <li v-for="(value,index) in $store.state.history.exam" :key="index">
              <div>
                <div @click="showExam(index)">{{$store.state.history.exam[index].time}}</div>
                <span @click="deleteExam(index)">删除</span>
                <div>{{$store.state.history.exam[index].title}}</div>
              </div>
            </li>
          </ul>
        </div>
      </el-row>
    </el-main>
  </el-container>
  <myFoot></myFoot>
</div>
</template>

<script>
  import myHead from '../common/header.vue'
  import myFoot from '../common/footer.vue'
  import mySpace from '../common/mySpace.vue'
  export default {
    data () {
      return {
      }
    },
    components: {
      myHead,
      myFoot,
      mySpace
    },
    methods: {
      showExam (x) {
        let url = this.$store.state.urls.local + 'GetPaperQueServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('paperId', this.$store.state.history.exam[x].id)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          sessionStorage.setItem('paper', this.$store.state.history.exam[x].id)
          this.$store.state.history.paper = false
          this.$store.state.history.XZ = []
          this.$store.state.history.TK = []
          this.$store.state.history.JD = []
          for (let i = 0; i < response.data.length; i++) {
            switch (response.data[i].kind) {
              case '选择题':
                this.$store.state.history.XZ.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              case '填空题':
                this.$store.state.history.TK.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              case '解答题':
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique})
                break
              default:
                this.$store.state.history.JD.push({que: response.data[i].que, unique: response.data[i].unique})
            }
          }
          this.$router.push('/history')
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      deleteExam (x) {
        let url = this.$store.state.urls.local + 'DeletePaperServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        formData.append('paperId', this.$store.state.history.exam[x].id)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response.data)
          this.$store.state.history.exam.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
      if (this.$store.state.history.myexam) {
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
          this.$store.state.history.exam = []
          for (let i = 0; i < response.data.length; i++) {
            this.$store.state.history.exam.push({time: response.data[i].time, title: response.data[i].title, id: response.data[i].id})
          }
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    }
  }
</script>

<style scoped>

</style>
