<template>
    <!--api完成-->
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
                        <div class="label">状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange2">
                            <span class="el-dropdown-link">
                              {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in statusArr" :key="index">
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
                              {{pairTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in typeArr" :key="index">
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
                    <div class="search-box btns">
                        <div class="btn" @click="addFn">新增</div>
                        <div class="btn" @click="bodify">修改</div>
                    </div>
                </div>
                <!--        绑定展示列表数据        -->
                <el-table
                        :data="list"
                        border
                        class="table-w-a"
                        :highlight-current-row="true"
                        tooltip-effect="dark"
                        @row-click="itemDetail"
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="ID">
                    </el-table-column>
                    <el-table-column
                            prop="tradeCurrency"
                            label="交易货币">
                    </el-table-column>
                    <el-table-column
                            prop="baseCurrency"
                            label="基础货币">
                    </el-table-column>
                    <el-table-column
                            label="状态">
                        <template slot-scope="scope">{{statusFn(scope.row.status)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="类型">
                        <template slot-scope="scope">{{typeFn(scope.row.pairType)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="minEntrustNum"
                            label="最小委托数">
                    </el-table-column>
                    <el-table-column
                            prop="buyFeeRate"
                            label="买入交易费率">
                    </el-table-column>
                    <el-table-column
                            prop="sellFeeRate"
                            label="卖出交易费率">
                    </el-table-column>
                    <el-table-column
                            prop="currencyNetStr"
                            label="链名称">
                    </el-table-column>
                    <el-table-column
                            label="是否含有标签">
                        <template slot-scope="scope">{{flagFn(scope.row.tipFlag)}}</template>
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
                <table-pagination
                        :list="list"
                        :total="total"
                        :pageSize="pageSize"
                        @change="getData"
                ></table-pagination>
            </div>
        </div>
        <!-- 新增/修改弹窗-->
        <v-dialog2
                @okFn="okFn"
                :okFlag="okFlag"
                @cancelFn="cancelFn"
                ref="dialog"
                :title="dialogTitle"
                class="dialog-t">
            <div class="v-box">
                <div class="search-box">
                    <div class="label">交易货币</div>
                    <div class="input-wrap"><input v-model.trim="tradeCurrency"  type="text" placeholder="交易货币(必须是大写字母)" ></div>
                </div>
                <div class="search-box">
                    <div class="label">基础货币</div>
                    <div class="input-wrap"><input v-model.trim="baseCurrency" type="text" placeholder="基础货币(必须是大写字母)" ></div>
                </div>
                <div class="search-box">
                    <div class="label">状态</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="commandChange2">
                            <span class="el-dropdown-link">
                              {{statusText2 || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                              {{pairTypeText2 || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in typeArr" :key="index">
                                    {{item.text}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">最小委托数</div>
                    <div class="input-wrap">
                        <input v-model.trim="minEntrustNum" type="number" placeholder="最小委托数" >
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">买入交易费率</div>
                    <div class="input-wrap">
                        <input v-model.trim="buyFeeRate"  type="number" placeholder="买入交易费率" >
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">卖出交易费率</div>
                    <div class="input-wrap">
                        <input v-model.trim="sellFeeRate"  type="number" placeholder="卖出交易费率" >
                    </div>
                </div>
                <div class="msg-t">{{errMsg}}</div>
            </div>
        </v-dialog2>
    </div>
</template>

<script>
    /*import Dialog from '@/components/dialog/dialog'*/
    import log from "../user/log";
    export default {
        data() {
            return {
                list: [],
                total: 0,
                pageIndex: 1,
                pageSize: 20,
    
                loadShow: false,
                itemShow: false,
                id: '',
                statusText: '',
                statusId: '',
                pairTypeText: '',
                pairTypeId: '',
                unfoldActive: 0,
                typeArr: [],
                statusArr: [],
    
                okFlag: false,
                dialogTitle: '新增币种货币对',
                errMsg: '',
                // 新增
                tradeCurrency: '', // 交易货币
                baseCurrency: '', // 基础货币
                minEntrustNum: '',
                buyFeeRate: '',
                sellFeeRate: '',
                statusId2: '',
                statusText2: '',
                pairTypeText2: '',
                pairTypeId2: '',
                flag: -1,
                // 获取每项列表数据
                itemObj: {},
                itemId: ''
            }
        },
        created() {  // 进入页面就加载
            this.getType()
        },
        methods: {   // 存储可调用函数方法
            itemDetail (item) {
              this.itemObj = item
              this.itemId = item.id
              this.tradeCurrency = item.tradeCurrency
              this.baseCurrency = item.baseCurrency
              this.minEntrustNum = item.minEntrustNum
              this.buyFeeRate = item.buyFeeRate
              this.sellFeeRate = item.sellFeeRate
              this.statusId2 = item.status
              this.pairTypeId2 = item.pairType
              // 获取选中项的状态
              for (let i in this.statusArr){
                if (parseInt(item.status) === parseInt(this.statusArr[i].id)) {
                    this.statusText2  = this.statusArr[i].text
                }
              }
              // 获取选中项的类型
              for (let i in this.typeArr){
                if (parseInt(item.pairType) === parseInt(this.typeArr[i].id)) {
                  this.pairTypeText2 = this.typeArr[i].text
                }
              }
            },
            addFn () {
              this.$refs.dialog.show()
              this.flag = 1
            },
            bodify () {
              if (!this.itemId) {
                this.$message.error('只能选择一条记录')
                return
              }
              this.$refs.dialog.show()
              this.flag = 2
            },
              test () {
               let regu = /^[A-Z]+$/
                if (this.tradeCurrency === ''){
                  this.errMsg = '请输入交易货币!'
                  return false
                }
                if (this.baseCurrency === '') {
                  this.errMsg = '请输入基础货币!'
                  return false
                }
                if (!regu.test(this.tradeCurrency) && this.tradeCurrency !== '') {
                  this.errMsg = '交易货币必须是大写字母!'
                  return false
                }
                if (!regu.test(this.baseCurrency) && this.baseCurrency !== ''){
                  this.errMsg = '基础货币必须是大写字母!'
                  return false
                }
                if (this.minEntrustNum === ''){
                  this.errMsg = '请输入最小委托数!'
                  return false
                }
                if (this.buyFeeRate === ''){
                  this.errMsg = '请输入买入交易费率!'
                  return false
                }
                if (this.sellFeeRate === ''){
                  this.errMsg = '请输入卖出交易费率!'
                  return false
                }
                if (this.pairTypeId2 === '') {
                  this.errMsg = '请选择类型!'
                  return false
                }
                if (this.statusId2 === '') {
                  this.errMsg = '请选择状态!'
                  return false
                }
                return true
              },
            okFn () {
              if (this.test()) {
                 this.errMsg = ''
                if (this.flag === 1) { // 新增
                  this.$fetch.post('/currency/ccPair/addCcPair',{
                    tradeCurrency: this.tradeCurrency,
                    baseCurrency: this.baseCurrency,
                    minEntrustNum: this.minEntrustNum,
                    buyFeeRate: this.buyFeeRate,
                    sellFeeRate: this.sellFeeRate,
                    status: parseInt(this.statusId2, 10) >= 0 ? parseInt(this.statusId2, 10) : '',
                    pairType: parseInt(this.pairTypeId2,10) >= 0 ? parseInt(this.pairTypeId2,10) : '',
                  }).then(res => {
                    if (res.code === 0) {
                      this.$message.success(res.msg)
                      this.okFlag = false
                      this.$refs.dialog.hide()
                    }else {
                      this.$message.error(res.msg)
                    }
                  })
                }
                if (this.flag === 2) { // 修改
                  let obj = this.itemObj
                  this.$fetch.post('/currency/ccPair/updateCcPair',{
                    id: obj.id,
                    tradeCurrency: this.tradeCurrency,
                    baseCurrency: this.baseCurrency,
                    minEntrustNum: this.minEntrustNum,
                    buyFeeRate: this.buyFeeRate,
                    sellFeeRate: this.sellFeeRate,
                    status: parseInt(this.statusId2, 10) >= 0 ? parseInt(this.statusId2, 10) : '',
                    pairType: parseInt(this.pairTypeId2,10) >= 0 ? parseInt(this.pairTypeId2,10) : '',
                  }).then(res => {
                    if (res.code === 0) {
                      this.$message.success(res.msg)
                      this.okFlag = false
                      this.$refs.dialog.hide()
                      this.search()
                    }else {
                      this.$message.error(res.msg)
                    }
                  })
                }
              }
            },
            cancelFn () { // 取消清空
              this.tradeCurrency = ''
              this.baseCurrency = ''
              this.minEntrustNum = ''
              this.buyFeeRate = ''
              this.sellFeeRate = ''
              this.pairTypeId2 = ''
              this.statusId2 = ''
              this.errMsg = ''
            },
            statusFn (item) {
                if (item !== null && item > -1 && this.statusArr.length > 0) {
                    return this.statusArr[item].text
                }
                return '-'
            },
            typeFn (item) {
                if (item !== null && item > -1 && this.typeArr.length > 0) {
                    return this.typeArr[item].text
                }
                return '-'
            },
            flagFn (item) {
                if (item !== null){
                    if (item === 1){
                        return "是"
                    }
                    if (item === 2){
                        return "不是"
                    }
                    return '-'
                }
                return '-'
            },

            resetFields() {
                this.id = ''
                this.userName = ''
                this.statusText = ''
                this.statusId = ''
                this.pairTypeText = ''
                this.pairTypeId = ''
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
                let url = '/public/enumValue?classPackage=currencytrade.CoinCurrencyPair$StatusEnum;currencytrade.CoinCurrencyPair$PairTypeEnum&flag=true&state=1'
                this.$fetch.post(`${url}`).then((res) => {
                    if (res.code === 0) {
                        this.typeArr = res.data.data.PairTypeEnum
                        this.statusArr = res.data.data.StatusEnum
                    }
                })
            },
            search() {
                this.total = 1
                this.getData(1, this.pageSize)
            },
            getData(pageIndex, pageSize) {
                this.loadShow = true
                let statusId = this.statusId > -1 ? this.statusId : ''
                let pairTypeId = this.pairTypeId > -1 ? this.pairTypeId : ''
                if (this.total !== 0) {
                    this.$fetch.post(`/currency/ccPair/queryCcPairList`, {
                        id: this.id,
                        status: statusId,
                        pairType: pairTypeId,
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
              if (commend.index === 3) {
                this.pairTypeText2 = commend.item.text
                this.pairTypeId2 = commend.item.id
              } else if (commend.index === 2) {
                this.pairTypeText = commend.item.text
                this.pairTypeId = commend.item.id
              }
            },
            commandChange2 (commend) {
              if (commend.index === 1) {
                this.statusText = commend.item.text
                this.statusId = commend.item.id
              }else if (commend.index === 2) {
                this.statusText2 = commend.item.text
                this.statusId2 = commend.item.id              
              }
            }
        },
        components: {
            tablePagination: require('@/components/tablePagination').default,
            vDialog2: require('@/components/dialog2.vue').default
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
        .g-dialog-wrap
            .search-box
                height: 40px
                line-height 40px
                .label
                  width 100px
                .input-wrap
                  flex 1
                  input
                     display block
                     width 100%
                     height 100%
                .dropdown-wrap
                   height 40px !important
                   line-height 40px !important
                   border 1px solid #e5e8ed
                   padding 0 10px
            .msg-t
              color #ff5032
              padding-left 100px
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