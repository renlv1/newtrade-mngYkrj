<template>
    <!--api-->
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
                        <div class="label">用户名</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text"/></div>
                    </div>
                    <div class="search-box">
                        <div class="label">充值订单状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange3">
                            <span class="el-dropdown-link">
                              {{depositStatusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                        <div class="label">订单状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange2">
                            <span class="el-dropdown-link">
                              {{drawStatusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in statusArr" :key="index">
                                        {{item.text}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange1">
                            <span class="el-dropdown-link">
                              {{recordTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in typeArr" :key="index">
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
                            prop="userName"
                            label="用户名">
                    </el-table-column>
                    <el-table-column
                            prop="userAddress"
                            label="用户地址">
                    </el-table-column>
                    <el-table-column
                            label="充值订单状态">
                        <template slot-scope="scope">{{stateFn(scope.row.depositStatus)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="订单状态">
                        <template slot-scope="scope">{{statusFn(scope.row.drawStatus)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="amount"
                            label="充值或打款金额">
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
                            prop="userReceiveAccount"
                            label="收款账户">
                    </el-table-column>
                    <el-table-column
                            prop="sourceTokenAddress"
                            label="币转入来源的地址">
                    </el-table-column>
                    <el-table-column
                            prop="failureCause"
                            label="失败/异常原因">
                    </el-table-column>
                    <el-table-column
                            prop="checkCount"
                            label="检查次数">
                    </el-table-column>
                    <el-table-column
                            prop="nextCheckTimeAtStr"
                            label="下次检查时间">
                    </el-table-column>
                    <el-table-column
                            prop="operateAtStr"
                            label="钱包处理时间">
                    </el-table-column>
                    <el-table-column
                            label="类型">
                        <template slot-scope="scope">{{typeFn(scope.row.recordType)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="accountTag"
                            label="提币标签">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="说明">
                    </el-table-column>
                    <el-table-column
                            prop="relateId"
                            label="关联id">
                    </el-table-column>
                    <el-table-column
                            prop="drawFee"
                            label="提现手续费">
                    </el-table-column>
                    <el-table-column
                            prop="serviceCharge"
                            label="网络手续费">
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
                userName: '',
                depositStatusText: '',
                depositStatusId: '',
                drawStatusText: '',
                drawStatusId: '',
                recordTypeText: '',
                recordTypeId: '',
                unfoldActive: 0,
                stateArr: [],
                typeArr: [],
                statusArr: [],
            }
        },
        created() {  // 进入页面就加载
            this.getType()
        },
        methods: {   // 存储可调用函数方法
            statusFn (item) {
                if (item !== null && item > -1 && this.statusArr.length > 0) {
                    return this.statusArr[item+1].text
                }
                return '-'
            },
            stateFn (item) {
                if (item !== null && item > -1 && this.stateArr.length > 0) {
                    return this.stateArr[item+1].text
                }
                return '-'
            },
            typeFn (item) {
                if (item !== null && item > -1 && this.typeArr.length > 0) {
                    return this.typeArr[item].text
                }
                return '-'
            },

            resetFields() {
                this.id = ''
                this.userName = ''
                this.depositStatusText = ''
                this.depositStatusId = ''
                this.drawStatusText = ''
                this.drawStatusId = ''
                this.recordTypeText = ''
                this.recordTypeId = ''
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
                let url = '/public/enumValue?classPackage=coin.TokenCoinOrder$DepositeStatusEnum;coin.TokenCoinOrder$DrawStatusEnum;coin.TokenCoinOrder$RecordTypeEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.stateArr = res.data.data.DepositeStatusEnum
                        this.typeArr = res.data.data.RecordTypeEnum
                        this.statusArr = res.data.data.DrawStatusEnum
                    }
                })
            },
            search() {
                this.total = 1
                this.getData(1, this.pageSize)
            },
            getData(pageIndex, pageSize) {
                this.loadShow = true
                let drawStatusId = this.drawStatusId > -1 ? this.drawStatusId : ''
                let depositStatusId = this.depositStatusId > -1 ? this.depositStatusId : ''
                let recordTypeId = this.recordTypeId > -1 ? this.recordTypeId : ''
                if (this.total !== 0) {
                    this.$fetch.post(`/coin/tcOrder/queryTcOrderList`, {
                        id: this.id,
                        userName: this.userName,
                        drawStatus: drawStatusId,
                        depositStatus: depositStatusId,
                        recordType: recordTypeId,
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
                this.recordTypeText = commend.item.text
                this.recordTypeId = commend.item.id
            },
            commandChange2 (commend) {
                this.drawStatusText = commend.item.text
                this.drawStatusId = commend.item.id
            },
            commandChange3 (commend) {
                this.depositStatusText = commend.item.text
                this.depositStatusId = commend.item.id
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