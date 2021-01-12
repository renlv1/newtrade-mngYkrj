<template>
    <div class="c-page media-wrap mar-right">
        <div class="wrap">
            <div class="crumb">
                <span>机器人设置</span>
                <div class="new-add" @click="dredge">开通AI</div>
            </div>
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model="id" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">用户名</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">账户地址</div>
                        <div class="input-wrap"><input v-model.trim="address" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{typeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">是否自动续费</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{isAuthText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in isAuthEnum" :key="index">{{item.text}}</el-dropdown-item>
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
                                    <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in statusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <!--备注:data组件-->
                    <div class="block">
                        <span class="demonstration">时间</span>
                        <el-date-picker
                                v-model="startDateStr"
                                type="datetime"
                                clear-icon="none"
                                clearable="clearable"
                                :picker-options="pickerBeginDateBefore"
                                placeholder="开始时间"
                                default-time="00:00:00">
                        </el-date-picker>
                        <span class="hr">-</span>
                        <el-date-picker
                                v-model="endDateStr"
                                :picker-options="pickerBeginDateAfter"
                                type="datetime"
                                clear-icon="none"
                                clearable="clearable"
                                placeholder="结束时间"
                                default-time="23:59:59">
                        </el-date-picker>
                    </div>
                    <div class="search-box">
                        <div class="label">训练师奖励</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{isRewardText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,4)" v-for="(item,index) in isRewardEnum" :key="index">{{item.text}}</el-dropdown-item>
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
                                <div class="li">达尔文昵称</div>
                                <div class="li">类型</div>
                                <div class="li">状态</div>
                                <div class="li">形象id</div>
                                <div class="li">是否自动续费</div>
                                <div class="li">备注</div>
                                <div class="li">训练师奖励</div>
                                <div class="li">操作</div>
                            </div>
                            <div class="item-list table-list" v-for="(item, index) in isListNull(list)" :key="index">
                                <div class="flex-item">
                                    <div class="li">{{item.id}}</div>
                                    <div class="li">{{item.username}}</div>
                                    <div class="li">{{item.nickname}}</div>
                                    <!--//类型 1：达尔文机器人 (productid)  2 祖冲之  3 PK  4 克莱因瓶-->
                                    <div class="li">{{matchType(typeEnum,item.type)}}</div>
                                    <!--//1:要开通  2：要续期 3:已经开通 4:开通中-->
                                    <div class="li">{{matchType(statusEnum,item.status)}}</div>
                                    <div class="li">{{item.image}}</div>
                                    <!--//1：不自动续费  2：自动续费-->
                                    <div class="li">{{matchType(isAuthEnum,item.isAuth)}}</div>
                                    <div class="li">{{item.remark || '-'}}</div>
                                    <!--//训练师奖励 0 未处理  1 已处理  2 无训练数据  3 无需处理-->
                                    <div class="li">{{matchType(isRewardEnum,item.isReward)}}</div>
                                    <div class="li operation">
                                        <div class="in-btn" v-if="unfoldActive === index && itemShow === true" @click="unfold(index +'2')">收起<i class="icon" :class="{'active':  unfoldActive === index && itemShow === true}"></i></div>
                                        <div class="in-btn" v-else @click="unfold(index)">展开<i class="icon"></i></div>
                                        <!--<router-link tag="a" class="in-btn" :to="{path:'/product/robot/productInformation',query: {detailId: item.id}}">产品信息</router-link>-->
                                        <span  class="in-btn" @click="closeAi(item)">关闭AI</span>
                                    </div>
                                </div>
                                <div class="on-the-details" :class="{'active': unfoldActive === index && itemShow}">
                                    <div class="info-box" v-if="unfoldActive === index && itemShow">
                                        <div class="item-flex-item">
                                            <div class="li">上次续费时间: {{item.lastTime || '-'}}</div>
                                            <div class="li">有效开始时间: {{item.userStartTime || '-'}}</div>
                                            <div class="li">有效结束时间: {{item.userEndTime || '-'}}</div>
                                            <div class="li">创建时间: {{item.createAt}}</div>
                                            <div class="li">更新时间: {{item.updateAt}}</div>
                                            <div class="li">账户地址: {{item.address}}</div>
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
            <div class="dialog-modal" v-show="modalShow">
                <div class="content-box">
                    <div class="item-li">
                        <div class="title">开通AI</div>
                        <div class="input-text"><div class="close" @click="closeModal"></div></div>
                    </div>
                    <div class="item-li">
                        <div class="title">用户名</div>
                        <div class="input-text"><input placeholder="用户名" v-model="aiName" type="text"></div>
                    </div>
                    <div class="item-li">
                        <div class="title">AI</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{aiText || '请选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,5)" v-for="(item,index) in aIarr" :key="index">{{item.name}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="item-li">
                        <div class="title"></div>
                        <div class="input-text">
                            <div class="button" @click="cancelFn">取消</div>
                            <div class="button" @click="affirmDredge()">确认</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        id: '',
        userName: '',
        address: '',
        typeText: '',
        typeId: '',
        isAuthText: '',
        isAuthId: '',
        statusText: '',
        statusId: '',
        startDateStr: '',
        endDateStr: '',
        isRewardText: '',
        isRewardId: '',
        unfoldActive: 0,
        itemShow: false,
        statusEnum: [],
        isAuthEnum: [],
        isRewardEnum: [],
        typeEnum: [],
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        unfoldText: '展开',
        showDialog: false,
        modalShow: false,
        aiName: '',
        aiText: '',
        aiProductId: '',
        aIarr: [],
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
        }
      }
    },
    created () {
      this.typeData()
    },
    methods: {
      resetFields () {
        this.id = ''
        this.userName = ''
        this.address = ''
        this.typeText = '全部'
        this.typeId = ''
        this.isAuthText = '全部'
        this.isAuthId = ''
        this.statusText = '全部'
        this.statusId = ''
        this.isRewardId = ''
        this.isRewardText = '全部'
        this.startDateStr = ''
        this.endDateStr = ''
        this.pageIndex = ''
      },
      typeData (){
        let url = '/public/enumValue?classPackage=product.DarwinSet$TypeEnum;product.DarwinSet$StatusEnum;product.DarwinSet$IsAuthEnum;product.DarwinSet$IsRewardEnum&flag=true&state=1'
        this.$fetch.post(`${url}`).then((res) => {
          if (res.msg === '成功') {
            this.statusEnum = res.data.data.StatusEnum
            this.isAuthEnum = res.data.data.IsAuthEnum
            this.isRewardEnum = res.data.data.IsRewardEnum
            this.typeEnum = res.data.data.TypeEnum
          }
        })
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.typeText = commend.item.text
          this.typeId = commend.item.id 
        } else if (commend.index === 2) {
          this.isAuthText = commend.item.text
          this.isAuthId = commend.item.id
        } else if (commend.index === 3) {
          this.statusText = commend.item.text
          this.statusId = commend.item.id
        } else if (commend.index === 4) {
          this.isRewardText = commend.item.text
          this.isRewardId = commend.item.id
        } else if (commend.index === 5) {
          this.aiText = commend.item.name
          this.aiProductId = commend.item.id
        }
      },
      search () {
        this.total = 1
        this.getData(1,10)
      },
      getData (pageIndex,pageSize){
        this.loadShow = true
        let objData ={
          pageIndex: pageIndex || this.pageIndex,
          pageSize: pageSize || this.pageSize,
        }
        if (this.id) objData.id = this.id
        if (this.userName) objData.username = this.userName
        if (this.address) objData.address = this.address
        objData.type = this.typeId === 'selected' ? '' : this.typeId 
        objData.isAuth = this.isAuthId === 'selected' ? '' : this.isAuthId
        objData.status = this.statusId === 'selected' ? '' : this.statusId
        objData.isReward = this.isRewardId === 'selected' ? '' : this.isRewardId
        if (this.startDateStr) objData.startDateStr = this.$changeDate(this.startDateStr, '-', 8)
        if (this.endDateStr) objData.endDateStr = this.$changeDate(this.endDateStr, '-', 8)
        if (parseInt(this.total) !== 0) {
          this.$fetch.post(`/product/darwinSet/queryDarwinSetList`,objData).then((res) =>{
            this.loadShow = false
            this.list = res.data.page.list
            this.total = res.data.page.totalCount
            if (this.list.length > 0) {
              this.$fetch.post(`/product/darwinSet/getAiProducts?id=${parseInt(this.list[0].id)}`).then((res) => {
                if (res.msg === '成功'){
                  this.aIarr = res.data.resultData
                }
              })
            }
          })
        }
      },
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
      dredge () {
        this.modalShow = true
        if (this.list.length <= 0) {
          this.search()
        }
      },
      closeModal () {
        this.modalShow = false
        this.aiText = ''
        this.aiName = ''
      },
      closeAi (item) {
        Dialog({
          title: '确认关闭AI?',
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`/product/darwinSet/updateDarwinSetList?id=${parseInt(item.id)}`).then((res) => {
              if (res.msg === '修改成功') {
                Dialog({
                  title: res.msg
                })
                this.search()
              } else {
                Dialog({
                  title: res.msg
                })
              }
            })
          }
        })
      },
      affirmDredge () {
        let productId = parseInt(this.aiProductId, 10) >= 0 ? parseInt(this.aiProductId, 10) : ''
        this.$fetch.post(`/product/darwinSet/userOpenAi`,{
          userName: this.aiName,
          productId: productId
        }).then((res) => {
          this.search()
        })
      },
      cancelFn () {
        this.modalShow = false
        this.aiName = ''
      }
    }
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
            padding 0px 40px 0px 24px;
            min-height calc(100vh - 187px);
            .web-table
                padding-top 0
                .item-list
                    width 100%
                    height 64px
                    line-height 64px
                    display flex
                    align-items center
                    justify-content flex-start
                    padding-bottom 0
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
                                    flex-wrap wrap
                                    text-align center
                                    background-color #fff
                                    .li
                                        height auto
                                        line-height 64px
                                        flex none
                                        width auto
                                        text-align left
                                        margin-right 100px
                                        @media screen and (max-width 1200px){
                                            margin-right 50px
                                        }
                    &:nth-child(odd)
                        background-color #F8F8FA
                    .li
                        flex 1
                        line-height 15px
                        width auto
                    .li
                        text-align center
                        /*padding-left 20px*/
                        &:nth-child(1)
                           @media screen and (max-width 1200px){
                               flex none
                               width 40px
                           }
                        &:nth-child(2)
                            @media screen and (max-width 1200px){
                                flex none
                                width 70px
                            }
                        &:nth-child(3)
                            @media screen and (max-width 1200px){
                                flex none
                                width 80px
                            }
                        &:last-child
                           flex none
                           width 130px
                           /*@media screen and (max-width 1200px) {
                               width 164px
                           }*/
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
                            @media  screen and (max-width 1200px) {
                                width: 48px
                                padding 0 6px
                            }
                            &:nth-child(1)
                                @media  screen and (max-width 1200px) {
                                    width: 58px
                                    padding-right 0
                                    padding-left 0
                                }
                            &:nth-child(n+2)
                                padding-left 6px
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
                width auto !important
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


