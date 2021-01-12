<template>
  <div class="c-page media-wrap mar-right" >
    <div class="wrap pc-wrap">
      <div class="main-content">
        <div class="search">
          <div class="search-box">
            <div class="label" >订单ID</div>
            <div class="input-wrap"><input v-model.trim="orderId" type="text" placeholder="请输入订单ID"></div>
          </div>
          <div class="search-box">
            <div class="label" >卖方（提现）</div>
            <div class="input-wrap"><input v-model.trim="sellName" type="text" placeholder="请输入申诉方昵称"></div>
          </div>
          <div class="search-box">
            <div class="label" >市商</div>
            <div class="input-wrap"><input v-model.trim="buyName" type="text" placeholder="请输入被申诉方昵称"></div>
          </div>
          <div class="search-box btns">
            <div @click="resetFields" class="btn black">清空</div>
            <div class="btn" @click="search">查询</div>
          </div>
        </div>
        <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
          <el-table
                  :data="list"
                  border
                  :highlight-current-row="true"
                  :index="indexF"
                  @row-click="itemDetail"
                  class="table-w-a"
                  style="width: 100%">
            <el-table-column
                    prop="id"
                    label="订单ID">
            </el-table-column>
            <el-table-column
                    prop="sellName"
                    label="卖方">
            </el-table-column>
            <el-table-column
                    label="卖方金额">
              <template slot-scope="scope"><span  class="sell-a">{{scope.row.total}} {{scope.row.currency}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="rate"
                    label="单价">
            </el-table-column>
            <el-table-column
                    label="实际收款金额">
              <template slot-scope="scope"><span  class="sell-a">{{scope.row.transferAmount}} {{scope.row.currency}}</span></template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    label="市商">
              <template slot-scope="scope">{{typeFn(scope.row.type, scope.row.buyName, scope.row.sellName)}}</template>
            </el-table-column>
            <el-table-column
                    label="状态">
              <template slot-scope="scope" ><span class="status-a">{{statusFn(scope.row.status)}}</span></template>
            </el-table-column>
          </el-table>
        </list-wrap>
        <div style="z-index: 9999" class="web-loading1" v-show="loadingShow2">
          <img src="~@img/loading2.gif" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				orderId: '',
				sellName: '',
				buyName: '',
				imgFlag: false,
				errA: '',
				auditDesc: '',
				vipText: '',
				vipId: '',
				btnShow: false,
				newStatusEnum: [],
				vipStatusEnum: [],
				userStatusText: '',
				userStatus: '',
				newBusinessTypeText: '',
				newBusinessType: '',
				newUsername: '',
				newId: '',
				newAddress: '',
				newEmail: '',
				newPhone: '',
				newName: '',
				newIdCard: '',
				newhomeAddress: '',
				imgData: [],
				imgData2: [],

				dialogType: 'alert',
				dialogTitle: '市商审核',
				okText: '保存',
				sShow: false,
				noDataShow: false,
				loadingMobile: false,
				loadingShow2: false,
				fheight: 42,
				searchShow: false,
				listMob: [],
				indexF: '',
				isShow: false,
				loading2: false,
				sellBankAccount: {},
				bigImg: '',
				bigImgShow: false,
				activeIndex: -1,
				detailObj: {},
				replyimg: [],
				contentimg: [],
				itemActiveShow: false,
				switchValue: false,
				loadingShow: false,
				dialogShow: false,
				detaildialogShow: false,
				id: '',
				userName: '',
				replyName: '',
				statusId: '',  //申诉来源
				contentType: '', // 申诉类型
				problemStatus: '', // 等级
				list: [],
				languageList:[],
				total: 0,
				pageIndex: 1,
				pageSize: 10,
				loadShow: false,
				itemShow: false,
				refStateText: '',
				refStateId: '',
				roundRewardText: '',
				userTypeText: '',
				unfoldActive: 0,
				levelEnum: [],
				statusEnum: [],
				sendMessage: '',
				typeEnum: [],
				tradingData: {},
				listTotal: 0,
				msgArr: [],
				dataId: '',
				detailsObj: {},
			}
		},
		created () {
			if (window.innerWidth < 1200) {
				this.getData()
			}
		},
		watch: {
		},
		methods: {
			// 市商类型
			typeFn (type, buy, sell) { //  1卖方市商 2买方市商
				if (type === 1) return sell
				if (type === 2) return buy
			},
			itemDetail (item) {
        this.$router.push({
          path: '/business/orderAudit/orderAuditDetails',
          query: {data: JSON.stringify(item)}
        })
      },
			cancelFn () {
				this.newUsername = ''
				this.newId = ''
				this.newAddress = ''
				this.newEmail = ''
				this.newPhone = ''
				this.newName = ''
				this.newIdCard = ''
				this.newhomeAddress = ''
				this.imgData = []
				this.imgData2 = []
				this.userStatusText = ''
				this.userStatus = ''
				this.newBusinessTypeText = ''
				this.newBusinessType = ''
      },
			//   0新创建 1选择收款方式 2已打款 3完成 4取消 5仲裁中  6仲裁完成 7支付待确认 8 申请取消提现订单 9 提现待审核
			statusFn (type) {
				if (type === 0) return '新创建'
				if (type === 1) return '选择收款方式'
				if (type === 2) return '已打款'
				if (type === 3) return '完成'
				if (type === 4) return '取消'
				if (type === 5) return '仲裁中'
				if (type === 6) return '仲裁完成'
				if (type === 7) return '支付待确认'
				if (type === 8) return '申请取消提现订单'
				if (type === 9) return '待审核'
			},
			showSwitch () {
				this.searchShow = !this.searchShow
			},
			resetFields () {
				this.orderId = ''
				this.sellName = ''
	      this.buyName = ''
			},
			search () {
				this.total = 1
				this.getData(this.pageIndex,10)
			},
			getData (pageIndex,pageSize) {
				this.noDataShow = false
				this.loadShow = true
				this.loadingShow2 = true
				this.$fetch.post(`/trade/tradeOrder/queryTradeOrderList`,{
					status: 9,
					id: this.orderId,
					sellName: this.sellName,
					buyName: this.buyName,
					pageIndex: pageIndex || this.pageIndex,
					pageSize: pageSize || this.pageSize,
				}).then(res => {
					this.loadShow = false
					this.loadingShow2 = false
					this.loadingMobile = false
					if (res.code === 0) {
						this.listTotal = res.data.page.list.length
						if (this.pageIndex === 1 && this.listTotal === 0) {
							this.noDataShow = true
						}
						this.list = res.data.page.list
						this.total = res.data.page.totalCount
					}
				})
			},
		},
		components: {

    },
		computed: {
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .__vuescroll{
    .__view{
      padding: 0 0 40px !important;
    }
     .__rail-is-vertical{
       right: -1px !important;
     }
  }
  .err-a{
    position: relative
    .err-t{
      position: absolute
      top: 100%
      left: 0
      margin-top: 10px
      color #f00
    }
  }
  .search-order2
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
  .table-w-a
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
      cursor pointer
    >>> td:nth-child(1),>>> th:nth-child(1)
      padding-left: 30px
    .status-a
      color #f00
    .sell-a
      color #1962df
  .main-content
    width 100%;
    background-color #fff;
    padding 0 40px 0 24px;
    min-height calc(100vh - 147px);
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content flex-start
    border-bottom 0
    .search-box
      width 318px
      height 34px
      line-height 34px
      margin: 4px 0 15px;
      display flex
      align-items center
      &:nth-child(7)
        .label
          width 100px
        .input-wrap
          flex 1
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
        border: 1px solid #efefef;
        border-radius: 0;
        padding: 0 10px;
        font-size 14px
        min-width: 130px !important;
        width: 200px !important;
        height: 34px !important;
        line-height: 34px !important;
        >>> .el-dropdown
          width 100%
          height 100%
          color #000
          span
            width 100%
            display flex
            align-items center
            justify-content space-between
    .btns
      justify-content flex-start
      .btn
        cursor pointer
      .lang-btn
        width 120px
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
  .web-loading1{
    width: 100px
    height: 100px
    img{
      width: 100px
      max-height: 100px
      max-width: 100px
    }
  }
  .table-w-a{
    >>> tr td:nth-child(1) .cell, >>> tr th:nth-child(1) .cell {
      padding: 0
    }
  }
  .no-s{
    color #ff0000
    text-align: left
  }
  input{
    color #000
    font-size: 14px
  }
  .dialog-t{
    &.video-dialog{
      .video-box{
        max-height 500px
        max-width 800px
        display: flex
        align-items center
        justify-content center
        margin-top: 60px
      }
      video{
        max-height 500px
        max-width 800px
      }
    }
    .line{
      width: 100%
      border-top: 1px solid #e8e8e8
      position: relative
      margin: 30px 0
      .border{
        position: absolute
        left: 0
        top: -1px
        width: 20px
        border-top: 3px solid #1962df
      }
    }
    .input-m{
      display: flex
      justify-content space-between
      flex-wrap wrap
      &.input-m-one{
        margin-top: 15px
      }
      .search-box{
        display: flex
        align-items center
        margin-right: 30px
        &:nth-child(3n){
          margin-right: 0
        }
      }
      .input-wrap{
        margin-left: 10px
        input{
          width: 200px
          color #000
        }
      }
      .dropdown-wrap{
        width: 200px
        min-width: 200px !important;
        padding: 0 10px
        border: 1px solid #e8e8e8
      }
    }
    .address-input{
      align-items center
      &.a-b{
        margin-bottom: 60px
      }
      .input-wrap{
        flex 1
        width auto
        margin-left: 10px
        input{
          width: 100%
        }
      }
    }
    .ul-img{
      margin-bottom: 40px
      .list-img{
        display: flex
        align-items center
        .img-box{
          width: 180px
          height: 135px
          display: flex
          align-items center
          justify-content center
          cursor pointer
          margin-right: 27px
          &:last-child{
            margin-right: 0
          }
          &.img-a{
            background: url("../../assets/img/loading.gif") no-repeat center
            background-size: 30px
          }
          &.video-box{
            position: relative

            .bg{
              width: 100%
              height: 100%
              background-color: rgba(0,0,0,.4)
              position: absolute
              &::before{
                position: absolute
                left: 50%
                top: 50%
                transform translate(-50%,-50%)
                z-index: 10
                content ''
                display: block
                width: 40px
                height: 40px
                background: url("../../assets/img/play.svg") no-repeat center / cover
              }
            }
          }
          .bg-a{
            width: 100%
            height: 100%
            background-repeat:no-repeat
            background-size: cover
            background-position: center
            img{
              opacity: 0
            }
          }
          img, video{
            max-width 100%
            max-height 100%
          }
        }
      }
    }
  }
</style>
