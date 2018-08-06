<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <el-dialog :visible.sync="imgVisible" width="96%">
      <img width="100%" :src="searchImage">
    </el-dialog>
    <el-container>
      <el-main class="main">
        <el-button size="small" type="primary" @click="clearSearched()">清空历史</el-button>
        <el-table
          :data="$store.state.history.searched"
          class="table"
          @row-dblclick="showExams">
          <el-table-column
            prop="time"
            label="搜索时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="id"
            label="搜索内容">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button size="small">查看</el-button>
              <el-button size="small" type="danger" @click="deleteHistory(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
        imgVisible: false,
        searchImage: ''
      }
    },
    components: {
      myHead,
      myFoot,
      mySpace
    },
    methods: {
      showExams (row) {
        console.log(row)
        this.searchImage = row.image
        this.imgVisible = true
      },
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
      clearSearched () {
        let url = this.$store.state.urls.local + 'CleanHistoryServlet'
        let sessionId = sessionStorage.getItem('sessionId')
        let formData = new FormData()
        formData.append('sessionId', sessionId)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.history.searched = []
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      },
      deleteHistory (x) {
        let url = this.$store.state.urls.local + 'RemoveHistoryServlet'
        let formData = new FormData()
        formData.append('id', this.$store.state.history.searched[x].id)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$store.state.history.searched.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
      if (this.$store.state.history.find) {
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
          this.$store.state.history.searched = response.data
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    }
  }
</script>

<style scoped>
  .main{
    background-color: #F2F6FC;
  }
  .table{
    position: relative;
    left: 10%;
    width: 80%;
    border: #DCDFE6 1px solid;
  }
</style>
