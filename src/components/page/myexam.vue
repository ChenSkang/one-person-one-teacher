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
            <li v-for="(value,index) in exams" :key="index">
              <div>
                <div @click="showExam(index)">{{exams[index].time}}</div>
                <span @click="deleteExam(index)">删除</span>
                <div>{{exams[index].title}}</div>
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
  import bus from '../../bus'
  export default {
    data () {
      return {
        exams: []
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
        formData.append('paperId', this.exams[x].id)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response.data)
          let arr = response.data
          bus.$emit('exams', arr)
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
        formData.append('paperId', this.exams[x].id)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response.data)
          this.exams.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
      if (sessionStorage.getItem('sessionId')) {
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
          console.log(response.data)
          for (let i = 0; i < response.data.length; i++) {
            this.exams.push({time: response.data[i].time, title: response.data[i].title, id: response.data[i].id})
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
