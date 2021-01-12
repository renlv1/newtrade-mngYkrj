<template>
    <!--api-->
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="main-content">
                <!--        筛选条件        -->
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model.trim="id" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">发送用户名</div>
                        <div class="input-wrap"><input v-model.trim="sendUserName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">接收用户名</div>
                        <div class="input-wrap"><input v-model.trim="receiveUserName" type="text"></div>
                    </div>
<!--                    <div class="search-box">-->
<!--                        <div class="label">推送标识</div>-->
<!--                        <div class="input-wrap dropdown-wrap">-->
<!--                            <el-dropdown @command="commandChange1">-->
<!--                                <span class="el-dropdown-link">-->
<!--                                {{pushFlagText || '全部'}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                                </span>-->
<!--                                <el-dropdown-menu class="menu" slot="dropdown">-->
<!--                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in pushFlagArr" :key="index">{{item.text}}</el-dropdown-item>-->
<!--                                </el-dropdown-menu>-->
<!--                            </el-dropdown>-->
<!--                        </div>-->
<!--                    </div>-->
                    <div class="search-box">
                        <div class="label">消息来源</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange2">
                                <span class="el-dropdown-link">
                                {{messageSourceText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in messageSourceArr" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">消息状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange3">
                                <span class="el-dropdown-link">
                                {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in statusArr" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">订单类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange4">
                                <span class="el-dropdown-link">
                                {{orderTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,4)" v-for="(item,index) in orderTypeArr" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <!--data组件-->
                    <div class="block">
                        <span class="demonstration">时间</span>
                        <el-date-picker
                                v-model="startDateStr"
                                :picker-options="pickerBeginDateBefore"
                                type="datetime"
                                placeholder="开始时间"
                                clearable="clearable"
                                clear-icon="none"
                                default-time="00:00:00">
                        </el-date-picker>
                        <span class="hr">-</span>
                        <el-date-picker
                                v-model="endDateStr"
                                :picker-options="pickerBeginDateAfter"
                                type="datetime"
                                clearable="clearable"
                                clear-icon="none"
                                placeholder="结束时间"
                                default-time="23:59:59">
                        </el-date-picker>
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
                            prop="sendUserName"
                            label="发送用户名">
                    </el-table-column>
                    <el-table-column
                            prop="sendSystemCode"
                            label="发送用户地址">
                    </el-table-column>
                    <el-table-column
                            prop="receiveUserName"
                            label="接收用户名">
                    </el-table-column>
                    <el-table-column
                            prop="receiveSystemCode"
                            label="接收用户地址">
                    </el-table-column>
                    <el-table-column
                            prop="receiveOtherName"
                            label="另一接收用户名">
                    </el-table-column>
                    <el-table-column
                            prop="receiveOtherCode"
                            label="另一接收用户地址">
                    </el-table-column>
                    <el-table-column
                            label="消息类型">
                        <template slot-scope="scope">{{messageTypeFn(scope.row.messageType)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="消息来源">
                        <template slot-scope="scope">{{messageSourceFn(scope.row.messageSource)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="消息状态">
                        <template slot-scope="scope">{{statusFn(scope.row.status)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="推送标识">
                        <template slot-scope="scope">{{pushFlagFn(scope.row.pushFlag)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="阅读标识">
                        <template slot-scope="scope">{{readFlagFn(scope.row.readFlag)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="messageBody"
                            label="消息内容">
                    </el-table-column>
                    <el-table-column
                            prop="pushAtStr"
                            label="发送时间">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注">
                    </el-table-column>
                    <el-table-column
                            label="订单类型">
                        <template slot-scope="scope">{{orderTypeFn(scope.row.orderType)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="messageId"
                            label="客户端保存的数据id">
                    </el-table-column>
                    <el-table-column
                            prop="receiveCodeList"
                            label="消息接收人编码列表">
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
                sendUserName: '',
                receiveUserName: '',
                pushFlagText: '',
                pushFlagId: '',
                orderTypeText: '',
                orderTypeId: '',
                messageTypeText: '',
                messageTypeId: '',
                messageSourceText: '',
                messageSourceId: '',
                statusText: '',
                statusId: '',
                readFlagText: '',
                readFlagId: '',
                unfoldActive: 0,
                pushFlagArr: [],
                messageTypeArr: [],
                messageSourceArr: [],
                statusArr: [],
                readFlagArr: [],
                orderTypeArr: [],
                startDateStr: '',
                endDateStr: '',
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
        created() {  // 进入页面就加载
            this.getType()
        },
        methods: {   // 存储可调用函数方法
            pushFlagFn (item) {
                if (item !== null && item > -1 && this.pushFlagArr.length > 0) {
                    return this.pushFlagArr[item].text
                }
                return '-'
            },
            messageSourceFn (item) {
                if (item !== null && item > -1 && this.messageSourceArr.length > 0) {
                    return this.messageSourceArr[item].text
                }
                return '-'
            },
            messageTypeFn (item) {
                if (item !== null && item > -1 && this.messageTypeArr.length > 0) {
                    return this.messageTypeArr[item].text
                }
                return '-'
            },
            readFlagFn (item) {
                if (item !== null && item > -1 && this.readFlagArr.length > 0) {
                    return this.readFlagArr[item].text
                }
                return '-'
            },
            orderTypeFn (item) {
                if (item !== null && item > -1 && this.orderTypeArr.length > 0) {
                    return this.orderTypeArr[item].text
                }
                return '-'
            },
            statusFn (item) {
                if (item !== null && item > -1 && this.statusArr.length > 0) {
                  for (let i in this.statusArr) {
                      if (parseInt(item) === parseInt(this.statusArr[i].id)){
                        return this.statusArr[i].text
                      }
                  }
                }
                return '-'
            },


            resetFields() {
                this.id = ''
                this.sendUserName = ''
                this.receiveUserName = ''
                this.pushFlagText = ''
                this.pushFlagId = ''
                this.orderTypeText = ''
                this.orderTypeId = ''
                this.messageTypeText = ''
                this.messageTypeId = ''
                this.messageSourceText = ''
                this.messageSourceId = ''
                this.statusText = ''
                this.statusId = ''
                this.readFlagText = ''
                this.readFlagId = ''
                this.startDateStr = ''
                this.endDateStr = ''
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
                let url = '/public/enumValue?classPackage=system.Message$MessageSourceEnum;system.Message$MessageTypeEnum;' +
                            'system.Message$StatusEnum;system.Message$PushFlagEnum;system.Message$ReadEnum;system.Message$OrderTypeEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.messageSourceArr = res.data.data.MessageSourceEnum
                        this.messageTypeArr = res.data.data.MessageTypeEnum
                        this.statusArr = res.data.data.StatusEnum
                        this.pushFlagArr = res.data.data.PushFlagEnum
                        this.readFlagArr = res.data.data.ReadEnum
                        this.orderTypeArr = res.data.data.OrderTypeEnum
                    }
                })
            },
            search() {
                this.total = 1
                this.getData(1, this.pageSize)
            },
            getData(pageIndex, pageSize) {
                this.loadShow = true
                // let pushFlagId = this.pushFlagId > -1 ? this.pushFlagId : ''
                let messageSourceId = this.messageSourceId > -1 ? this.messageSourceId : ''
                let statusId = this.statusId >= -1 ? this.statusId : ''
                let orderTypeId = this.orderTypeId > -1 ? this.orderTypeId : ''
                if (this.total !== 0) {
                    this.$fetch.post(`/system/message/queryMessageList`, {
                        id: this.id,
                        sendUserName: this.sendUserName,
                        receiveUserName: this.receiveUserName,
                        // pushFlag: pushFlagId,
                        messageSource: messageSourceId,
                        status: statusId,
                        orderType: orderTypeId,
                        startAtStr: this.$changeDate(this.startDateStr, '-', 8),
                        endAtStr: this.$changeDate(this.endDateStr, '-', 8),
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
            // commandChange1 (commend) {
            //     this.pushFlagText = commend.item.text
            //     this.pushFlagId = commend.item.id
            // },
            commandChange2 (commend) {
                this.messageSourceText = commend.item.text
                this.messageSourceId = commend.item.id
            },
            commandChange3 (commend) {
                this.statusText = commend.item.text
                this.statusId = commend.item.id
            },
            commandChange4 (commend) {
                this.orderTypeText = commend.item.text
                this.orderTypeId = commend.item.id
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