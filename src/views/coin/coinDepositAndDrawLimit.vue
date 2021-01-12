<template>
    <!--api-->
    <div class="c-page media-wrap mar-right"  @click.stop="quicklySendShow = false">
        <div class="wrap pc-wrap">
            <div class="main-content">
                <!--       查询条件         -->
                <div class="search">
                    <div class="search-box">
                        <div class="label" >ID</div>
                        <div class="input-wrap"><input v-model.trim="id" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label" >币种</div>
                        <div class="input-wrap"><input v-model.trim="currency" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">是否ERC20币种</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange" @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{ethFlagText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in  ETHFlagEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">币种类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange" @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{coinTypeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in  CoinTypeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box btns">
                        <div @click="resetFields" class="btn black">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
                <!--        展示数据        -->
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
                                prop="currency"
                                label="币种">
                        </el-table-column>
                        <el-table-column
                                prop="currencyNet"
                                label="币种所属网络">
                        </el-table-column>
                        <el-table-column
                                prop="depositMinAmount"
                                label="充值最小额度">
                        </el-table-column>
                        <el-table-column
                                prop="depositMaxAmount"
                                label="充值最大额度">
                        </el-table-column>
                        <el-table-column
                                prop="depositFee"
                                label="充值手续费">
                        </el-table-column>
                        <el-table-column
                                prop="drawMinAmount"
                                label="提现最小额度">
                        </el-table-column>
                        <el-table-column
                                prop="drawMaxAmount"
                                label="提现最大额度">
                        </el-table-column>
                        <el-table-column
                                prop="drawFee"
                                label="提现手续费">
                        </el-table-column>
                        <el-table-column
                                label="是否支持充值">
                            <template slot-scope="scope"><div :class="{'no-s': scope.row.supportDeposite === 0}">{{matchType(SupportEnum,scope.row.supportDeposite)}}</div></template>
                        </el-table-column>
                        <el-table-column
                                width="140"
                                label="是否支持提现">
                            <template slot-scope="scope"><div :class="{'no-s': scope.row.supperDraw === 0}">{{matchType(SupportEnum, scope.row.supperDraw)}}</div></template>
                        </el-table-column>
                        <el-table-column
                                width="140"
                                label="是否是ERC20币种">
                            <template slot-scope="scope"><div :class="{'no-s': scope.row.ethFlag === 0}">{{matchType(ETHFlagEnum, scope.row.ethFlag)}}</div></template>
                        </el-table-column>
                        <el-table-column
                                prop="ercAddess"
                                label="代币地址">
                        </el-table-column>
                        <el-table-column
                                width="140"
                                label="币种类型">
                            <template slot-scope="scope"><div :class="{'no-s': scope.row.coinType === 1}">{{matchType(CoinTypeEnum, scope.row.coinType)}}</div></template>
                        </el-table-column>
                        <el-table-column
                                prop="coinImg"
                                label="币种图标">
                        </el-table-column>
                        <el-table-column
                                prop="sortNum"
                                label="排序序号">
                        </el-table-column>
                        <el-table-column
                                prop="currencyName"
                                label="中文名称">
                        </el-table-column>
                        <el-table-column
                                prop="ercWei"
                                label="代币的位标识">
                        </el-table-column>
                        <el-table-column
                                prop="everyDayDrawAuditAmount"
                                label="每日提现金额达到后需审核的值">
                        </el-table-column>
<!--                        <el-table-column-->
<!--                                label="成单率">-->
<!--                            <template slot-scope="scope">{{rateFn(scope.row.rate)}}</template>-->
<!--                        </el-table-column>-->
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
                noDataShow: false,// 没有数据展示
                loadShow: false,// 是否加载数据
                loadingShow2: false,// 是否显示正在加载弹窗
                btnShow: false,

                loadingMobile: false,
                indexF: '',
                isShow: false,
                loading2: false,
                detailObj: {},
                replyimg: [],
                contentimg: [],
                itemActiveShow: false,
                switchValue: false,
                loadingShow: false,
                dialogShow: false,
                detaildialogShow: false,
                quicklySendShow: false,
                imgData: [],
                imgData2: [],
                msgArr: [],

                id: '',
                currency: '',
                ethFlag: '',  // 是否是ERC20币种  0不是 1是
                coinType: '', // 申诉类型
                currencyName: '', // 等级

                list: [],
                total: 0,
                pageIndex: 1,
                pageSize: 10,

                ethFlagText: '',
                ethFlagId: '',
                coinTypeText: '',// 币种类型值
                coinTypeId: '', //币种类型编号id
                SupportEnum: [],
                ETHFlagEnum: [],
                CoinTypeEnum: [],
                listTotal: 0,
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
                if (flag === true && (this.ETHFlagEnum.length === 0 || this.CoinTypeEnum.length === 0)) {
                    this.getType()
                }
            },


            // //升级vip审核状态  1 待审核 2 通过审核 3 审核失败 4 支付待确认
            vipType (status) {
                if (status === 1) return '待审核'
                if (status === 2) return '通过审核'
                if (status === 3) return '审核失败'
                if (status === 4) return '支付待确认'
            },
            videoShow () {
                this.$refs.dialog2.show()
                setTimeout(() => {
                    this.$refs.video.play()
                }, 300)
            },
            // 市商类型
            typeFn (type) {
                if (type === 1) return '人民币市商'
                return type+ '-'
            },
            // 成单率
            rateFn (rate) {
                if (rate) return rate * 100 + '%'
                return 0
            },


            // 关闭弹窗
            close () {
                this.switchValue = false
                this.msgArr = []
                this.detaildialogShow = false
                document.body.style.overflow = ''
                this.contentimg = []
                this.replyimg = []
                this.detailObj = {}
                this.isShow = false
            },


            quicklySend () {
                this.quicklySendShow = !this.quicklySendShow
            },

            // 清空筛选条件参数
            resetFields () {
                this.id = ''
                this.currency = ''
                this.ethFlagText = ''
                this.ethFlagId = ''
                this.coinTypeText = ''
                this.coinTypeId = ''
                this.currencyName = ''
            },

            // 枚举类型
            getType () {
                let url = '/public/enumValue?classPackage=coin.CoinDepositAndDrawLimit$SupportEnum;coin.CoinDepositAndDrawLimit$ETHFlagEnum;coin.CoinDepositAndDrawLimit$CoinTypeEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.SupportEnum = res.data.data.SupportEnum //是否支持  0不支持 1支持
                        this.ETHFlagEnum = res.data.data.ETHFlagEnum //是否是ERC20币种 0不是 1是
                        this.CoinTypeEnum = res.data.data.CoinTypeEnum //币种类型 1法币 2虚拟币
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
            // 查询
            getData (pageIndex,pageSize) {
                this.noDataShow = false
                this.loadShow = true
                let ethFlagId = this.ethFlagId > -2 ? this.ethFlagId : ''
                let coinTypeId = this.coinTypeId > -2 ? this.coinTypeId : ''
                // let problemStatus = this.problemStatus > -2 ? this.problemStatus : ''
                this.loadingShow2 = true
                this.$fetch.post(`/coin/cddLimit/queryCoinDepositAndDrawLimitList`,{
                    id: this.id,
                    currency: this.currency,
                    currencyName: this.currencyName,
                    ethFlag: ethFlagId,
                    coinType: coinTypeId,
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
                    this.ethFlagText = commend.item.text
                    this.ethFlagId = commend.item.id
                } else if (commend.index === 2) {
                    this.coinTypeText = commend.item.text
                    this.coinTypeId = commend.item.id
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
    .no-s{
        /*color #ff0000*/
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
