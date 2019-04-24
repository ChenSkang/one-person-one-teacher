<template>
  <div>
    <myHead></myHead>
    <mySpace></mySpace>
    <div>
      <div class="main" :style="{minHeight: minHeight + 'px'}">
        <div class="table-delete" @click="newPaper()">
          <img src="../../img/newpaper.png" alt="">
          <div class="table-title">创建试卷</div>
        </div>
        <div class="papers" v-if="$store.state.paperList.length">
          <div class="papers-col" v-for="(value,index) in $store.state.paperList">
            <div class="file"  @click="getPapert(value.id, value.title)">
              <img src="../../img/filess.png" alt="">
            </div>
            <div class="paper-title"  @click="getPapert(value.id, value.title)">{{value.title}}</div>
            <div class="paper-foot">
              <div class="paper-foot-div"><div @click="getPapert(value.id, value.title)" class="paper-foot-btn">查看</div></div>
              <div class="paper-foot-div"><div @click="deletePapert(value.id)" class="paper-foot-btn">删除</div></div>
            </div>
          </div>
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
          inputValue: '初中测试卷'
        }).then(({ value }) => {
          this.createPaper(value)
        }).catch(() => {
        })
      },
      getPapert (pid, title) {
        this.getPaper(pid)
        this.$router.push({path: '/basket', query: { title: title, paperId: pid }})
      },
      deletePapert (val) {
        this.deletePaper(val)
      }
    },
    created () {
      this.minHeight = document.documentElement.clientHeight - 51
      this.getPaperList()
      document.title = '我的试卷'
    }
  }
</script>

<style scoped>
  .main{
    width: 100%;
    position: relative;
    top: 50px;
    background-color: #fbfbfb
  }
  .papers{
    width: 90%;
    margin-left: 10%;
  }
  .papers-col{
    position: relative;
    float: left;
    width: 14%;
    margin-right: 5%;
    margin-top: 15px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #fbfbfb;
  }
  .table-delete{
    position: absolute;
    left: 4%;
    top: 30px;
    cursor: pointer;
  }
  .table-title{
    font-size: 14px;
    color: #409EFF;
  }
  .file{
    width: 80%;
    height: 95px;
    margin: 20px 10% 80px 10%;
    border-radius: 3px;
  }
  .file img{
    width: 100%;
    height: 120px;
    position: absolute;
    left: 0;
    top:5px;
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
    border: 1px solid #C0C4CC;
  }
  .papers-col:hover .paper-foot{
    background-color: #2d8cf0;
  }
</style>
