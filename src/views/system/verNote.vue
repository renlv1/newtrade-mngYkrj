<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="crumb">
                <span>版本更新记录</span>
                <div class="new-add" @click="$router.push({path: '/system/verNote/addNewVersion',query:{}})">+ 新增</div>
            </div>
            <div class="main-content">
                <div class="search verNote">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model="id" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">APP名称</div>
                        <div class="input-wrap"><input v-model.trim="appName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item,index) in typeEnum"  :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">是否必须更新</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{updateText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in mustUpdateEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">版本状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{versionsText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 3)" v-for="(item,index) in versionStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="block">
                        <div class="demonstration">时间 </div>
                            <el-date-picker
                                    clear-icon="none"
                                    clearable="clearable"
                                    v-model="startDateStr"
                                    :picker-options="pickerBeginDateBefore"
                                    type="datetime"
                                    placeholder="开始时间"
                                    default-time="00:00:00">
                            </el-date-picker>
                            <span class="hr">-</span>
                            <el-date-picker
                                clear-icon="none"
                                clearable="clearable"
                                v-model="endDateStr"
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
                        <table class="center">
                            <tr class="thead">
                                <td width="6%">ID</td>
                                <td>APP名称</td>
                                <td>标题</td>
                                <td>版本状态</td>
                                <td>创建时间</td>
                                <td width="15%">是否必须更新</td>
                                <td>安卓版本号</td>
                                <td>ios版本号</td>
                                <td width="15%">类型</td>
                                <td width="10%">下载地址</td>
                                <td width="10%">操作</td>
                            </tr>
                            <tr v-for="(item, index) in list" :key="index">
                                <td>{{item.id}}</td>
                                <td>{{item.appname}}</td>
                                <td>{{item.title}}</td>
                                <td>{{matchType(versionStatusEnum,item.versionStatus)}}</td>
                                <td>{{item.createtime}}</td>
                                <td>{{matchType(mustUpdateEnum,item.mustupdate)}}</td>
                                <td>{{item.versioncode}}</td>
                                <td>{{item.version}}</td>
                                <!--//1:ios 2:安卓  3:IOS企业版 4:windows客户端 5:mac客户端-->
                                <td>{{matchType(typeEnum,item.type)}}</td>
                                <td>{{item.url}}</td>
                                <td class="cblue pointer"><router-link tag="a" :to="{path: '/system/verNote/verNoyeDetails',query:{verNoteId: item.id}}">详情</router-link></td>
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
  /*import Dialog from '@/components/dialog/dialog'*/
  export default {
    data() {
      return {
        id: '',
        appName: '',
        statusText: '',
        updateText: '',
        versionsText: '',
        statusId: '',
        updateId: '',
        versionsId: '',
        startDateStr: '',
        endDateStr: '',
        typeEnum: [],
        mustUpdateEnum: [],
        versionStatusEnum: [],
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
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
    methods: {
      resetFields () {
        this.id = ''
        this.appName = ''
        this.statusText = '全部'
        this.statusId = ''
        this.updateText = '全部'
        this.updateId = ''
        this.versionsText = '全部'
        this.versionsId = ''
        this.startDateStr = ''
        this.endDateStr = ''
        this.startDateStr = ''
        this.endDateStr = ''
      },
      getType () {
        this.$fetch.post(`public/enumValue?classPackage=system.Version$TypeEnum;system.Version$MustupdateEnum;system.Version$VersionStatusEnum&flag=true&state=1`).then((res) => {
          if(res.msg === '成功') {
            this.mustUpdateEnum =res.data.data.MustupdateEnum
            this.versionStatusEnum =res.data.data.VersionStatusEnum
            this.typeEnum = res.data.data.TypeEnum
          }
        })
      },
      statusCommand (commend) {
        this.statusText = commend.text
        this.statusId = commend.id
      },
      updateCommand (commend) {
        this.updateText = commend.text
        this.updateId = commend.id
      },
      versionsCommand (commend) {
        this.versionsText = commend.text
        this.versionsId = commend.id
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.statusText = commend.item.text
          this.statusId = commend.item.id
        } else if (commend.index === 2) {
          this.updateText = commend.item.text
          this.updateId = commend.item.id
        } else if (commend.index === 3) {
          this.versionsText = commend.item.text
          this.versionsId = commend.item.id
        }
      },
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
        if (this.id) objData.id = this.id
        if (this.appName) objData.appname = this.appName
        objData.type = this.statusId === 'selected' ? '' : this.statusId
        objData.mustupdate = this.updateId === 'selected' ? '' : this.updateId
        objData.versionStatus = this.versionsId === 'selected' ? '' : this.versionsId
        if (this.startDateStr) objData.startAtStr = this.$changeDate(this.startDateStr, '-', 8)
        if (this.endDateStr) objData.endAtStr = this.$changeDate(this.endDateStr, '-', 8)
        if (parseInt(this.total) !== 0) {
           this.$fetch.post(`system/version/queryVersionList`,objData).then((res) => {
             this.loadShow = false
             if (res.msg === '成功') {
               this.list = res.data.page.list
               this.total = res.data.page.totalCount
             }
           }).catch(err => {
             this.loadShow = false
           })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/css/var.styl"
    .main-container
        padding 34px 20px 0 40px;
    .wrap
        background-color: @white;
        .crumb
            display flex;
            align-items center;
            justify-content space-between
            padding-bottom 22px;
            margin-bottom 0
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
                td + td::before
                    display none
                & tr
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
    .search
        position relative
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content flex-start
        border-bottom none
        .search-box
            width 318px
            height 34px
            line-height 34px
            margin: 4px 0 15px;
            display flex
            align-items center
            &:nth-child(6)
                width 22%
                .label
                   width auto !important
                   padding-right 4px
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

