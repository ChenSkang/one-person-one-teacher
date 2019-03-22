<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
        <div class="papers" v-if="$store.state.paperList.length">
          <div class="papers-col" v-for="(value,index) in $store.state.paperList">
            <div class="file">

            </div>
            <div class="paper-title">{{value.title}}</div>
            <div class="paper-foot">
              <div class="paper-foot-div"><div @click="getPapert(value.id, value.title)" class="paper-foot-btn">查看</div></div>
              <div class="paper-foot-div"><div @click="deletePapert(value.id)" class="paper-foot-btn">删除</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-delete"><el-button size="small" type="primary" @click="newPaper()">创建新的试卷</el-button></div>
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
      getPapert (pid, title) {
        this.$router.push({path: '/basket', query: { title: title, paperId: pid }})
      },
      deletePapert (val) {
        this.deletePaper(val)
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
    background-color: #fbfbfb
  }
  .papers{
    width: 90%;
    margin-left: 8%;
  }
  .papers-col{
    position: relative;
    float: left;
    width: 15%;
    margin-right: 4%;
    margin-top: 25px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #fbfbfb;
  }
  .table-delete{
  }
  .file{
    width: 80%;
    height: 100px;
    margin: 20px 10% 80px 10%;
    background-color: #fff;
    box-sizing: border-box;
    border: 1px solid #C0C4CC;
    border-radius: 3px;
  }
  .paper-title{
    width: 100%;
    position: absolute;
    bottom: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
  }
  .paper-foot{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background-color: #fbfbfb;
    display: flex;
    flex-direction: row;
  }
  .paper-foot-div{
    width: 50%;
    margin: 5px auto;
  }
  .paper-foot-btn{
    width: 50px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #fbfbfb;
    border: 1px solid #fbfbfb;
    border-radius: 3px;
    margin: 0 auto;
  }
  .papers-col:hover{
    border: 1px solid #2d8cf0;
  }
  .papers-col:hover .paper-foot{
    background-color: #2d8cf0;
  }
</style>
