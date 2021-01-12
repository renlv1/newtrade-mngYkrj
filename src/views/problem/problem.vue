<template>
  <div class="c-page media-wrap mar-right">
    <div class="wrap">
      <div class="main-content">
        <div class="search">
          <div class="search-box">
            <div class="label">用户名</div>
            <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange1" @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{refStateText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in userSourceArr" :key="index">
                    {{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">问题内容</div>
            <div class="input-wrap"><input v-model.trim="contentSearch" type="text" placeholder="输入问题内容"></div>
          </div>
          <div class="search-box btns">
            <div class="btn black" @click="resetFields">清空</div>
            <div class="btn" @click="search">查询</div>
            <div class="btn" @click="batchFn">批量回复</div>
            <div class="btn" @click="infoOne">查看详情</div>
          </div>
        </div>
        <el-table
                :data="list"
                border
                class="table-w-a"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                @row-click="tabFn"
                style="width: 100%">
          <el-table-column
                  type="selection">
          </el-table-column>
          <el-table-column
                  prop="id"
                  width="50"
                  label="ID">
          </el-table-column>
          <el-table-column
                  width="300"
                  prop="content"
                  label="反馈内容">
          </el-table-column>

          <el-table-column
                  prop="userName"
                  label="昵称">
          </el-table-column>
          <el-table-column
                  label="状态">
            <template slot-scope="scope"><div :class="{'no-read':scope.row.isRead === 0}">{{userTypeFn(scope.row.isRead)}}</div></template>
          </el-table-column>
          <el-table-column
                  label="反馈类型">
            <template slot-scope="scope">{{statusFn(scope.row.isAuthor)}}</template>
          </el-table-column>
          <el-table-column
                  prop="createAtStr"
                  label="发布时间">
          </el-table-column>
          <el-table-column
                  prop="updateAtStr"
                  label="更新时间">
          </el-table-column>
        </el-table>
        <div style="z-index: 9999" class="web-loading1" v-show="loadingShow">
          <img src="~@img/loading2.gif" />
        </div>
        <div class="total-a">共计：{{total}}条数据</div>
        <table-pagination
                :list="list"
                :total="total"
                :pageSize="pageSize"
                @change="getData"
        ></table-pagination>
      </div>
    </div>
    <div class="mob-wrap">
      <div class="top-a"></div>
      <div class="search-box" @click="change4">
        <div class="label">问题状态</div>
        <div class="input-wrap dropdown-wrap">
          <span class="el-dropdown-link">
            {{refStateText || '待处理'}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        </div>
      </div>
      <div class="scroll-list-wrap">
        <div style="z-index: 9999" class="web-loading1" v-show="loadingShow">
          <img src="~@img/loading2.gif" />
        </div>
        <cube-scroll
                ref="scroll"
                :options="options"
                :data="list"
                @pulling-up="onPullingDown">
          <div class="item-li" v-for="(item, index) in list" :key="index" @click="gotoDetails(item)">
            <div class="li">
              <div class="order-id">{{item.userName}}</div>
              <div class="state" :class="{'no-read':item.isRead === 0}">{{userTypeFn(item.isRead)}}</div>
            </div>
            <div class="li content-li">{{item.content}}</div>
            <div class="li time-li">{{item.createAtStr}}</div>
          </div>
        </cube-scroll>
      </div>
      <div class="search-order">
        <transition name="dialog">
          <div class="dialog"  @click="searchCancel"  v-if="searchShow" @touchmove.prevent=""></div>
        </transition>
        <transition name="fade-up">
          <div class="dialog-w" @click="searchCancel"  v-if="searchShow">
            <div class="search-main" @click.stop>
              <div class="search-input" v-for="(item, index) in userSourceArr" :key="index" @click="searchOne(item)">{{item.text}}</div>
            </div>
            <div class="btn-ok" @click="searchCancel">取消</div>
          </div>
        </transition>
      </div>
    </div>
    <problem-dialog :tabId="tabId" ref="dialog" @okDialog="okDialog" :isShow="isShow" :idArr="idArr"></problem-dialog>
  </div>
</template>

<script>
	/*import Dialog from '@/components/dialog/dialog'*/
	import { Message } from 'element-ui'
	export default {
		data() {
			return {
				listTotal: [],
				searchShow: false,
				loadingShow: false,
				idArr: [],
				isShow: true,
				tabId: 0,
				contentSearch: '',
				authentId: '',
				authentText: '',
				businessId: '',
				businessText: '',
				businessArr: [
					{id: "selected", text: "全部"},
					{id: "1", text: "不是"},
					{id: "2", text: "是"},
					{id: "3", text: "审核中"},
				],
				registerDate: '',
				id: '',
				userName: '',
				userAddress: '',
				refName: '',
				refAddress: '',
				list: [],
				total: 0,
				pageIndex: 1,
				pageSize: 20,
				loadShow: false,
				itemShow: false,
				refStateText: '未处理',
				refStateId: 0,
				roundRewardText: '',
				roundRewardId: '',
				unfoldActive: 0,
				userSourceArr: [],
				statusArr: [],
				startDateStr: '',
				endDateStr: '',
				authenticationEnum: [],
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.endDateStr
						if (beginDateVal) {
							return time.getTime() > beginDateVal
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.startDateStr
						if (beginDateVal) {
							return time.getTime() < beginDateVal
						}
					}
				},
			}
		},
		created() {
			this.getType()
      if (window.innerWidth < 1200) {
	      this.total = 1
	      this.getData(1, 10)
      }
		},
		methods: {
			changeFn (flag) {
        if (flag === true && this.userSourceArr.length === 0) {
	        this.getType()
        }
      },
			searchOne (item) {
				this.pageSize = 10
				this.pageIndex = 1
				this.refStateText = item.text
				this.refStateId = item.id
				this.getData(1, 10)
				this.searchShow = false
      },
			searchCancel () {
				this.searchShow = false
      },
			onPullingDown () {
				this.pageSize = 10
				if (this.listTotal < 20) {
					this.$refs.scroll.forceUpdate(true, false)
        } else {
					this.getData(this.pageIndex, this.pageSize)
        }
			},
			gotoDetails (item) {
				this.$router.push({
					path: '/problem/details',
					query: {
						id: item.id
					}
				})
			},
			infoOne () {
				if (this.idArr.length === 1) {
					this.tabId = this.idArr[0]
					this.isShow = true
					this.$refs.dialog.show()
        } else 	if (this.idArr.length > 1) {
					Message.error('只能选择一条数据')
        } else {
					Message.error('请选择一条数据')
        }
      },
      // 批量回复
			batchFn () {
				if (this.idArr.length < 2) {
					Message.error('请选择两条或两条以上数据')
          return
        }
				this.isShow = false // 批量操作
				this.$refs.dialog.show()
      },
			okDialog () {
				this.getData(1, this.pageSize)
      },
			handleSelectionChange (selection) {
        let idArr = []
        selection.forEach((item) => {
        	idArr.push(item.id)
        })
        this.idArr = idArr
      },
      tabFn (row, column, event) {
        this.isShow = true
        this.tabId = row.id
        this.$refs.dialog.show()
      },
			statusFn (item) {
				if (item > -1 && this.authenticationEnum.length > 0) {
					return this.authenticationEnum[item].text
				}
				return '-'
			},
			verifyFn (item) { //验证方式 1：未设置 2：谷歌验证 3：短信验证
				if (item === 1) return '未设置'
				if (item === 2) return '谷歌验证'
				if (item === 3) return '短信验证'
				return  '-'
			},
			userSourceFn (item) {
				if (item === 1) return '本地用户'
				return '-'
			},
      // 是否处理问题
			userTypeFn (item) {
				if (item > -1 && this.userSourceArr.length > 0) {
					return this.userSourceArr[item + 1].text
				}
				return '-'
			},
			resetFields() {
				this.userName = ''
				this.userAddress = ''
				this.refName = ''
				this.refAddress = ''
				this.refStateText = '未处理'
				this.roundRewardText = ''
				this.roundRewardId = ''
				this.refStateId = 0
				this.startDateStr = ''
				this.endDateStr = ''
        this.contentSearch = ''
        this.authentText = '全部'
				this.authentId = ''
			},
			unfold(index) {
				this.unfoldActive = index
				this.itemShow = !this.itemShow
				if (this.unfoldActive !== index && this.itemShow === false) {
					this.itemShow = true
				}
				if (this.unfoldActive === index && this.itemShow === false) {
					this.itemShow = true
				}
				if (this.unfoldActive === index + '2' && this.itemShow === true) {
					this.itemShow = false
				}
			},
			getType() {
				let url = '/public/enumValue?classPackage=system.Feedback$IsAuthorEnum;system.Feedback$IsReadEnum&flag=true&state=1'
				this.$fetch.post(`${url}`).then((res) => {
					if (res.code === 0) {
						this.statusArr = res.data.data.StatusEnum
						this.userSourceArr = res.data.data.IsReadEnum
						this.authenticationEnum = res.data.data.IsAuthorEnum
					}
				})
			},
			search() {
				this.total = 1
				this.getData(1, this.pageSize)
			},
			getData(pageIndex, pageSize) {
				this.loadShow = true
				let refStateId = this.refStateId > -1 ? this.refStateId : ''
				let authentId = this.authentId > -1 ? this.authentId : ''
				if (this.total !== 0) {
					this.loadingShow = true
					this.$fetch.post(`/system/feedBack/queryProblemFeedBack`, {
						contentSearch: this.contentSearch,
						userName: this.userName,
						isRead: refStateId, // 状态
						isAuthor: authentId, // 反馈类型
						pageIndex: pageIndex || this.pageIndex,
						pageSize: pageSize || this.pageSize,
					}).then(res => {
						this.loadingShow = false
						this.loadShow = false
						if (res.code === 0) {
							this.listTotal = res.data.page.list
							let _list = res.data.page.list
							this.total = res.data.page.totalCount
							if (window.innerWidth < 1200) {
								if (_list) {
									if (this.pageIndex ===1 ) {
										this.list = _list
									} else {
										this.list.push(..._list) // BUG
									}
									this.pageIndex++
								} else {
									if (this.pageIndex === 1) {
										this.list = []
									}
								}
							} else {
								this.list = res.data.page.list
              }
							this.$refs.scroll.forceUpdate(true, false)
						}
					})
				}
			},
			commandChange1 (commend) {
				this.refStateText = commend.item.text
				this.refStateId = commend.item.id
			},
			change4 () {
				this.searchShow = true
      },
			commandChange2 (commend) {
				this.roundRewardText = commend.item.text
				this.roundRewardId = commend.item.id
			},
			commandChange3 (commend) {
				this.authentText = commend.item.text
				this.authentId = commend.item.id
			},
		},
		computed: {
			options () {
				return {
					pullUpLoad: true,
				}
			}
		},
		components: {
			tablePagination: require('@/components/tablePagination').default,
			problemDialog: require('./problemDialog').default,
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap
    @media screen and (min-width:1200px) {
      display: block
    }
    @media screen and (max-width:1200px) {
      display: none
    }
    .web-loading1
      width 100px
      img
        width: 100px
        max-height 100px
        max-width 100px
    .table-w-a
      >>> .el-table__row
        cursor pointer
      >>> .cell
        border none
        white-space nowrap
        overflow hidden !important
      >>> .el-table--border td
        border-right none
      >>> .has-gutter th
        padding: 20px 5px
        background-color: #f3f3f5
        color #000
      >>> .el-table__row td
        padding: 20px 5px
        border-right none
      >>> .has-gutter .el-table-column--selection .cell
        display: block !important
      .no-read
        color #ff0000
    .total-a
      font-size: 14px
      color #999
      margin-top: 30px
    .main-content
      width 100%;
      background-color #fff;
      padding 0 40px 0 24px;
      min-height calc(100vh - 147px);

      .web-table
        padding-top 0

        .item-list
          width 100%
          height 64px
          line-height 64px
          display flex
          align-items center
          justify-content flex-start

          &:nth-child(n+2)
            display block
            height auto
            line-height normal
            width 100%

            .flex-item
              width 100%
              height 64px
              line-height 64px
              display flex
              align-items center
              justify-content flex-start

            .on-the-details
              min-height 0
              opacity 0
              overflow hidden

              .info-box
                width 100%
                height 100%

                .item-flex-item
                  display flex
                  align-items center
                  flex-wrap wrap
                  justify-content flex-start
                  text-align center
                  padding 0 22px

                  .li
                    width auto
                    height auto
                    padding 14px 0
                    text-align left
                    flex none
                    margin-right 100px
                    @media screen and (max-width 1200px) {
                      margin-right 30px
                    }

                    &:nth-child(1)
                      padding-left 0

          &:nth-child(odd)
            background-color #F8F8FA

          .li
            flex 1
            line-height 15px
            width auto
            text-align center

          &:first-child
            background-color #edeff2;

          .unfold
            color #2176ff
            cursor pointer
            display flex
            align-items center
            justify-content center

            .icon
              display inline-block
              width 10px
              height 6px
              background url("~@img/unfold.png") no-repeat center
              background-size cover
              margin-left 6px
              transition all .2s linear

              &.active
                transform rotate(180deg)

          .item-table
            width 100%
            position relative

            .on-the-details
              position absolute
              width 100%
              height 80px
              left 0
              right 0
              bottom -80px

        .table-list
          height auto
          .empty-li
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:3;
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content flex-start
    border-bottom 0

    .search-box
      width auto !important
      height 34px
      line-height 34px
      margin: 4px 0 15px;
      display flex
      align-items center
      position: relative
      &.btns
        margin-left: 50px
      .el-date-editor
        width: 100% !important
        >>> .el-input__inner
          width: 100% !important
          margin-right: 0

      .label
        padding-right 16px
        font-size 14px

      .input-wrap
        flex 1
        height 34px
        margin-right 40px

        input
          width 100%
          height 100%
          margin-right 0
          border-radius 0

      .dropdown-wrap
        cursor pointer
        text-align center
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 0;
        padding: 0 10px;
        font-size 14px
        min-width: 130px !important;
        width: 200px !important;
        height: 34px !important;
        line-height: 34px !important;

        .el-dropdown
          width 100%
          height 100%

          span
            width 100%
            display flex
            align-items center
            justify-content space-between
    .search-box
      width auto
    .btns
      justify-content flex-start

      .btn
        cursor pointer
        background-color: #2176ff
        &.btn-lg
          width: 120px
  .mob-wrap
    width 100%
    height calc(100vh - 80px)
    overflow: hidden
    padding 0 20px
    display: none
    @media screen and (max-width:1200px){
      display: block
    }
  .search-box
    width 100%
    height 34px
    line-height 34px
    margin: 20px auto;
    display flex
    align-items center
    .el-dropdown-link
      height: 100%
      padding: 0 10px
    .label
      margin-right: 20px
      font-size 14px
    .input-wrap
      flex 1
      height 34px
      input
        width 100%
        height 100%
        margin-right 0
        border-radius 0
    .dropdown-wrap
      cursor pointer
      text-align center
      background-color #fff
      border: 1px solid #efefef;
      border-radius: 0;
      font-size 14px
      .el-dropdown
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        .el-dropdown-link
          height 34px
          line-height 34px
          padding 0 10px
          color #b3b3b3
        span
          width 100%
          display flex
          align-items center
          justify-content space-between
  .scroll-list-wrap
    width 100%
    >>> .cube-scroll-content
      transform scale(1),translateZ(0) !important
    .item-li
      padding 10px 0
      border-bottom 1px solid #efefef
      .no-read
        color #f00
      .li
        font-size 14px
        line-height 14px
        padding-bottom 10px
        &.time-li
          text-align: right
          color #999
          padding-bottom: 0
        &:nth-child(1)
          display flex
          align-items center
          justify-content space-between
      .content-li
        padding-bottom: 15px
        line-height: 1.5
  .scroll-list-wrap
    position: absolute;
    left: 0;
    right 0
    width: 100%;
    height: calc(100vh - 124px);
    overflow: hidden;
    padding 0 20px 80px 20px
    background: #fff;
    .web-loading1
      width 100px
      img
        width 100px
        max-width 100px
        max-height 100px
  .search-order
    .dialog
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: 1000
      background-color: rgba(0,0,0, .4)
      &.dialog-enter-active, &.dialog-leave-active
        transition: all .2s linear;
      &.dialog-enter, &.dialog-leave-to
        opacity: 0
      &.dialog-enter-to, &.dialog-leave
        opacity: 1
    .dialog-w
      position: fixed
      bottom: 0
      left: 0
      width: 100%
      padding: 0 20px 80px
      overflow: auto
      z-index: 1200
      transform translate3d(0,0,0)
      border-radius .6rem .6rem 0 0
      display: flex
      flex-direction column
      &.fade-up-enter-active, &.fade-up-leave-active
         transition: all .3s linear;
      &.fade-up-enter, &.fade-up-leave-to
        transform translate3d(0,100%,0)
      &.fade-up-enter-to, &.fade-up-leave
        transform translate3d(0,0,0)
    .search-main
      width 100%
      display block
      border-radius 6px
      background-color #fff
      .search-input
        width 100%
        height 50px
        line-height 50px
        color #000
        text-align center
        border-bottom: 1px solid #e7effc
        &:last-child
          border-bottom: none
        input
          display block
          width 100%
          height 100%
          padding 0 10px
          text-align: center
          color #000
          &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #000;
          }
          &::-moz-placeholder { /* Firefox 19+ */
            color: #000;
          }
          &:-ms-input-placeholder { /* IE 10+ */
            color: #000;
          }
          &:-moz-placeholder { /* Firefox 18- */
            color: #000;
          }
    .btn-ok
      height: 50px
      margin-top: 10px
      display: flex
      align-items center
      justify-content center
      color #999
      font-size: 16px
      border-radius 6px
      background-color: #fff
</style>

