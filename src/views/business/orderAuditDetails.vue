<template>
  <div class="c-page order-details-w">
    <div class="top-w">
      <div class="left-a">卖方： <span class="name-a">{{resultData.sellName}}({{resultData.sellSystemCode}})</span></div>
      <div class="btn-w">
        <div class="btn-item" @click="ctrlFn(1)">通过</div>
        <div class="btn-item" @click="ctrlFn(2)">拒绝</div>
      </div>
    </div>
    <div class="money-w">
      <div class="money-item">
        <div class="money-a">{{totalData.buyTransferAmount}}</div>
        <div class="money-text">购买订单线下付款总金额（CNY）</div>
      </div>
      <div class="money-item">
        <div class="money-a">{{totalData.sellTransferAmount}}</div>
        <div class="money-text">出售订单线下收款总金额（CNY）</div>
      </div>
    </div>
    <div class="money-w">
      <div class="money-item">
        <div class="money-a">{{totalData.buyTotalSum}}</div>
        <div class="money-text">购买总数量</div>
      </div>
      <div class="money-item">
        <div class="money-a">{{totalData.sellTotalSum}}</div>
        <div class="money-text">出售总数量</div>
      </div>
      <div class="money-item">
        <div class="money-a">{{totalData.cnyBalance}}</div>
        <div class="money-text">当前账户余额（CNY）</div>
      </div>
    </div>
    <div class="order-wrap">
      <div class="text-a">当前出售订单：{{resultData.id}}</div>
      <div class="order-a">
        <span class="item-order">订单金额：<span class="number-a">{{resultData.transferAmount}} {{resultData.currency}}</span></span>
        <span class="item-order">订单数量：<span class="number-a">{{resultData.total}}</span></span>
        <span class="item-order">订单单价：<span class="number-a">{{resultData.rate}} {{resultData.currency}}</span></span>
      </div>
      <div class="bank-info" v-if="sellBankAccount">银行信息：{{sellBankAccount.bankName}} / {{sellBankAccount.realName}} / {{sellBankAccount.bankNumber}}</div>
    </div>
    <div class="table-m">买卖交易记录</div>
    <ul class="uls-b">
      <li v-for="(item, index) in tabArr" :key="index" class="list-item"
          @click="checkOne(index)"
          :class="{'active-list': activeIndex === index}">{{item}}</li>
    </ul>
    <div class="a-t-m">
      <list-wrap :list="list" :total="total" @change="getData" :pageSize="pageSize" ref="listWrap">
        <el-table
                :data="list"
                border
                :highlight-current-row="true"
                class="table-w-a"
                style="width: 100%">
          <el-table-column
                  prop="id"
                  label="订单编号">
          </el-table-column>
          <el-table-column
                  label="交易类型">
            <template slot-scope="scope">{{stateFn(scope.row.type, scope.row.sellSystemCode, scope.row.buySystemCode)}}</template>
          </el-table-column>
          <el-table-column
                  prop="total"
                  label="交易数量">
          </el-table-column>
          <el-table-column
                  prop="rate"
                  label="交易单价">
            <template slot-scope="scope">{{scope.row.rate}}</template>
          </el-table-column>
          <el-table-column
                  prop="transferAmount"
                  label="交易金额">
            <template slot-scope="scope">{{scope.row.transferAmount}} {{scope.row.currency}}</template>
          </el-table-column>
          <el-table-column
                  width="180"
                  prop="createTime"
                  label="创建时间">
          </el-table-column>
          <el-table-column
                  width="150"
                  label="市商">
            <template slot-scope="scope">{{typeFn(scope.row.type, scope.row.buyName, scope.row.sellName)}}</template>
          </el-table-column>
          <el-table-column
                  width="120"
                  label="状态">
            <template slot-scope="scope"><div :class="{'red': scope.row.status === 9}">{{statusFn(scope.row.status)}}</div></template>
          </el-table-column>
        </el-table>
      </list-wrap>
      <div class="loading-w" v-show="loadingShow">
        <img src="@img/loading2.gif" alt="">
      </div>
    </div>


  </div>
</template>

<script>
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				loadingShow: true,
				activeIndex: 0,
				tabArr: ['全部', '买入', '卖出'],
				sellBankAccount: {},
				list: [],
				resultData: {},
				totalData: {},
				total: 0,
				pageSize: 10,
        dataObj: JSON.parse(this.$route.query.data)
      }
		},
    created () {
			this.getDetails()
      this.getData()
    },
    methods: {
	    checkOne (index) {
	    	this.activeIndex = index
        this.getData()
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
			// 市商类型 1卖方市商 2买方市商
	    stateFn (type,sell, buy ) {
	    	if (type === 1) {
          if (sell === this.resultData.sellSystemCode) {
          	return '卖出'
          } else {
	          return '买入'
          }
        }
		    if (type === 2) {
			    if (buy === this.resultData.sellSystemCode) {
				    return '买入'
			    } else {
				    return '卖出'
			    }
		    }
      },
      // 1审核成功 2审核失败
	    ctrlFn (index) {
	    	let dialogText = ''
	    	if (index === 1) {
			    dialogText = '确认通过'
        } else {
			    dialogText = '确认拒绝'
        }
        Dialog({
          title: '提示',
          content: dialogText,
          okFn: ()=>{
	          this.$store.commit('SET_LOADING', true)
            this.$fetch.post(`/trade/tradeOrder/auditTradeOrder`,{
              id: this.dataObj.id, //	Long	实体对象id
              choose: index, //	Integer	1审核成功 2审核失败
            }).then(res => {
              if (res.code === 0){
              	Dialog({
                  content: '操作成功',
                  okFn: () => {
                  	this.$router.push('/business/orderAudit')
                  }
                })
              } else {
	              Dialog({
		              content: res.msg
	              })
              }
	            this.$store.commit('SET_LOADING', false)
            })
          }
        })
      },
			getData (pageIndex) {
				// buySystemCode 买方地址
				// sellSystemCode 市商地址
        let dataObj = {
	        pageIndex: pageIndex || 1,
	        pageSize: this.pageSize
        }
        if (this.activeIndex === 0) {
	        dataObj.userCode = this.dataObj.sellSystemCode
        }
				if (this.activeIndex === 1) {
					dataObj.type = 1
				}
				if (this.activeIndex === 2) {
					dataObj.type = 2
				}
				this.loadingShow = true
				this.$fetch.post(`/trade/tradeOrder/queryTradeOrderList`, dataObj).then(res => {
					this.total = res.data.page.totalCount
          this.list = res.data.page.list
					if (!pageIndex || pageIndex === 1) {
						this.$refs.listWrap.resetPageIndex()
					}
					this.loadingShow = false
        }).catch(err => {
					this.loadingShow = false
        })
      },
			getDetails () {
				//
				this.$fetch.post('/trade/tradeOrder/preAuditTradeOrder', {
					id: this.dataObj.id
				}).then(res => {
					if (res.code === 0) {
						this.totalData = res.data.total
            this.resultData =res.data.resultData
            if (res.data.resultData && res.data.resultData.sellBankAccount) {
	            this.sellBankAccount = JSON.parse(res.data.resultData.sellBankAccount)
            }
					}
        })
      },
	    typeFn (type, buy, sell) { //  1卖方市商 2买方市商
		    if (type === 1) return sell
		    if (type === 2) return buy
	    },
    }
	}
</script>

<style lang="less" scoped>
.order-details-w{
  padding: 50px 10% 50px 50px;
  color: #000;
  .red{
    color: #f00;
  }
  .top-w{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 34px;
    .left-a{
      font-size: 16px;
      .name-a{
        margin-left: 10px;
      }
    }
    .btn-w{
      display: flex;
      align-items: center;
      .btn-item{
        cursor: pointer;
        width: 100px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        &:nth-child(1) {
          background-color: #0088ff;
          margin-right: 30px;
        }
        &:nth-child(2) {
          background-color: #f00;
        }
      }
    }
  }
  .money-w{
    display: flex;
    align-items: center;
    .money-item{
      margin-right: 160px;
      margin-bottom: 36px;
      width: 260px;
      @media screen and (max-width: 1800px){
        margin-right: 100px;
      }
      &:last-child{
        margin-right: 0;
        width: auto;
      }
      .money-a{
        color: #0088ff;
        margin-bottom: 10px;
      }
      .money-text{
        color: #a8a8a8;
        font-size: 14px;
      }
    }
  }
  .order-wrap{
    padding: 34px 0 30px;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    .text-a{
      font-size: 20px;
    }
    .order-a{
      display: flex;
      align-items: center;
      margin: 20px 0;
      .item-order{
        display: flex;
        align-items: center;
        margin-right: 60px;
        font-size: 14px;
        .number-a{
          margin-left: 20px;
        }
      }
    }
    .bank-info{
      font-size: 14px;
    }
  }
  .table-m{
    font-size: 20px;
    margin: 34px 0 18px;
  }
  .a-t-m{
    position: relative;
    .loading-w{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 100px;
        height: 100px;
      }
    }
  }
  .uls-b{
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .list-item{
      width: 100px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      border: 1px solid #0088ff;
      color: #0088ff;
      border-radius: 6px;
      cursor: pointer;
      &.active-list{
        background-color: #0088ff;
        color: #fff;
      }
    }
  }
  .table-w-a{
    /deep/ .cell{
      border: none;
      white-space: nowrap;
      overflow: hidden !important;
      font-weight: normal;
    }
    /deep/ .el-table--border td{
      border-right: none;
    }
    /deep/ .has-gutter th{
      padding: 20px 5px;
      background-color: #f3f3f5;
      color: #000;
    }
    /deep/ .el-table__row td {
      padding: 20px 5px;
      border-right: none;
    }
    /deep/ tbody tr td{
      &:nth-child(2), &:nth-child(3), &:nth-child(5){
        color: #0088ff;
      }
    }
    /deep/ td:nth-child(1),/deep/ th:nth-child(1){
      padding-left: 20px;
    }
  }

}
</style>
