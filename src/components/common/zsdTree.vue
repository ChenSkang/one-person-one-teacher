<template>
  <div id="zsd">
    <div class="arrow"><p>知<br/>识<br/>点</p></div>
    <div class="tree">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="zsdText">
      </el-input>
      <el-tree
        class="zsd-tree"
        :data="zsdTree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="zsdTree">
      </el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        zsdText: '',
        zsdTree: [{
          label: '数与式',
          children: [{
            label: '有理数'
          }, {
            label: '无理数与实数'
          }, {
            label: '代数式'
          }, {
            label: '整式'
          }, {
            label: '因式分解'
          }, {
            label: '分式'
          }, {
            label: '二次根式'
          }]
        }, {
          label: '方程与不等式',
          children: [{
            label: '一元一次方程'
          }, {
            label: '二元一次方程组'
          }, {
            label: '一元二次方程'
          }, {
            label: '分式方程'
          }, {
            label: '不等式与不等式组'
          }]
        }, {
          label: '函数',
          children: [{
            label: '平面直角坐标系'
          }, {
            label: '函数基础知识'
          }, {
            label: '一次函数'
          }, {
            label: '反比例函数'
          }, {
            label: '二次函数'
          }]
        }, {
          label: '图形的性质',
          children: [{
            label: '图形初步认识'
          }, {
            label: '相交线与平行线'
          }, {
            label: '三角形'
          }, {
            label: '四边形'
          }, {
            label: '圆'
          }, {
            label: '尺规作图'
          }, {
            label: '命题与证明'
          }]
        }, {
          label: '图形的变化'
        }, {
          label: '统计与概率'
        }, {
          label: '数学竞赛'
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick (data) {
        console.log(data)
        if (!data.children) {
          this.$store.state.value = 2
          this.$store.state.input_message = this.$store.state.input_message + data.label + '；'
        }
      }
    },
    watch: {
      zsdText (val) {
        this.$refs.zsdTree.filter(val)
      }
    }
  }
</script>

<style scoped>
  #zsd{
    width: 16%;
    min-width: 200px;
    height: 500px;
    max-height: 500px;
    position: fixed;
    left: 0;
    top: 100px;
    border: 1px solid;
    z-index: 999;
    background-color: #fff;
    overflow-x: visible;
  }
  .arrow{
    text-align: center;
    width: 40px;
    height: 100px;
    position: absolute;
    right: -40px;
    top: 200px;
    border: 1px solid;
    display: table;
    background-color: #fff;
  }
  .arrow p{
    display: table-cell;
    vertical-align: middle;
  }
  .tree{
    max-height: 500px;
    overflow-y: scroll;
  }
  .tree::-webkit-scrollbar {display:none}
</style>
