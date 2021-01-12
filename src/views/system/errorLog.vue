<template>
    <!--api-->
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <!--<div class="crumb">
                <span>错误日志</span>
            </div>-->
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">用户名</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">异常方法</div>
                        <div class="input-wrap"><input v-model.trim="method" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">异常类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                  {{type || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="item" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
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
                        <div @click="resetClear()" class="btn black">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
                <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
                    <div class="web-table">
                        <table class="center">
                            <tr class="thead">
                                <td width="8%">ID</td>
                                <td width="8%">用户名</td>
                                <td width="15%">异常信息</td>
                                <td>异常类型</td>
                                <td>异常类</td>
                                <td width="15%">异常方法</td>
                                <td width="10%">备注</td>
                                <td width="10%">创建时间</td>
                            </tr>
                            <tr v-for="(item, index) in list" :key="index">
                                <td>{{item.id}}</td>
                                <td>{{item.userName || '-'}}</td>
                                <td class="errorContent"> <span @click="contentText(item.errorContent)" v-html="item.errorContent"></span></td>
                                <td>{{matchType(typeEnum,item.type)}}</td>
                                <td>{{item.className}}</td>
                                <td>{{item.method}}</td>
                                <td>{{item.remark}}</td>
                                <td>{{item.createAt}}</td>
                            </tr>
                            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                                <img src="~@img/loading.gif" />
                            </div>
                        </table>
                    </div>
                </list-wrap>
            </div>
        </div>
    </div>
</template>

<script>
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        userName: '',
        method: '',
        arbitrageid: '',
        type: '',
        giveType: '',
        giveStatus: '',
        status: '全部',
        statusEnum: [],
        typeEnum: [],
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        total: 0,
        startDateStr: '',
        endDateStr: '',
        list: [],
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
    methods: {
      resetClear () {
        this.id = ''
        this.arbitrageid = ''
        this.type = '全部'
        this.status = '全部'
        this.giveType = ''
        this.giveType = ''
        this.giveStatus = ''
        this.method = ''
        this.userName = ''
        this.startDateStr = ''
        this.endDateStr = ''
      },
      contentText (itemText) {
        if (itemText) {
          Dialog ({
            title: '异常信息',
            content: itemText,
            type: 'confirm'
          })
        }
      },
      getType () {
        this.$fetch.post(`/public/enumValue?classPackage=system.ErrorLog$TypeEnum&flag=true&state=1`).then((res) => {
          if (res.msg === '成功') {
            this.typeEnum = res.data.data.TypeEnum
          }
        })
      },
      // 异常类型
      handleCommand(command) {
        this.type = command.text
        this.giveType = command.id
      },
      typeFn (length) {
        let text = ''
        if (this.typeEnum) {
           this.typeEnum.forEach(item => {
              if (parseInt(item.id) === parseInt(length)) {
                text = item.text
              }
           })
        }
        return text
      },
      // 查询
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize) {
        this.loadShow = true
        let objData ={
          pageIndex: pageIndex || this.pageIndex,
          pageSize: pageSize || this.pageSize,
        }
        if (this.userName) objData.userName = this.userName
        if (this.method) objData.method = this.method
        objData.type = this.giveType === 'selected' ? '': this.giveType 
        if (this.startDateStr) objData.startAtStr = this.$changeDate(this.startDateStr, '-', 8)
        if (this.endDateStr) objData.endAtStr = this.$changeDate(this.endDateStr, '-', 8)
        if (parseInt(this.total) !== 0) {
          this.$fetch.get(`/system/errorLog/queryErrorLogList`,objData).then((res) => {
            if (res.msg === '成功') {
              this.loadShow = false
              this.list = res.data.page.list
              this.total = res.data.page.totalCount
            } else {
              Message.error (res.msg)
            }
          })
        }
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/css/var.less"
    .main-container
        padding 0 20px 0 0;
    .wrap
        background-color: @white;
        .crumb
            padding-bottom 22px;
            margin-bottom 0
        .main-content
            width 100%;
            background-color #fff;
            padding 0 40px 0 24px;
            min-height calc(100vh - 147px);
            .web-table
                td + td::before
                    display none
                & tr
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
                td
                    &:nth-child(6)
                        @media screen and (max-width 1200px)
                            flex none
                            width 80px
                    &:nth-child(7)
                        @media screen and (max-width 1200px)
                            flex none
                            width 80px
                .errorContent
                    span
                        display inline-block
                        word-break: break-all;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:2;
                        &:hover
                          color #2176ff
                          text-decoration underline
                           
    .search
        position relative
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content flex-start
        .search-box
            width 318px
            height 34px
            line-height 34px
            margin: 4px 0 15px;
            display flex
            align-items center
            &:nth-child(5)
                .input-wrap
                    margin-right 0
            &:nth-child(7)
                .input-wrap
                    flex none
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
