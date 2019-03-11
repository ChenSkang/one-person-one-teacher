<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
        <div class="papers" v-if="$store.state.paperList.length">
          <div class="papers-row" v-for="i in $store.state.paperList.length">

              {{$store.state.paperList[i - 1].title}}
          </div>
        </div>
        <div class="table-delete"><el-button size="small" type="primary" @click="newPaper()">创建新的试卷</el-button></div>
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
      this.minHeight = document.documentElement.clientHeight - 161
      this.getPaperList()
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
    top: 50px;
    margin-bottom: 60px;
  }
  .table-delete{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
