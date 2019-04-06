<template>
  <div class="search" @click="showSearchLi = false">
    <div class="header-concern">
      <div style="width: 100%; position: relative" @click.stop="showSearchLi = true">
        <el-input v-model="$store.state.input_message"
                  @keyup.native.enter="searchMsg(0)"
                  @keyup.native="getEvent($event)"
                  @keydown.native.up="selectUp"
                  @keydown.native.down="selectDown"
                  placeholder="题干/知识点/试卷"></el-input>
        <div class="search-ul" v-if="showSearchLi">
          <ul>
            <li class="search-li"
                v-for="(value, index) in $store.state.myData"
                :class="{selectback: index == nowLi}"
                @mouseover="selectHover(index)"
                @click="selectClick(index)"
                :key="value">
              {{value}}
            </li>
          </ul>
        </div>
        <div style="position: absolute; right: 15px; top: 6px; cursor: pointer">
          <img src="../../img/phone.png" width="28px" />
        </div>
      </div>
      <div class="btn-primary search-btn" @click="searchMsg(0)">
        <i class="el-icon-search">搜题</i>
      </div>
      <div class="btn-primary search-page" @click="searchMsg(0)">
        <i class="el-icon-document">组卷</i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        nowLi: -1,
        showSearchLi: false
      }
    },
    methods: {
      getEvent (ev) {
        if (ev.keyCode === 38 || ev.keyCode === 40) {
          return
        }
        this.getWordList(this.$store.state.input_message)
        this.showSearchLi = true
      },
      selectUp () {
        this.nowLi --
        if (this.nowLi === -1) {
          this.nowLi = this.$store.state.myData.length - 1
        }
        this.$store.state.input_message = this.$store.state.myData[this.nowLi]
      },
      selectDown () {
        this.nowLi ++
        if (this.nowLi === this.$store.state.myData.length) {
          this.nowLi = 0
        }
        this.$store.state.input_message = this.$store.state.myData[this.nowLi]
      },
      selectHover (index) {
        this.nowLi = index
      },
      selectClick (index) {
        this.$store.state.input_message = this.$store.state.myData[index]
        this.searchMsg(1)
        this.$store.state.myData = []
      },
      searchMsg (m) {
        let num = Math.random() * 10000
        this.$router.push({path: '/index', query: {servlet: 'wordSearch', msg: this.$store.state.input_message, page: 1, kind: this.$route.query.kind, nianji: this.$route.query.nianji, jiaocai: this.$route.query.jiaocai, way: m, num: num}})
      }
    },
    created () {
    }
  }
</script>

<style scoped>
  .search{
    z-index: 990;
    position: fixed;
    width: 100%;
    height: 62px;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #DCDFE6;
    box-shadow:0 0 5px 0 #DCDFE6;
  }
  .header-concern {
    margin: 11px 7%;
    width: 80%;
    display: flex;
    flex-direction: row;
    position: relative;
  }
  .selectback {
    background-color: #eee !important;
    cursor: pointer
  }
  .search-ul{
    position: absolute;
    width: 100%;
    background-color: #fbfbfb;
    box-sizing: border-box;
  }
  .search-li{
    border: 1px solid #d4d4d4;
    border-top: none;
    border-bottom: none;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: 7px 10px;
    transition: all .3s;
  }
</style>
