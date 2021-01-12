<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/tradeRecord" class="title-m">交易记录 </router-link>
        <span> / 记录详情</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <li class="li-item">
          <div class="li-left">ID</div>
          <div class="li-right">{{data.id}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">订单ID</div>
          <div class="li-right">{{isEmptyText(data.orderId)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">发送者用户名</div>
          <div class="li-right">{{isEmptyText(data.sendUserName)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">接收者用户名</div>
          <div class="li-right">{{isEmptyText(data.receiveUserName)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">币种</div>
          <div class="li-right">{{data.currency}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">金额</div>
          <div class="li-right">{{data.amount}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">手续费</div>
          <div class="li-right">{{isEmptyText(data.feeAmount)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">hash</div>
          <div class="li-right">{{isEmptyText(data.hashCode)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">状态</div>
          <div class="li-right">{{stateFn(data.status)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">支付类型</div>
          <div class="li-right">{{payType(data.paymentType)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">创建时间</div>
          <div class="li-right">{{isEmptyText(data.createtime)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">修改时间</div>
          <div class="li-right">{{isEmptyText(data.updatetime)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">回调次数</div>
          <div class="li-right">{{isEmptyText(data.callbackCount)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">回调状态</div>
          <div class="li-right">{{callbackStateFn(data.callbackState)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">下次回调时间</div>
          <div class="li-right">{{isEmptyText(data.nextCallbackTime)}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import Dialog from '@/components/dialog/dialog'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        id: this.$route.query.id,
        obj: JSON.parse(this.$route.query.obj),
        data: {},
        stateArr: [],
        payArr: [],
        callbackArr: []
      }
    },
    created() {
      this.getType()
      this.getData()
    },
    methods: {
      getType() {
        let url ='/public/enumValue?classPackage=trade.Transaction$CallbackEnum;trade.Transaction$StateEnum;trade.Transaction$PaymentTypeEnum&flag=true&state=1'
        this.$fetch.get(`${url}`).then(res => {
          if (res.code === 0) {
            this.stateArr = res.data.data.StateEnum  // 状态
            this.payArr = res.data.data.PaymentTypeEnum // 支付状态
            this.callbackArr = res.data.data.CallbackEnum // 回调状态
          }
        })
      },
      payType(index) {
        if (index !== null && index >= 1 && this.payArr.length > 0) {}
        for (let i in this.payArr) {
          if (index === parseInt(this.payArr[i].id)) {
            return this.payArr[i].text
          }
        }
      },
      stateFn (item) {
        if (item !== null && item >= -1 && this.stateArr.length > 0) {
          for (let i in this.stateArr) {
            if (item === parseInt(this.stateArr[i].id)) {
              return this.stateArr[i].text
            }
          }
        }
        return '-'
      },
      callbackStateFn (item) {
        if (item !== null && item >=1 && this.callbackArr.length > 0) {
          for (let i in this.callbackArr) {
            if (item === parseInt(this.callbackArr[i].id)) {
              return this.callbackArr[i].text
            }
          }
        }
      },
      getData() {
        this.$fetch.post(`/trade/transaction/preCatTransactionData?id=${this.id}`).then(res => {
          if(res.code === 0) {
            this.data = res.data.resultData
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .page-wrap{
        padding-top 80px !important
    }
  .dialog-input{
    width 240px!important
  }
  .li-item{
    line-height: 2
  }
  .ul-w{
      padding-bottom: 0
  }
  .problem-box{
    display flex
    justify-content space-between
    align-items center
    .dropdown-wrap {
      cursor pointer
      text-align center
      line-height 40px
      width: 250px;
      margin-right: 20px;
      background-color #fff
      border: 1px solid #DCDFE6;
      border-radius: 6px;
      padding: 0 10px;
      font-size 15px
      height: 40px;
      >>>.el-dropdown-link{
        display flex
        justify-content space-between
        align-items center
      }
    }
    >>>.el-dropdown-menu{
      width 240px!important
    }
  }
  >>>.el-dialog__body{
    padding 30px 20px!important
  }

  .zoom-enter-to{
    transition: none;
  }
</style>
