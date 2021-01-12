<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">id</div>
                        <div class="input-wrap"><input v-model.trim="id" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">用户名</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">用户编码</div>
                        <div class="input-wrap"><input v-model.trim="userSystemCode" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">币种</div>
                        <div class="input-wrap"><input v-model.trim="currency" type="text"></div>
                    </div>

                    <div class="block">
                        <span class="demonstration">创建时间</span>
                        <el-date-picker
                                clear-icon="none"
                                clearable="clearable"
                                v-model="startAtStr"
                                :picker-options="pickerBeginDateBefore"
                                type="datetime"
                                placeholder="开始时间"
                                default-time="00:00:00">
                        </el-date-picker>
                        <span class="hr">-</span>
                        <el-date-picker
                                clear-icon="none"
                                clearable="clearable"
                                v-model="endAtStr"
                                :picker-options="pickerBeginDateAfter"
                                type="datetime"
                                placeholder="结束时间"
                                default-time="23:59:59">
                        </el-date-picker>
                    </div>
                    <div class="search-box btns">
                        <div class="btn black" @click="resetFields">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
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
                            prop="userSystemCode"
                            label="用户编码">
                    </el-table-column>

                    <el-table-column
                            prop="balance"
                            label="余额">
                    </el-table-column>
                    <el-table-column
                            prop="balanceFreeze"
                            label="冻结余额">
                    </el-table-column>
                    <el-table-column
                            prop="currency"
                            label="币种">
                    </el-table-column>
                    <el-table-column
                            prop="createAtStr"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateAtStr"
                            label="更新时间">
                    </el-table-column>
                    <el-table-column
                            label="备注">
                        <template slot-scope="scope">{{isEmptyText(scope.row.remark)}}</template>
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
    export default {
        data() {
            return {
                id: '',
                userName: '',
                userSystemCode: '',
                currency: '',
                list: [],
                total: 0,
                pageIndex: 1,
                pageSize: 20,
                loadShow: false,
                itemShow: false,
                unfoldActive: 0,
                startAtStr: '',
                endAtStr: '',
                pickerBeginDateBefore: {
                    disabledDate: (time) => {
                        let beginDateVal = this.endAtStr
                        if (beginDateVal) {
                            return time.getTime() > beginDateVal
                        }
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        let beginDateVal = this.startAtStr
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal
                        }
                    }
                },
            }
        },

        methods: {
            resetFields() {
                this.id = ''
                this.userName = ''
                this.userSystemCode = ''
                this.currency = ''
                this.startAtStr = ''
                this.endAtStr = ''
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

            search() {
                this.total = 1
                this.getData(1, this.pageSize)
            },
            getData(pageIndex, pageSize) {
                this.loadShow = true
                if (this.total !== 0) {
                    this.$fetch.post(`/user/userAccount/queryUserAccountList`, {
                        id: this.id,
                        userName: this.userName,
                        userSystemCode: this.userSystemCode,
                        currency: this.currency,
                        startAtStr:  this.$changeDate(this.startAtStr, '-', 8),
                        endAtStr:  this.$changeDate(this.endAtStr, '-', 8),
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

