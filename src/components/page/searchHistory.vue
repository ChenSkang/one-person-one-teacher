<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <el-dialog :visible.sync="imgVisible" width="60%" title="搜索图片">
      <img style="max-height: 55vh; margin-left: 50%; transform: translateX(-50%)" :src="searchImage">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgain(searchMd5)">重新搜索</el-button>
      </span>
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
              <el-button size="small" @click="showExams(scope.row)">查看</el-button>
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
        searchImage: '',
        searchMd5: ''
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
        this.searchMd5 = row.queMD5
        this.searchImage = row.image
        this.imgVisible = true
      },
      searchAgain (md5) {
        let url = this.$store.state.urls.local + 'GetPaperQueServlet'
        let formData = new FormData()
        formData.append('md5', md5)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
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
