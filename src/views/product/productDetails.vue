<template>
    <div class="c-page mar-right">
        <div class="wrap">
            <div class="crumb">
                <span> <span class="balck" @click="$router.push('/product/product')">查询产品</span> / 产品详情</span>
                <div class="new-add">
                    <span class="button" @click="putaway()">上架</span>
                    <span class="button" @click="save()">保存</span>
                </div>
            </div>
            <div class="main-content">
                <div class="from-table">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap"><input v-model="id" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品名称</div>
                        <div class="input-wrap"><input v-model.trim="name" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="typeCommand">
                                <span class="el-dropdown-link">
                                  {{typeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="item" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品图标</div>
                        <div class="input-wrap">
                            <span v-if="imgurl"><img class="commodity-icon" :src="imgurl" alt=""></span>
                            <span v-else>-</span>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品价格</div>
                        <div class="input-wrap"><input v-model="price" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">币种</div>
                        <div class="input-wrap"><input v-model="currency" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品介绍</div>
                        <div class="input-wrap"><input v-model="content" type="text"></div>
                       <!-- <textarea class="tarea" style="width: 300px; height: 90px"  v-html="contenten" v-model="contenten" placeholder='商品介绍'></textarea>-->
                    </div>
                    <div class="search-box">
                        <div class="label">创建时间</div>
                        <div class="input-wrap">{{createtime}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">更改时间</div>
                        <div class="input-wrap">{{updatetime}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="statusCommand">
                                <span class="el-dropdown-link">
                                  {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="item" v-for="(item,index) in statusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">续费金额</div>
                        <div class="input-wrap"><input v-model="renewalAmount" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">真实价格USD</div>
                        <div class="input-wrap"><input v-model="realTotal" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">真实续费价格USD</div>
                        <div class="input-wrap"><input v-model="realRenewTotal" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品英文名称</div>
                        <div class="input-wrap"><input v-model="nameen" type="text"></div>
                    </div>
                    <div class="search-box textarea">
                        <div class="label">商品英文介绍</div>
                        <textarea class="tarea" style="width: 300px; height: 150px;font-size: 13px;" v-model="contenten" placeholder='更新内容'>
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  /*import Dialog from '@/components/dialog/dialog'*/
  import Dialog from "../../components/dialog/dialog";

  export default {
    data() {
      return {
        id: this.$route.query.productId,
        detailData: '', ///待写赋值渲染
        name: '',
        currency: '',
        typeText: '',
        typeId: '',
        imgurl: '',
        price: '',
        content: '',
        createtime: '',
        updatetime: '',
        statusText: '',
        renewalAmount: '',
        realTotal: '',
        realRenewTotal: '',
        contenten: '',
        nameen: '',
        statusEnum: [],
        typeEnum: [],
        total: 0,
        loadShow: false
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      putaway () {
         if (this.statusText === '下架' && this.statusId === 2) {
           this.statusId = 1
           this.save (1)
         } else {
           Dialog({
             title: '此商品已上架'
           })
         }
      },
      getType () {
        this.$fetch.post(`/public/enumValue?classPackage=product.Product$StatusEnum;product.Product$TypeEnum&flag=false&state=1`).then((res) => {
          if (res.msg === '成功') {
            this.statusEnum = res.data.data.StatusEnum
            this.typeEnum = res.data.data.TypeEnum
            this.typeEnum.forEach((item) => {
              if (parseInt(this.typeId) === parseInt(item.id)) {
                this.typeText = item.text
              }
            })
            this.statusEnum.forEach((item) => {
              if (parseInt(this.statusId) === parseInt(item.id)) {
                this.statusText = item.text
              }
            })
          }
        })
      },
      /*3.2 查询产品详情
http://manager-pi.33333666666.com/product/product/preUpdateProduct*/
      getDetail() {
        this.$fetch.post(`/product/product/preUpdateProduct?id=${this.id}`).then((res) => {
           if (res.msg === '成功') {
             let detailData = res.data.resultData
             for(let i in detailData) {
               if (detailData[i] === null || detailData[i] === "") {
                 detailData[i] = '-'
               }
             }
             this.id = detailData.id
             this.name = detailData.name
             this.typeId = detailData.type
             this.imgurl = detailData.imgurl
             this.price = detailData.total
             this.currency = detailData.currency
             this.content = detailData.content
             this.createtime = detailData.createtime
             this.updatetime = detailData.updatetime
             this.statusId = detailData.status
             this.renewalAmount  = detailData.renewalAmount
             this.realTotal  = detailData.realTotal
             this.realRenewTotal  = detailData.realRenewTotal
             this.nameen  = detailData.nameen
             this.contenten  = detailData.contenten
             this.getType()
           }
        })
      },
      typeCommand (commend) {
        this.typeText = commend.text
        this.typeId = commend.id
      },
      statusCommand (commend) {
        this.statusText = commend.text
        this.statusId = commend.id
      },
      save (status) {
        let typeId = parseInt(this.typeId, 10) >= 0 ? parseInt(this.typeId, 10) : ''
        let statusId = parseInt(this.statusId, 10) >= 0 ? parseInt(this.statusId, 10) : ''
        this.$fetch.post(`/product/product/updateProduct`,{
          name: this.name,
          type: typeId,
          status: parseInt(status) === 1 ? status : statusId,
          imgUrl: this.imgUrl,
          total: this.price,
          currency: this.currency,
          content: this.content,
          renewalAmount: this.renewalAmount,
          realTotal: this.realTotal,
          realRenewTotal: this.realRenewTotal,
          nameen: this.nameen,
          contenten: this.contenten,
          id: this.id,
        }).then((res) => {
           if (res.msg === '修改成功') {
            Dialog({
              title: parseInt(status) === 1 ? '成功上架' : res.msg,
              okFn: () => {
                this.$router.push('/product/product')
              }
            })
           }
        })
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/css/var.less"
    .main-container
        padding 24px 20px 0 40px;
    .wrap
        background-color: @white;
        .crumb
            position: fixed;
            z-index: 99;
            top: 66px;
            right: 20px;
            left: 240px;
            display flex;
            align-items center;
            justify-content space-between
            padding-bottom: 44px;
            padding-top: 20px;
            margin-bottom: 0;
            color: #121212;
            background-color: #f3f6fc;
            .balck
               cursor pointer
               &:hover
                  color #121212
            .new-add
                width auto
                height 34px
                line-height 34px
                font-size 14px
                text-align center
                cursor pointer
                display flex
                align-items center
                background-color none
                justify-content flex-start
                .button
                    width 80px
                    height 34px
                    line-height 34px
                    text-align center
                    &:nth-child(1)
                        border-radius 4px
                        border 1px solid #2176ff
                        color #2176ff
                        margin-right 20px
                    &:nth-child(2)
                        background-color #2176ff
                        border-radius 4px
                        color #fff
        .main-content
            width 100%;
            background-color #fff;
            min-height calc(100vh - 147px);
            padding: 0 40px 0 24px;
            margin-top: 64px;
            .web-table
                padding-top 0
                td + td::before
                    display none
                & tr
                    &:first-child
                        background-color #edeff2 !important;
                        color @text !important;
    .from-table
        border-bottom none
        .search-box
            height 34px
            line-height 34px
            margin: 4px 0 15px;
            display flex
            align-items center
            justify-content flex-start
            .label
                min-width 114px
                font-size 14px
            .input-wrap
                height 34px
                margin-left 34px
                input
                    width 300px
                    height 100%
                    margin-right 0
                    border-radius 0
                .commodity-icon
                    display inline-block
                    width 30px
                    height 30px
                    text-align center
                    &:after
                        content '-'
                        display inline-block
                        color #121212
            .dropdown-wrap
                display: inline-block;
                width: 300px !important;
                height: 100% !important;
                border 1px solid #DCDFE6;
                .el-dropdown
                    width: 100%;
                    height: 100%;
                    line-height: 34px;
                    span
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding 0 6px
        .textarea
            height: 200px;
            .tarea
               resize:none;
               margin-left 35px
               padding  6px 6px

</style>

