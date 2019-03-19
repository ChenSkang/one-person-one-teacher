<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <el-dialog :visible.sync="imgVisible" width="60%">
      <img style="max-height: 55vh; margin-left: 50%; transform: translateX(-50%)" :src="searchImage">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgainImg(searchQue, searchWay, searchKind)">重新搜索</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisibles" width="60%">
      <p v-html="searchQue"></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="searchAgainWord(searchQue, searchWay, searchKind)">重新搜索</el-button>
      </span>
    </el-dialog>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
         <el-table
           border
           class="table my-position"
           :header-cell-style="{color: '#333333', backgroundColor: '#fbfbfb'}"
           :data="searchArray"
           @row-dblclick="showExams">
          <el-table-column
            prop="create_time"
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
              <div class="btn-small cell-btn1" @click="showExams(scope.row)">查看</div>
              <div class="btn-small cell-btn2" @click="deleteHistory(scope.$index)">删除</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="delete-all" @click="clearSearched()">
          <div class="delete-title"><i class="el-icon-delete">全部清空</i></div>
        </div>
        <div class="pages">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="6"
            :current-page.sync="pageNow"
            :total="$store.state.history.searched.length">
          </el-pagination>
        </div>
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
        minHeight: 0,
        pageNow: 1
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
          this.searchImage = row.image
          this.imgVisible = true
        } else {
          this.searchQue = row.que
          this.imgVisibles = true
        }
      },
      searchAgainImg (que) {
        this.imgVisible = false
        this.imgVisibles = false
        this.$router.push({path: '/index', query: {servlet: 'wordSearch'}})
      },
      searchAgainWord (que, way, kind) {
        this.imgVisible = false
        this.imgVisibles = false
        let k = kind.slice(0, 2)
        let w = way - 1
        this.$store.state.select = k
        this.$store.state.value = w
        if (w === 2) {
          this.$store.state.zsdTreeTags = que.split('；')
        }
        this.$router.push({path: '/index', query: {servlet: 'wordSearch', kind: k, msg: que, way: w}})
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
    computed: {
      searchArray: function () {
        let arr = []
        arr = this.$store.state.history.searched.slice(this.pageNow * 6 - 6, this.pageNow * 6)
        return arr
      }
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 161
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
    background-color: #fbfbfb;
  }
  .table{
    border: #dcdfe6 1px solid;
    box-sizing: border-box;
    border-radius: 10px;
  }
  .delete-all{
    position: relative;
    top: 50px;
    letter-spacing: 1px;
    width: 66%;
    margin: 0 auto;
    height: 40px;
  }
  .delete-title{
    position: absolute;
    right: 0;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    color: #303133;
    padding: 0 5px;
  }
  .delete-title:hover{
    color: #f56c6c;
    box-sizing: border-box;
    border-bottom: 1px solid #f56c6c;
  }
  .cell-btn1{
    display: inline;
    border: 1px #409EFF solid;
    padding: 0 13px;
    color: #409EFF;
  }
  .cell-btn2{
    display: inline;
    border: 1px #f56c6c solid;
    padding: 0 13px;
    color: #f56c6c;
  }
  .pages{
    width: 800px;
    text-align: center;
    margin: 50px auto;
  }
</style>
