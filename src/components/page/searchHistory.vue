<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <el-dialog :visible.sync="imgVisible" width="60%">
      <img style="max-height: 55vh; margin-left: 50%; transform: translateX(-50%)" :src="searchImage">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgain(searchQue, searchWay, searchKind)">重新搜索</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisibles" width="60%">
      <p v-html="searchQue"></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgain(searchQue, searchWay, searchKind)">重新搜索</el-button>
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
        imgVisibles: false,
        searchImage: '',
        searchQue: '',
        searchWay: '',
        searchKind: '',
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
        console.log(row)
        if (row.image) {
          this.searchQue = row.que
          this.searchWay = row.way
          this.searchKind = row.kind
          this.searchImage = row.image
          this.imgVisible = true
        } else {
          this.searchQue = row.que
          this.searchWay = row.way
          this.searchKind = row.kind
          this.imgVisibles = true
        }
      },
      searchAgain (que, way, kind) {
        let url = this.$store.state.urls.url + 'SearchAgainServlet'
        this.imgVisible = false
        this.imgVisibles = false
        this.$store.state.history.loading = true
        let formData = new FormData()
        formData.append('que', que)
        formData.append('way', way)
        formData.append('kind', kind)
        this.$axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          withCredentials: true
        }).then((response) => {
          this.$store.state.nowSub = []
          sessionStorage.setItem('defaultSrc', this.searchImage)
          this.$store.state.cropImg = this.searchImage
          sessionStorage.setItem('subj', JSON.stringify(response.data))
          this.$store.state.nowSub = JSON.parse(sessionStorage.subj)
          this.$store.state.history.loading = false
          this.$router.push('/index')
          this.$message.success('推荐成功')
        }, (response) => {
          this.$store.state.history.loading = false
          this.$message.error('请求服务端失败')
        })
      },
      clearSearched () {
        let url = this.$store.state.urls.url + 'CleanHistoryServlet'
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
        let url = this.$store.state.urls.url + 'RemoveHistoryServlet'
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
