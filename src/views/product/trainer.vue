<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="crumb">
                <span>训练师记录</span>
            </div>
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">用户名</div>
                        <div class="input-wrap"><input v-model.trim="curUserName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">用户地址</div>
                        <div class="input-wrap"><input v-model.trim="userAddress" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">上级用户名</div>
                        <div class="input-wrap"><input v-model.trim="refUserName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">上级用户地址</div>
                        <div class="input-wrap"><input v-model.trim="refAddress" type="text"></div>
                    </div>
                    <div class="search-box btns">
                        <div @click="resetFields()" class="btn black">清空</div>
                        <div class="btn" @click="search">查询</div>
                    </div>
                </div>
                <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
                    <div class="web-table">
                        <div class="center">
                            <div class="thead item-list">
                                <div class="li">ID</div>
                                <div class="li">用户名</div>
                                <div class="li">用户地址</div>
                                <div class="li">上级用户名</div>
                                <div class="li">上级用户地址</div>
                                <div class="li">有效训练次数</div>
                                <div class="li">下级训练师数量</div>
                                <div class="li">奖励SIE数量</div>
                                <div class="li">创建时间</div>
                                <div class="li">更新时间</div>
                            </div>
                            <div class="item-list table-list" v-for="(item, index) in list" :key="index">
                                <div class="flex-item">
                                    <div class="li">{{item.id}}</div>
                                    <div class="li">{{item.curUserName}}</div>
                                    <div class="li"><span>{{item.userAddress}}</span></div>
                                    <div class="li">{{item.refUserName}}</div>
                                    <div class="li"><span>{{item.refAddress}}</span></div>
                                    <div class="li">{{item.trainCount}}</div>
                                    <div class="li">{{item.trainerNumber}}</div>
                                    <div class="li">{{item.rewardTotal}}</div>
                                    <div class="li">{{item.createAtStr}}</div>
                                    <div class="li">{{item.updateAtStr}}</div>
                                </div>
                            </div>
                            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                                <img src="~@img/loading.gif" />
                            </div>
                        </div>
                    </div>
                </list-wrap>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        curUserName: '',
        userAddress: '',
        refUserName: '',
        refAddress: '',
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false
      }
    },
    methods: {
      resetFields () {
        this.curUserName = ''
        this.userAddress = ''
        this.refUserName = ''
        this.refAddress = ''
      },
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize) {
        this.loadShow = this
        if (this.total !== 0) {
          this.$fetch.post(`/trade/trainerRecord/queryTrainerRecordList`,{
            curUserName: this.curUserName,
            userAddress: this.userAddress,
            refUserName: this.refUserName,
            refAddress : this.refAddress,
            pageIndex: pageIndex || this.pageIndex,
            pageSize: pageSize || this.pageSize,
          }).then(res => {
            if (res.msg === '成功') {
              this.loadShow = false
              this.list = res.data.page.list
              this.total = res.data.page.totalCount
            }
          }) 
        }
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .wrap
        .crumb
            margin-bottom 0;
            display flex;
            align-items center;
            justify-content space-between
            padding-bottom 22px;
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
                .item-list
                    width 100%
                    height 64px
                    line-height 64px
                    display flex
                    align-items center
                    justify-content flex-start
                    &:nth-child(n+2)
                        display block
                        height auto
                        line-height normal
                        width 100%
                        .flex-item
                            width 100%
                            height 64px
                            line-height 64px
                            display flex
                            align-items center
                            justify-content flex-start
                        .on-the-details
                            min-height 0
                            opacity 0
                            overflow hidden
                            .info-box
                                width 100%
                                height 100%
                                padding 0 20px
                                background-color #fff
                                .item-flex-item
                                    display flex
                                    align-items center
                                    justify-content flex-start
                                    text-align center
                                    flex-direction row
                                    flex-flow wrap
                                    background-color #fff
                                    .li
                                        height auto
                                        padding 10px 0
                                        flex none
                                        width auto
                                        text-align left
                                        margin-right 80px
                                        @media screen and (max-width 1400px){
                                            margin-right 50px
                                        }
                                        @media screen and (max-width 1200px){
                                            margin-right 30px
                                        }
                    &:nth-child(odd)
                        background-color #F8F8FA
                    .li
                        flex 1
                        line-height 15px
                        width auto
                    .li
                        text-align center
                        &:nth-child(9)
                            padding-right 20px
                            @media screen and (max-width 1200px){
                                flex none
                                width 70px
                            }
                        &:last-child
                            padding-right 20px
                            @media screen and (max-width 1200px) {
                                flex none
                                width: 90px
                                padding-right 20px
                            }
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
                    .operation
                        color #2176ff
                        cursor pointer
                        display flex
                        align-items center
                        justify-content flex-start
                        .in-btn
                            border-right 1px solid #DCDFE6
                            padding-right 10px
                            &:nth-child(n+2)
                                padding-left 10px
                                &:hover
                                    color #121212
                            &:last-child
                                border-right none
                            .icon
                                display inline-block
                                width 10px
                                height 6px
                                background url("~@img/unfold.png") no-repeat center
                                background-size cover
                                margin-left 6px
                                transition all .2s linear
                                &.active
                                    transform rotate(180deg)
                    .item-table
                        width 100%
                        position relative
                        .on-the-details
                            position absolute
                            width 100%
                            height 80px
                            left 0
                            right 0
                            bottom -80px
                .table-list
                    height auto
        .dialog-modal
            position fixed
            width 100%
            height 100%
            top 0
            left 0
            right 0
            z-index 1000
            background-color rgba(0,0,0,.2)
            font-size 14px
            color #121212
            .content-box
                width 450px
                height 260px
                background-color #fff
                border-radius 4px
                position absolute
                top 50%
                left 50%
                transform translate(-50%,-50%)
                padding 22px 33px
                z-index 9999
                .item-li
                    width 100%
                    line-height 34px
                    display flex
                    align-items center
                    justify-content space-between
                    margin-bottom 30px
                    &:nth-child(1)
                        .title
                            font-size 16px
                        .input-text
                            width: 16px
                    &:last-child
                        .input-text
                            height 100%
                            display flex
                            align-items center
                            justify-content flex-end
                            .button
                                width: 80px
                                height: 34px
                                line-height 34px
                                text-align center
                                cursor pointer
                                &:nth-child(1)
                                    border 1px solid #e5e8ed
                                    color #121212
                                &:nth-child(2)
                                    background-color #2176ff
                                    color #fff
                                    margin-left 20px
                    .input-text
                        .close
                            width 16px
                            height: 16px
                            background url("~@img/close.svg") no-repeat center
                            background-size contain
                            cursor pointer
                        input
                            display inline-block
                            width 294px
                            height: 34px
                            border 1px solid #e5e8ed
                            border-radius 2px
                            padding 0 10px
                    .input-wrap
                        .el-dropdown-link
                            width: 294px;
                            height: 34px
                            display flex
                            align-items center
                            justify-content space-between
                            padding 0 10px
                            border 1px solid #e5e8ed

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
                .input-wrap
                    flex 1
            &:nth-child(8)
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

