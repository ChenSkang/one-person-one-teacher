<template>
  <div  v-loading.fullscreen.lock="loading" element-loading-spinner="el-icon-loading" element-loading-text="正在推荐中">
    <myHead></myHead>
    <mySpace></mySpace>
    <el-dialog :visible.sync="imgVisible" width="60%">
      <img style="max-height: 55vh; margin-left: 50%; transform: translateX(-50%)" :src="searchImage">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgain(searchMd5)">重新搜索</el-button>
      </span>
    </el-dialog>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
         <el-table
          class="table my-position"
          :header-cell-style="{color: '#409eff'}"
          :data="$store.state.history.searched"
          @row-dblclick="showExams">
          <el-table-column
            prop="time"
            label="搜索时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="que"
            label="搜索内容">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="showExams(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deleteHistory(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-delete my-position"><el-button size="small" type="primary" @click="clearSearched()">清空历史</el-button></div>
      </div>
    </div>
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
        searchMd5: '',
        loading: false,
        minHeight: 0
      }
    },
    components: {
      myHead,
      myFoot,
      mySpace
    },
    methods: {
      showExams (row) {
        this.searchMd5 = row.queMD5
        this.searchImage = row.image
        this.imgVisible = true
      },
      searchAgain (md5) {
        let url = this.$store.state.urls.local + 'SearchAgainServlet'
        this.imgVisible = false
        this.loading = true
        let formData = new FormData()
        formData.append('md5', md5)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$store.state.nowSub = []
          sessionStorage.setItem('defaultSrc', this.searchImage)
          this.$store.state.cropImg = this.searchImage
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
          this.loading = false
          this.$router.push('/index')
          this.$message.success('推荐成功')
        }, (response) => {
          this.loading = false
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
          this.$store.state.history.searched.splice(x, 1)
        }, (response) => {
          this.$message.error('请求服务端失败')
        })
      }
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 151
      if (this.$store.state.userNow) {
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
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
    top: 40px;
    margin-bottom: 60px;
  }
  .table{
    border: #409eff 3px solid;
    box-sizing: border-box;
    border-radius: 10px;
  }
  .table-delete{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
