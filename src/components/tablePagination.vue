<template>
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
</template>

<script type="text/ecmascript-6">
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
