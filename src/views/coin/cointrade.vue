<template>
    <!--API完成-->
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="main-content">
                <!--        筛选条件        -->
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model.trim="id" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">买家地址</div>
                        <div class="input-wrap"><input v-model.trim="buyAddress" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">卖家地址</div>
                        <div class="input-wrap"><input v-model.trim="sellAddress" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">买单ID</div>
                        <div class="input-wrap"><input v-model.trim="buyId" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">卖单ID</div>
                        <div class="input-wrap"><input v-model.trim="sellId" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange1">
                            <span class="el-dropdown-link">
                              {{stateText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in stateArr" :key="index">
                                        {{item.text}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">买卖标识</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange2">
                            <span class="el-dropdown-link">
                              {{flagText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in flagArr" :key="index">
                                        {{item.text}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box btns">
                        <div class="btn black" @click="resetFields">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
                <!--        绑定展示列表数据        -->
                <el-table
                        :data="list"
                        border
                        class="table-w-a"
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="ID">
                    </el-table-column>
                    <el-table-column
                            prop="buyAddress"
                            label="买家地址">
                    </el-table-column>
                    <el-table-column
                            prop="sellAddress"
                            label="卖家地址">
                    </el-table-column>
                    <el-table-column
                            prop="buyId"
                            label="买单ID">
                    </el-table-column>
                    <el-table-column
                            prop="sellId"
                            label="卖单ID">
                    </el-table-column>
                    <el-table-column
                            prop="buyPrice"
                            label="买单价格">
                    </el-table-column>
                    <el-table-column
                            prop="sellPrice"
                            label="卖单价格">
                    </el-table-column>
                    <el-table-column
                            prop="buyCurrency"
                            label="币种对,买">
                    </el-table-column>
                    <el-table-column
                            prop="sellCurrency"
                            label="币种对,卖">
                    </el-table-column>
                    <el-table-column
                            label="状态">
                        <template slot-scope="scope">{{stateFn(scope.row.state)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="tradePrice"
                            label="成交价格">
                    </el-table-column>
                    <el-table-column
                            prop="tradeAmount"
                            label="成交数量">
                    </el-table-column>
                    <el-table-column
                            prop="tradeTotalPrice"
                            label="成交总金额">
                    </el-table-column>
                    <el-table-column
                            prop="tradeFeeBuy"
                            label="买入成交手续费">
                    </el-table-column>
                    <el-table-column
                            prop="tradeFeeSell"
                            label="卖出成交手续费">
                    </el-table-column>

                    <el-table-column
                            prop="realTotalPrice"
                            label="实际获得金额">
                    </el-table-column>
                    <el-table-column
                            prop="realAmount"
                            label="实际获得成交数量">
                    </el-table-column>
                    <el-table-column
                            prop="surplusNoTradeAmountBuy"
                            label="买家剩余未成交数量">
                    </el-table-column>
                    <el-table-column
                            prop="surplusNoTradeTotalBuy"
                            label="买家剩余未成交金额">
                    </el-table-column>
                    <el-table-column
                            prop="surplusNoTradeAmountSell"
                            label="卖家剩余未成交数量">
                    </el-table-column>
                    <el-table-column
                            prop="surplusNoTradeTotalSell"
                            label="卖家剩余未成交金额">
                    </el-table-column>
                    <el-table-column
                            label="买卖标识">
                        <template slot-scope="scope">{{flagFn(scope.row.flag)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="撮合处理标识">
                        <template slot-scope="scope">{{processFlagFn(scope.row.processFlag)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="finishAtStr"
                            label="成交时间">
                    </el-table-column>
                    <el-table-column
                            prop="createAtStr"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateAtStr"
                            label="更新时间">
                    </el-table-column>
                </el-table>
                <table-pagination
                        :list="list"
                        :total="total"
                        :pageSize="pageSize"
                        @change="getData"
                ></table-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    /*import Dialog from '@/components/dialog/dialog'*/
    import log from "../user/log";

    export default {
        data() { // 不使用return包裹的数据会在项目的全局可见，会造成变量污染;使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件。
            return {
                list: [],
                total: 0,
                pageIndex: 1,
                pageSize: 20,

                loadShow: false,
                itemShow: false,
                id: '',
                buyAddress: '',
                sellAddress: '',
                buyId: '',
                sellId: '',
                stateText: '',
                stateId: '',
                flagText: '',
                flagId: '',
                unfoldActive: 0,
                stateArr: [],
                flagArr: [],
            }
        },
        created() {  // 进入页面就加载
            this.getType()
        },
        methods: {   // 存储可调用函数方法
            stateFn (item) {
                if (item !== null && item > -1 && this.stateArr.length > 0) {
                    return this.stateArr[item].text
                }
                return '-'
            },
            flagFn (item) {
                if (item !== null && item > -1 && this.flagArr.length > 0) {
                    return this.flagArr[item].text
                }
                return '-'
            },
            processFlagFn (item) {
                if (item !== null){
                    if (item === 0){
                        return "失败"
                    }
                    if (item === 1){
                        return "成功"
                    }
                    return '-'
                }
                return '-'
            },

            resetFields() {
                this.id = ''
                this.buyAddress = ''
                this.sellAddress = ''
                this.buyId = ''
                this.sellId = ''
                this.stateText = ''
                this.stateId = ''
                this.flagText = ''
                this.flagId = ''
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
                let url = '/public/enumValue?classPackage=currencytrade.CointradeRecord$FlagEnum;currencytrade.CointradeRecord$StateEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.stateArr = res.data.data.StateEnum
                        this.flagArr = res.data.data.FlagEnum
                    }
                })
            },
            search() {
                this.total = 1
                this.getData(1, this.pageSize)
            },
            getData(pageIndex, pageSize) {
                this.loadShow = true
                let stateId = this.stateId > 0 ? this.stateId : ''
                let flagId = this.flagId > 0 ? this.flagId : ''
                if (this.total !== 0) {
                    this.$fetch.post(`/currency/cointrade/queryCointradeList`, {
                        id: this.id,
                        buyAddress: this.buyAddress,
                        sellAddress: this.sellAddress,
                        buyId: this.buyId,
                        sellId: this.sellId,
                        state: stateId,
                        flag: flagId,
                        pageIndex: pageIndex || this.pageIndex,
                        pageSize: pageSize || this.pageSize,
                    }).then(res => {
                        this.loadShow = false
                        if (res.code === 0) {
                            this.list = res.data.page.list
                            this.total = res.data.page.totalCount
                        }
                    })
                }
            },
            commandChange1 (commend) {
                this.stateText = commend.item.text
                this.stateId = commend.item.id
            },
            commandChange2 (commend) {
                this.flagText = commend.item.text
                this.flagId = commend.item.id
            },
        },
        components: {
            tablePagination: require('@/components/tablePagination').default
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .wrap
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
</style>