<template>
    <div class="c-page media-wrap mar-right"  @click.stop="quicklySendShow = false">
        <div class="wrap pc-wrap">
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label" >用户名</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text" placeholder="请输入用户名"></div>
                    </div>
                    <div class="search-box">
                        <div class="label" >付款id</div>
                        <div class="input-wrap"><input v-model.trim="payTransactionId " type="text" placeholder="请输入付款id "></div>
                    </div>
                    <div class="search-box">
                        <div class="label">状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange"  @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{statusText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in  statusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange"  @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{typeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in  typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">支付状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange"  @visible-change="changeFn">
                                <span class="el-dropdown-link">
                                  {{payStatusText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 3)" v-for="(item,index) in payStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
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
                            class="table-w-a"
                            style="width: 100%">
                        <el-table-column
                                prop="id"
                                width="40"
                                label="序号">
                        </el-table-column>
                        <el-table-column
                                prop="orderCode"
                                label="订单编码">
                        </el-table-column>
                        <el-table-column
                                prop="userName"
                                label="用户名">
                        </el-table-column>
                        <el-table-column
                                prop="userSystemCode"
                                label="用户编码">
                        </el-table-column>
                        <el-table-column
                                prop="tradeTotal"
                                label="挂单交易金额">
                        </el-table-column>
                        <el-table-column
                                prop="rate"
                                label="交易汇率">
                        </el-table-column>
                        <el-table-column
                                prop="minTotal"
                                label="最低接单金额">
                        </el-table-column>
                        <el-table-column
                                prop="maxTotal"
                                label="最高接单金额">
                        </el-table-column>
                        <el-table-column
                                prop="currency"
                                label="交易币种">
                        </el-table-column>
                        <el-table-column
                                prop="rateCurrency"
                                label="价格币种">
                        </el-table-column>
                        <el-table-column
                                prop="payJson"
                                label="交易方式">
                        </el-table-column>
                        <el-table-column
                                label="类型">
                            <template slot-scope="scope">{{matchType(typeEnum,scope.row.type)}}</template>
                        </el-table-column>
                        <el-table-column
                                label="状态">
                            <template slot-scope="scope">{{matchType(statusEnum,scope.row.status)}}</template>
                        </el-table-column>
                        <el-table-column
                                label="支付状态">
                            <template slot-scope="scope">{{matchType(payStatusEnum,scope.row.payStatus)}}</template>
                        </el-table-column>
                        <el-table-column
                                prop="payTransactionId"
                                label="付款id">
                        </el-table-column>
                        <el-table-column
                                prop="refundTransactionId"
                                label="下架退款id">
                        </el-table-column>
                        <el-table-column
                                prop="subTotal"
                                label="剩余挂单交易金额">
                        </el-table-column>
                        <el-table-column
                                prop="payLimit"
                                label="付款时间限制分钟数">
                        </el-table-column>
                        <el-table-column
                                prop="autoReply"
                                label="自动回复">
                        </el-table-column>
                        <el-table-column
                                prop="tradeRemark"
                                label="交易备注">
                        </el-table-column>
                        <el-table-column
                                prop="backup3"
                                label="存退回金额">
                        </el-table-column>
                        <el-table-column
                                label="服务状态">
                            <template slot-scope="scope">{{matchType(serviceDateStatusEnum,scope.row.payStatus)}}</template>
                        </el-table-column>
                        <el-table-column
                                prop="createAtStr"
                                label="更新时间">
                        </el-table-column>
                        <el-table-column
                                prop="updateAtStr"
                                label="更新时间">
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
                imgFlag: false,
                errA: '',
                auditDesc: '',
                vipText: '',
                vipId: '',
                btnShow: false,
                indexF: '',

                userName: '',
                payTransactionId: '',
                typeEnum: [],
                statusEnum: [],
                payStatusEnum: [],
                serviceDateStatusEnum: [],

                statusText: '',
                statusId: '',
                typeText: '',
                typeId: '',
                payStatusText: '',
                payStatusId: '',
                serviceDateStatusText: '',
                serviceDateStatusId: '',

                dialogType: 'alert',
                dialogTitle: '市商审核',
                okText: '保存',
                sShow: false,
                noDataShow: false,
                loadingMobile: false,
                loadingShow2: false,

                sellBankAccount: {},
                bigImg: '',
                activeIndex: -1,
                detailObj: {},
                itemActiveShow: false,
                switchValue: false,
                loadingShow: false,
                dialogShow: false,
                detaildialogShow: false,
                quicklySendShow: false,
                list: [],
                languageList:[],
                total: 0,
                pageIndex: 1,
                pageSize: 10,
                loadShow: false,
                itemShow: false,
                unfoldActive: 0,

                tradingData: {},
                listTotal: 0,
                msgArr: [],
                dataId: '',
                detailsObj: {},
                creationVideo: ''
            }
        },
        created () {
            this.getType()
            if (window.innerWidth < 1200) {
                this.loadingMobile = true
                this.getData()
            }
        },
        watch: {
            msgArr: function () {
                if (this.$refs.msgUls) {
                    this.$refs.msgUls.scrollTop = this.$refs.msgUls.scrollHeight + 100
                }
            },
            '$route': function () {
                this.itemActiveShow = false
            }
        },
        methods: {
            loadImg (index) {

                this.imgData2[index].flag = false
            },
            changeFn (flag) {
                if (flag === true && (this.statusEnum.length === 0 || this.statusEnum.vipStatusEnum === 0)) {
                    this.getType()
                }
            },



            quicklySend () {
                this.quicklySendShow = !this.quicklySendShow
            },
            resetFields () {
                this.userName = ''
                this.payTransactionId = ''
                this.statusText = ''
                this.statusId = ''
                this.typeText = ''
                this.typeId = ''
                this.payStatusText = ''
                this.payStatusId = ''
            },
            getType () {
                let url = '/public/enumValue?classPackage=trade.ServiceOrder$ServiceDateStatusEnum;trade.ServiceOrder$TypeEnum;trade.ServiceOrder$StatusEnum;trade.ServiceOrder$PayStatusEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.statusEnum = res.data.data.StatusEnum //状态
                        this.serviceDateStatusEnum = res.data.data.ServiceDateStatusEnum //用户类型
                        this.typeEnum = res.data.data.TypeEnum //用户类型
                        this.payStatusEnum = res.data.data.PayStatusEnum // vip审核状态
                    }
                })
            },
            onPullingDown () {
                if (this.listTotal < 10) {
                    this.$refs.scroll.forceUpdate(true, false)
                } else {
                    this.getData(this.pageIndex, this.pageSize)
                }
            },
            search () {
                this.total = 1
                this.getData(this.pageIndex,10)
            },
            getData (pageIndex,pageSize) {
                this.noDataShow = false
                this.loadShow = true
                let statusId = this.statusId > -2 ? this.statusId : ''
                let typeId = this.typeId > -2 ? this.typeId : ''
                let payStatusId = this.payStatusId > -2 ? this.payStatusId : ''
                this.loadingShow2 = true
                this.$fetch.post(`/trade/serviceOrder/queryServiceOrderList`,{
                    userName: this.userName,
                    payTransactionId: this.payTransactionId,
                    status: statusId,
                    type: typeId,
                    payStatus: payStatusId,
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
            commandChange (commend) {
                if (commend.index === 1) {
                    this.statusText = commend.item.text
                    this.statusId = commend.item.id
                } else if (commend.index === 2) {
                    this.typeText = commend.item.text
                    this.typeId = commend.item.id
                } else if (commend.index === 3) {
                    this.payStatusText = commend.item.text
                    this.payStatusId = commend.item.id
                }
            }
        },
        components: {
            vDialog2: require('@/components/dialog2.vue').default,
        },
        computed: {
            options () {
                return {
                    pullUpLoad: true
                }
            }
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
        >>> .el-table__row
            cursor pointer
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
