<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="crumb">
                <span>训练记录</span>
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
                    <div class="search-box">
                        <div class="label">开通AI订单</div>
                        <div class="input-wrap"><input v-model="orderAiId"  type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">奖励类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{rewardTypeText  || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item,index) in rewardTypeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">奖励是否发放</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{isRewardText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in isRewardEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
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
                               <div class="li">上级用户有效训练次数</div>
                               <div class="li">奖励SIE数量</div>
                               <div class="li">奖励发放</div>
                               <div class="li">奖励类型</div>
                               <div class="li">操作</div>
                            </div>
                            <div class="item-list table-list" v-for="(item, index) in list" :key="index">
                               <div class="flex-item">
                                   <div class="li">{{item.id}}</div>
                                   <div class="li">{{item.curUserName}}</div>
                                   <div class="li"><span>{{item.userAddress}}</span></div>
                                   <div class="li">{{item.refUserName}}</div>
                                   <div class="li"><span>{{item.refAddress}}</span></div>
                                   <div class="li">{{item.trainCount}}</div>
                                   <div class="li">{{item.rewardAmount}}</div>
                                   <div class="li">{{matchType(isRewardEnum,item.isReward)}}</div>
                                   <div class="li">{{matchType(rewardTypeEnum,item.rewardType)}}</div>
                                   <div class="li unfold" >
                                       <span class="in-btn" v-if="unfoldActive === index && itemShow === true" @click="unfold(index +'2')">收起<i class="icon" :class="{'active':  unfoldActive === index && itemShow === true}"></i></span>
                                       <span class="in-btn" @click="unfold(index)" v-else>展开<i class="icon"></i></span>
                                   </div>
                               </div>
                               <div class="on-the-details" :class="{'active': unfoldActive === index && itemShow}">
                                    <div class="info-box" v-if="unfoldActive === index && itemShow">
                                        <div class="item-flex-item">
                                            <div class="li">AI订单id: {{item.orderId}}</div>
                                            <div class="li">创建时间: {{item.createAt}}</div>
                                            <div class="li">更新时间: {{item.updateAt}}</div>
                                        </div>
                                    </div>
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
  /*import Dialog from '@/components/dialog/dialog'*/
  export default {
    data() {
      return {
        curUserName: '',
        userAddress: '',
        refUserName: '',
        refAddress: '',
        isRewardText: '',
        isRewardId: '',
        rewardTypeText: '',
        rewardTypeId: '',
        orderAiId: '',
        orderId: '',
        isRewardEnum: [],
        rewardTypeEnum: [],
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        unfoldActive: 0,
        itemShow: false,
      }
    },
    created () {
      this.getType()
    },
    methods: {
      unfold (index) {
        this.unfoldActive = index
        this.itemShow = !this.itemShow
        if (this.unfoldActive !== index && this.itemShow === false) {
          this.itemShow = true
        }
        if (this.unfoldActive === index && this.itemShow === false) {
          this.itemShow = true
        }
        if (this.unfoldActive === index +'2' && this.itemShow === true) {
          this.itemShow = false
        }
      },
      getType() {
        let url = '/public/enumValue?classPackage=trade.TrainLog$isRewardEnum;trade.TrainLog$rewardTypeEnum&flag=true&state=1'
        this.$fetch.post(`${url}`).then(res => {
          if (res.msg === '成功') {
            this.isRewardEnum = res.data.data.isRewardEnum
            this.rewardTypeEnum = res.data.data.rewardTypeEnum
          }
        })
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.rewardTypeText = commend.item.text
          this.rewardTypeId = commend.item.id
        } else if (commend.index === 2) {
          this.isRewardText = commend.item.text
          this.isRewardId = commend.item.id
        } 
      },
      resetFields () {
        this.rewardTypeId = ''
        this.orderId = ''
        this.orderAiId = ''
        this.isRewardId = ''
        this.isRewardText = '全部'
        this.rewardTypeText = '全部'
        this.curUserName = ''
        this.userAddress = ''
        this.refUserName = ''
        this.refAddress = ''
        this.isReward = ''
      },
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize) {
        this.loadShow = true
        let rewardType = this.rewardTypeId === 'selected' ? '' : this.rewardTypeId
        let isRewardId = this.isRewardId === 'selected' ? '' : this.isRewardId
        if (this.total !== 0) {
          this.$fetch.post(`/trade/trainLog/queryTrainLogList`,{
            curUserName: this.curUserName,
            userAddress: this.userAddress,
            refUserName: this.refUserName,
            refAddress: this.refAddress,
            isReward: isRewardId,
            rewardType: rewardType,
            orderId: this.orderAiId,
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
            padding-bottom 22px;
            margin-bottom 0;
        .main-content
            width 100%;
            background-color #fff;
            padding 0 40px 0 24px;
            min-height calc(100vh - 147px);
            .web-table
                padding-top 0
                &.emptyActive
                    min-height 60px
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
                                .item-flex-item
                                    display flex
                                    align-items center
                                    justify-content center
                                    text-align center
                                    padding 0 22px
                                    .li
                                        width auto
                                        height auto
                                        padding 22px 0
                                        text-align left
                                        flex none
                                        margin-right 100px
                                        @media screen and (max-width 1200px) {
                                            margin-right 50px
                                        }
                                        &:nth-child(1)
                                            padding-left 0
                    &:nth-child(odd)
                        background-color #F8F8FA
                    .li
                        flex 1
                        line-height 15px
                        width auto
                    .li
                        flex 1
                        text-align center
                        &:nth-child(1)
                            padding-left 20px
                            @media screen and (max-width 1200px){
                                flex none
                                width 60px
                            }
                        &:nth-child(2)
                            @media screen and (max-width 1200px){
                                padding-right 10px
                            }
                        &:nth-child(3)
                            flex none
                            width 160px
                            @media screen and (max-width 1200px){
                                width 130px
                            }
                            span
                               display inline-block
                               width 130px
                               @media screen and (max-width 1200px){
                                    width 100px
                               }
                        &:nth-child(5)
                            flex none
                            width 160px
                            @media screen and (max-width 1200px){
                                width 130px
                            }
                            span
                                display inline-block
                                width 130px
                                @media screen and (max-width 1200px){
                                    width 100px
                                }
                        &:nth-child(n+5)
                            @media screen and (max-width 1200px)
                                margin-right 4px
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
                    .unfold
                        color #2176ff
                        cursor pointer
                        display flex
                        align-items center
                        justify-content center
                        .in-btn
                            border-right 1px solid #DCDFE6
                            padding-right 10px
                            &:nth-child(n+2)
                                padding-left 10px
                                @media screen and (max-width 1200px)
                                    display inline-block
                                    width 48px
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

