<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
         <el-table
          class="table my-position"
          :header-cell-style="{color: '#409eff'}"
          :data="$store.state.paperList">
          <el-table-column
            prop="id"
            label="ID"
            width="200">
          </el-table-column>
          <el-table-column
            prop="title"
            label="title"
            width="200">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="getPapert(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deletePapert(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-delete my-position"><el-button size="small" type="primary" @click="newPaper()">创建新的试卷</el-button></div>
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
        minHeight: 0
      }
    },
    components: {
      myHead,
      myFoot,
      mySpace
    },
    methods: {
      newPaper () {
        this.$prompt('请输入试卷名字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '不能为空',
          inputValue: this.examName
        }).then(({ value }) => {
          this.createPaper(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      getPapert (row) {
        this.getPaper(row.id)
      },
      deletePapert (row) {
        this.deletePaper(row.id)
      }
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 151
      this.getPaperList()
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
