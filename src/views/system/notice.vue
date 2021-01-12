<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <!--<div class="crumb">
                <span>公告</span>
                <div class="new-add" @click="$router.push({path: '/system/notice/noticeAdd',query:{}})">+ 新增</div>
            </div>-->
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model="id" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">标题</div>
                        <div class="input-wrap"><input v-model.trim="title" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{giveText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in activeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box btns">
                        <div @click="resetFields()" class="btn black">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                    <div class="search-box btns">
                        <div class="new-add" @click="$router.push({path: '/system/notice/noticeAdd',query:{}})">+ 新增</div>
                    </div>
                </div>
                <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
                    <div class="web-table">
                        <table class="center">
                            <tr class="thead">
                                <td width="6%">ID</td>
                                <td>标题</td>
                                <td>小标题</td>
                                <td width="15%">内容</td>
                                <td>类型</td>
                                <td>状态</td>
                                <td width="15%">发布人</td>
                                <td width="10%">备注</td>
                                <td width="10%">操作</td>
                            </tr>
                            <tr class="table-item" v-for="(item, index) in list" :key="index">
                                <td>{{item.id}}</td>
                                <td>{{item.title}}</td>
                                <td>{{item.smalltitle}}</td>
                               <!-- <td>{{item.content}}</td>-->
                                <td class="content-html" @click="contentText(item.content)" v-text="item.content">{{item.content}}</td>
                                <td>{{matchType(typeEnum,item.type)}}</td>
                                <td>{{matchType(activeEnum,item.active)}}</td>
                                <td>{{item.managerusername}}</td>
                                <td>{{item.remark}}</td>
                                <td class="cblue pointer"><router-link tag="a" :to="{path: '/system/notice/noticeDetails',query:{noticeId: item.id}}">查看</router-link></td>
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
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        total: 0,
        list: [],
        id: '',
        title: '',
        giveText: '全部',
        giveType: '',
        statusText: '全部',
        giveStatus: '',
        typeEnum: '',
        activeEnum: ''
      }
    },
    created () {
      this.getType()
    },
    methods: {
      resetFields () {
        this.id = ''
        this.title = ''
        this.giveText = ''
        this.statusText = ''
        this.giveStatus = ''
        this.giveStatus = ''
      },
      contentText (itemText) {
        if (itemText) {
          Dialog ({
            title: '内容',
            content: itemText,
            type: 'confirm'
          })
        }
      },
      getType () {
        this.$fetch.get(`public/enumValue?classPackage=system.Notice$TypeEnum;system.Notice$ActiveEnum&flag=true&state=1`).then((res) => {
          if (res.msg === '成功') {
            this.typeEnum = res.data.data.TypeEnum
            this.activeEnum = res.data.data.ActiveEnum
          }
        })
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.giveText = commend.item.text
          this.giveType = commend.item.id
        } else if (commend.index === 2) {
          this.statusText = commend.item.text
          this.giveStatus = commend.item.id
        }
      },
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize) {
        this.loadShow= true
        if (parseInt(this.total) !== 0) {
          this.$fetch.post(`/system/notice/queryNoticeList`, {
            id: this.id,
            title: this.title,
            type: this.giveType === 'selected' ? '': this.giveType,
            active: this.giveStatus === 'selected' ? '': this.giveStatus,
            pageIndex: pageIndex || this.pageIndex,
            pageSize: pageSize || this.pageSize,
          }).then((res) => {
            this.loadShow = false
            if (res.msg === '成功') {
              this.list = res.data.page.list
              this.total = res.data.page.totalCount
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .main-container
        padding 34px 20px 0 40px;
    .wrap
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
            padding 0px 40px 0px 24px;
            min-height calc(100vh - 156px);
            .web-table
                padding-top 0
                td + td::before
                    display none
                & tr
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
                    .content-html
                        word-break: break-all;
                        overflow:hidden; // 超出的文本隐藏
                        text-overflow:ellipsis; // 溢出用省略号显示
                        white-space:nowrap; // 溢出不换行
                        cursor pointer
                        p
                            width 150px !important
                            word-break: break-all !important;
                            overflow:hidden !important;  // 超出的文本隐藏
                            text-overflow:ellipsis !important; // 溢出用省略号显示
                            white-space:nowrap !important; // 溢出不换行
                            span
                              font-size 14px!important
                        &:hover
                           text-decoration underline
                           color #2176ff
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
</style>

