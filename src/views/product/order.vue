<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="crumb">
                <span>查询订单</span>
            </div>
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model="id" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">买家用户名</div>
                        <div class="input-wrap"><input v-model.trim="buyUserName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">买家用户地址</div>
                        <div class="input-wrap"><input v-model.trim="buyUserAddress" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">卖家用户名</div>
                        <div class="input-wrap"><input v-model.trim="saleUserName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">卖家用户地址</div>
                        <div class="input-wrap"><input v-model.trim="saleUserAddress" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">订单状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item,index) in statusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">订单类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{orderTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in orderTypeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">支付方式</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{paymethodText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 3)" v-for="(item,index) in paymethodEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">是否自动续费</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{isAuthText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 4)" v-for="(item,index) in isAuthEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">标记</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{flagText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 5)" v-for="(item,index) in flagEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <!--data组件-->
                    <div class="block">
                        <span class="demonstration">时间</span>
                        <el-date-picker
                                clear-icon="none"
                                clearable="clearable"
                                v-model="startDateStr "
                                :picker-options="pickerBeginDateBefore"
                                type="datetime"
                                placeholder="开始时间"
                                default-time="00:00:00">
                        </el-date-picker>
                        <span class="hr">-</span>
                        <el-date-picker
                                clear-icon="none"
                                clearable="clearable"
                                v-model="endDateStr "
                                :picker-options="pickerBeginDateAfter"
                                type="datetime"
                                placeholder="结束时间"
                                default-time="23:59:59">
                        </el-date-picker>
                    </div>
                    <div class="search-box btns">
                        <div @click="resetFields()" class="btn black">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
                <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
                    <div class="web-table">
                        <div class="center">
                            <div class="thead item-list">
                                <div class="li">ID</div>
                                <div class="li">订单编号</div>
                                <div class="li"><span>买家用户名</span></div>
                                <div class="li">卖家用户名</div>
                                <div class="li">订单总金额</div>
                                <div class="li">购物车批次</div>
                                <div class="li">币种</div>
                                <div class="li">美元价格</div>
                                <div class="li">sie汇率</div>
                                <div class="li" :class="{'active': statussHow}">操作</div>
                            </div>
                            <div class="item-list table-list" v-for="(item, index) in isListNull(list)" :key="index">
                                <div class="flex-item">
                                    <div class="li">{{item.id}}</div>
                                    <div class="li"><span>{{item.code}}</span></div>
                                    <div class="li">{{item.buyUserName}}</div>
                                    <div class="li">{{item.saleUserName}}</div>
                                    <div class="li">{{item.orderAmount}}</div>
                                    <div class="li">{{item.groupcar}}</div>
                                    <div class="li">{{item.currency}}</div>
                                    <div class="li">{{item.usdtotal}}</div>
                                    <div class="li">{{item.rate}}</div>
                                    <div class="li operation">
                                        <div class="in-btn" v-if="unfoldActive === index && itemShow === true" @click="unfold(index +'2')">收起<i class="icon" :class="{'active':  unfoldActive === index && itemShow === true}"></i></div>
                                        <div class="in-btn" v-else @click="unfold(index)">展开<i class="icon"></i></div>
                                        <div class="in-btn" v-if="item.status === 2" @click="modifyOrder(item.id)">修改订单</div>
                                    </div>
                                </div>
                                <div class="on-the-details" :class="{'active': unfoldActive === index && itemShow}">
                                    <div class="info-box" v-if="unfoldActive === index && itemShow">
                                        <a href="" target=""></a>
                                        <div class="item-flex-item">
                                            <div class="li">订单状态: {{matchType(statusEnum,item.status)}}</div>
                                            <div class="li">支付方式: {{matchType(paymethodEnum,item.paymethod || '-')}}</div>
                                            <div class="li">订单类型: {{matchType(orderTypeEnum,item.orderType)}}</div>
                                            <div class="li">是否自动续费: {{matchType(isAuthEnum,item.isAuth)}}</div>
                                            <div class="li">说明: {{item.remark}}</div>
                                            <div class="li">支付流水号: {{item.paynumber}}</div>
                                            <div class="li">标记: {{matchType(flagEnum,item.flag)}}</div>
                                            <div class="li">创建时间: {{$changeDate(item.createAt,'-',1)}}</div>
                                            <div class="li">更新时间: {{$changeDate(item.updateAt,'-',1)}}</div>
                                            <div class="li">买家用户地址： {{item.buyUserAddress}}</div>
                                            <div class="li">卖家用户地址： {{item.saleUserAddress}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                            <img src="~@img/loading.gif" />
                        </div>
                    </div>
                </list-wrap>
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        id: '',
        buyUserName: '',
        buyUserAddress : '',
        saleUserName: '',
        saleUserAddress: '',
        status: '',
        orderType: '',
        paymethod: '',
        isAuth: '',
        flag: '',
        startDateStr: '',
        endDateStr: '',
        statusText: '',
        orderTypeText: '',
        paymethodText: '',
        isAuthText: '',
        flagText: '',
        unfoldActive: 0,
        itemShow: false,
        unfoldText: '展开',
        statussHow: false,
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        statusEnum: [],
        paymethodEnum: [],
        isAuthEnum: [],
        flagEnum: [],
        orderTypeEnum: [],
        pageSize: 10,
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
    created () {
      this.getType()
    },
    mounted () {
    },
    methods: {
      resetFields () {
        this.id = ''
        this.buyUserName = ''
        this.buyUserAddress = ''
        this.saleUserName = ''
        this.saleUserAddress = ''
        this.statusText = '全部'
        this.orderTypeText = '全部'
        this.paymethodText = '全部'
        this.isAuthText = '全部'
        this.flagText = '全部'
        this.status = ''
        this.orderType = ''
        this.paymethod = ''
        this.isAuth = ''
        this.flag = ''
        this.startDateStr = ''
        this.endDateStr = ''
      },
      getType () {
        this.$fetch.post(`/public/enumValue?classPackage=product.Order$IsAuthEnum;product.Order$PaymethodEnum;product.Order$FlagEnum;product.Order$StatusEnum;product.Order$OrderTypeEnum&flag=true&state=1`).then((res) => {
           if (res.msg === '成功') {
             this.statusEnum = res.data.data.StatusEnum
             this.paymethodEnum = res.data.data.PaymethodEnum
             this.isAuthEnum = res.data.data.IsAuthEnum
             this.flagEnum = res.data.data.FlagEnum
             this.orderTypeEnum =  res.data.data.OrderTypeEnum
           }
        })
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.statusText = commend.item.text
          this.status = commend.item.id
        } else if (commend.index === 2) {
          this.orderTypeText = commend.item.text
          this.orderType = commend.item.id
        } else if (commend.index === 3) {
          this.paymethodText = commend.item.text
          this.paymethod = commend.item.id
        } else if (commend.index === 4) {
          this.isAuthText = commend.item.text
          this.isAuth = commend.item.id
        } else if (commend.index === 5) {
          this.flagText = commend.item.text
          this.flag = commend.item.id
        }
      },
      unfold (index) {
        this.unfoldActive = index
        this.itemShow = !this.itemShow
        if (this.unfoldActive !== index && this.itemShow === false) {
          this.itemShow = true
        }
        if (this.unfoldActive === index && this.itemShow === false) {
          this.itemShow = true
        }
        if (this.unfoldActive === index +'2' && this.itemShow === true) {
          this.itemShow = false
        }
      },
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize) {
        this.loadShow = true
        let status = this.status === 'selected' ? '' : this.status
        let orderType = this.orderType === 'selected' ? '' : this.orderType
        let paymethod = this.paymethod === 'selected' ? '' : this.paymethod
        let isAuth = this.isAuth === 'selected' ? '' : this.isAuth
        let flag = this.flag === 'selected' ? '' : this.flag
        let objData ={
          pageIndex: pageIndex || this.pageIndex,
          pageSize: pageSize || this.pageSize,
        }
        if (this.id) objData.id = this.id
        if (this.buyUserName) objData.buyUserName = this.buyUserName
        if (this.buyUserAddress) objData.buyUserAddress = this.buyUserAddress
        if (this.saleUserName) objData.saleUserName = this.saleUserName
        if (this.saleUserAddress) objData.saleUserAddress = this.saleUserAddress
        objData.status = status
        objData.orderType = orderType
        objData.paymethod = paymethod
        objData.isAuth = isAuth
        objData.flag = flag
        if (this.startDateStr) objData.startDateStr = this.$changeDate(this.startDateStr, '-', 8)
        if (this.endDateStr) objData.endDateStr = this.$changeDate(this.endDateStr, '-', 8)
        if (this.total !== 0) {
          this.$fetch.post(`/product/order/queryOrderList`,objData).then((res) => {
            this.loadShow = false
            if (res.msg === '成功') {
              this.list = res.data.page.list
              this.total = res.data.page.totalCount
            }
          })
        }
      },
      modifyOrder (id) {
        Dialog ({
          title: '确定要修改吗？',
          type: 'confirm', // 弹框类型 alert、confirm
          okFn: () => {
            this.$fetch.post(`/product/order/updateOrderList?id=${id}`).then((res) => {
              if (res.msg === '修改成功') {
                Dialog ({
                  title: res.msg
                })
                this.search()
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .wrap
        .crumb
            margin-bottom 0;
            display flex;
            align-items center;
            justify-content space-between
            padding-bottom 22px;
            .new-add
                width 90px
                height 34px
                line-height 34px
                font-size 14px
                color #2176ff
                text-align center
                cursor pointer
                border 1px solid #2176ff
                border-radius 2px
                transition all .2s linear
                &:hover
                    background-color #fff !important
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
                            .info-box
                                width 100%
                                height 100%
                                padding 0 20px
                                background-color #fff
                                .item-flex-item
                                    display flex
                                    align-items center
                                    justify-content flex-start
                                    text-align center
                                    flex-direction row
                                    flex-flow wrap
                                    background-color #fff
                                    .li
                                        height auto
                                        padding 14px 0
                                        flex none
                                        width auto
                                        text-align left
                                        margin-right 80px
                                        @media screen and (max-width 1400px){
                                            margin-right 50px
                                        }
                                        @media screen and (max-width 1200px){
                                            margin-right 30px
                                        }
                    &:nth-child(odd)
                        background-color #F8F8FA
                    .li
                        flex 1
                        line-height 15px
                        width auto
                    .li
                        text-align center
                        &:nth-child(1)
                            @media screen and (max-width 1200px) {
                                flex none
                                width 70px
                            }
                        &:nth-child(n+2)
                            padding-left 0
                        &:nth-child(2)
                            flex none
                            width 160px
                            @media screen and (max-width 1200px) {
                                width 110px
                            }
                            span
                                display inline-block
                                width 130px
                                @media screen and (max-width 1200px) {
                                    width 100px
                                }
                        &:last-child
                            flex none
                            width 130px
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
                    .operation
                        color #2176ff
                        cursor pointer
                        display flex
                        align-items center
                        justify-content center
                        width 130px
                        .in-btn
                            border-right 1px solid #DCDFE6
                            padding-right 10px
                            &:nth-child(n+2)
                                padding-left 10px
                                &:hover
                                    color #121212
                            &:last-child
                                border-right none
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
        .dialog-modal
            position fixed
            width 100%
            height 100%
            top 0
            left 0
            right 0
            z-index 1000
            background-color rgba(0,0,0,.2)
            font-size 14px
            color #121212
            .content-box
                width 450px
                height 260px
                background-color #fff
                border-radius 4px
                position absolute
                top 50%
                left 50%
                transform translate(-50%,-50%)
                padding 22px 33px
                z-index 9999
                .item-li
                    width 100%
                    line-height 34px
                    display flex
                    align-items center
                    justify-content space-between
                    margin-bottom 30px
                    &:nth-child(1)
                        .title
                            font-size 16px
                        .input-text
                            width: 16px
                    &:last-child
                        .input-text
                            height 100%
                            display flex
                            align-items center
                            justify-content flex-end
                            .button
                                width: 80px
                                height: 34px
                                line-height 34px
                                text-align center
                                cursor pointer
                                &:nth-child(1)
                                    border 1px solid #e5e8ed
                                    color #121212
                                &:nth-child(2)
                                    background-color #2176ff
                                    color #fff
                                    margin-left 20px
                    .input-text
                        .close
                            width 16px
                            height: 16px
                            background url("~@img/close.svg") no-repeat center
                            background-size contain
                            cursor pointer
                        input
                            display inline-block
                            width 294px
                            height: 34px
                            border 1px solid #e5e8ed
                            border-radius 2px
                            padding 0 10px
                    .input-wrap
                        .el-dropdown-link
                            width: 294px;
                            height: 34px
                            display flex
                            align-items center
                            justify-content space-between
                            padding 0 10px
                            border 1px solid #e5e8ed

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
                .input-wrap
                    flex 1
            &:nth-child(8)
                .picker-time
                    flex 1
                    display flex
                    align-items center
                    justify-content flex-start
                    .el-input
                        width 47% !important
                        .el-input__inner
                            width 100%!important
                            margin-right 0 !important
                            padding 0 6px !important
                    .hr
                        margin 0 5px
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
        .btns
            justify-content flex-start
            .btn
                cursor pointer

</style>

