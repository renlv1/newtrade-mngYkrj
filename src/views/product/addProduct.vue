<template>
    <div class="c-page mar-right">
        <div class="wrap">
            <div class="crumb">
                <span><span class="balck" @click="$router.push('/product/product')">查询产品</span> / 新增产品</span>
                <div class="new-add">
                    <span class="err" style="color: #ff2769;padding-right: 10px">{{error1}} </span><span class="button" @click="addSave()">保存</span>
                </div>
            </div>
            <div class="main-content">
                <div class="from-table">
                    <div class="search-box">
                        <div class="label">商品名称</div>
                        <div class="input-wrap"><input v-model.trim="name" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="typeCommand">
                                <span class="el-dropdown-link">
                                  {{typeText || '请选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="item" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品图标</div>
                        <div class="input-wrap logo-box">
                           <!-- <span class="logoImg" v-show="functionImage"><img class="commodity-icon" :src="functionImage" alt=""></span>-->
                            <span class="logoImg" v-show="surfaceImage"><img class="commodity-icon" :src="surfaceImage" alt=""></span>
                            <span class="logo-btn">
                                 <input @change="uploadImg($event)" ref="uploadFile" type="file" id="uploadFile" accept="image/*" multiple="multiple" />
                                上传图片
                            </span>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品价格</div>
                        <div class="input-wrap"><input v-model="total" type="number"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">币种</div>
                        <div class="input-wrap"><input v-model="currency" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品介绍</div>
                        <div class="input-wrap"><input v-model="content" type="text"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="statusCommand">
                                <span class="el-dropdown-link">
                                  {{statusText || '请选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                        <textarea class="tarea" style="width: 300px; height: 150px" v-model="contenten" placeholder='更新内容'></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import {compress, dataURItoBlob} from './js/upload'
  export default {
    data() {
      return {
        name: '',
        typeId: '',
        statusId: '',
        typeText: '请选择',
        statusText: '请选择',
        status: '',
        imgUrl: '',
        total: '',
        currency: '',
        content: '',
        renewalAmount: '',
        realTotal: '',
        realRenewTotal: '',
        nameen: '',
        contenten: '',
        statusEnum: [],
        typeEnum: [],
        error1: '',
        result: '',
        fileName: '',
        functionImage: '',
        surfaceImage: '',
        imageUrl: '',
      }
    },
    created () {
      this.getType()
    },
    methods: {
      getType () {
        this.$fetch.post(`/public/enumValue?classPackage=product.Product$StatusEnum;product.Product$TypeEnum&flag=false&state=1`).then((res) => {
          if (res.msg === '成功') {
            this.statusEnum = res.data.data.StatusEnum
            this.typeEnum = res.data.data.TypeEnum
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
      uploadImg (e) {
        let imgUrl = this.$refs.uploadFile
        let imgObj = imgUrl.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!isType) {
            this.error1 = '格式不正确'
            imgUrl.value = ''
            return
          } else if (!isLt2M) {
            this.error1 = '图片太大'
            return
          }
        } else {
          return
        }
        this.functionImage  = imgObj
        let files = this.$refs.uploadFile.files
        let that = this;
        function readAndPreview(file) {
          if ((file.name)) {
            let reader = new FileReader();
            reader.onload = function(e) {
              if (that.surfaceImage.indexOf(this.result) === -1) {
                that.surfaceImage = this.result
              }
            };
            reader.readAsDataURL(file);
          }
        }
        if (files) {
          [].forEach.call(files, readAndPreview);
        }
        if (files.length === 0) {
          return;
        }
      },
      verifyErr () {
        if (this.functionImage === '') {
        this.error1 = '商品图标不能为空'
        return false
      }
        if (this.name === '') {
          this.error1 = '商品名称不能为空'
          return false
        }
        if (this.typeText === '请选择') {
          this.error1 = '请选择商品类型'
          return false
        }
        if (this.total === '') {
          this.error1 = '商品价格不能为空'
          return false
        }
        if (this.currency === '') {
          this.error1 = '币种不能为空'
          return false
        }
        if (this.statusText === '请选择') {
          this.error1 = '请选择商品状态'
          return false
        }
        if (this.renewalAmount === '') {
          this.error1 = '续费金额不能为空'
          return false
        }
        if (this.realTotal === '') {
          this.error1 = '真实价格USD不能为空'
          return false
        }
        if (this.realRenewTotal === '') {
          this.error1 = '真实续费价格USD不能为空'
          return false
        }
        if (this.nameen === '') {
          this.error1 = '商品英文名称不能为空'
          return false
        }
        return true
      },
      addSave () {
        if (this.verifyErr()) {
          let statusId = parseInt(this.statusId, 10) >=0 ? parseInt(this.statusId, 10) : ''
          let typeId = parseInt(this.typeId, 10) >=0 ? parseInt(this.typeId, 10) : ''
          let formData = new FormData()
          formData.append('name',this.name)
          formData.append('type',typeId)
          formData.append('status',statusId)
          formData.append('imgUrl',this.functionImage)
          formData.append('total',this.total)
          formData.append('currency',this.currency)
          formData.append('content',this.content)
          formData.append('renewalAmount',this.renewalAmount)
          formData.append('realTotal',this.realTotal)
          formData.append('realRenewTotal',this.realRenewTotal)
          formData.append('nameen',this.nameen)
          formData.append('contenten',this.contenten)
          this.$store.commit('SET_LOADING', true)
          this.$fetch.postFormdata(`/product/product/addProduct`,formData).then(res => {
            if (res.msg === '添加成功') {
              this.$store.commit('SET_LOADING', false)
              Dialog({
                title: '添加成功',
                okFn: () => {
                  this.$router.push('/product/product')
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/css/var.less"
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
            padding 20px 40px 0px 24px;
    .from-table
        border-bottom none
        .search-box
            height 34px
            line-height 34px
            margin: 4px 0 15px;
            display flex
            align-items center
            justify-content flex-start
            &:nth-child(3)
              height 40px
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
            .logo-box
                display flex
                width: 300px
                height: 40px
                line-height 40px
                padding-left 6px
                .logoImg
                    display inline-block
                    width 40px
                    height 40px
                    .commodity-icon
                       width 100%
                       height 100%
                .logo-btn
                   cursor pointer
                   &:hover
                     color #2176ff
                .logo-btn
                    overflow: hidden
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color #fff
                    color #3376ff
                    cursor pointer
                    border-radius 4px
                    width 100px
                    height 40px
                    position relative
                    text-align center
                    line-height 40px
                    #uploadFile
                        font-size 26px
                        position: absolute;
                        top: 0;
                        left: 0;
                        margin-left -130px
                        display: block;
                        cursor: pointer;
                        opacity: 0;
        .textarea
            height: 200px;
            .tarea
               resize:none;
               margin-left 34px

</style>


