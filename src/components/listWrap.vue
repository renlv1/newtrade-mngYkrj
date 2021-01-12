<template>
  <div class="load-list-wrap">
    <slot></slot>
<!--    <div v-if="!list.length" class="empty">-->
<!--      <img src="@img/empty.png" alt>-->
<!--      <p>暂无数据</p>-->
<!--    </div>-->
    <div class="el-pagination-wrap" v-if="list.length">
      <el-pagination
        layout="prev, pager, next, sizes, total, jumper"
        @current-change="emit"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :current-page.sync="pageIndex"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
export default {
  data () {
    return {
      path: this.$route.path,
      pageIndex: 1
    }
  },
  props: {
    list: Array,
    total: Number,
    pageSize: {
      type: Number,
      default: 10
    },
  },
  methods: {
    resetPageIndex () {
      this.pageIndex = 1
    },
    handleSizeChange (pageSize) {
      this.$emit('change', 1, pageSize)
      this.resetPageIndex()
    },
    emit(index) {
      this.$emit('change', index)
    }
  },
  mounted () {
     /*this.$emit('change', 1)
    //如果有历史记录的路由等于当前的路由就使用历史数据
    const history = this.$store.state.historyRecord
    if (history.path === this.$route.path) {
      this.$parent.list = history.list
      this.$parent.pageIndex = history.pageIndex
      this.$parent.total = history.total
      this.pageIndex = history.pageIndex
    } else {
      // 否则重新加载
      this.$emit('change', 1)
    }*/
  },
  beforeDestroy () {
     /*this.$store.commit('SET_LIST_RECORD', {
       path: this.path,
       list: this.list,
       total: this.total,
       y: document.scrollingElement.scrollTop,
       pageIndex: this.pageIndex
     })*/
  }
}
</script>

<style lang="less" scoped>
  .load-list-wrap{
    position: relative;
    min-height: 300px;
  }
  .el-pagination-wrap{
    /deep/ .el-select__caret{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /deep/ .el-pagination{
      .el-pager{
        margin-left: 10px;
        .number{
          margin-right: 10px;
          background-color: #F8F8FA !important;
          color: #474747;
          &.active{
            color: #fff;
            background-color: #2176ff !important;
          }
        }
      }
      .btn-prev, .btn-next{
        padding: 0 6px !important;
        background-color: #F8F8FA !important;
      }
      .el-pagination__sizes{
        margin-left: 20px;
      }
    }
  }
  .web-loading{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
    background-color: #fff;
  }
</style>
