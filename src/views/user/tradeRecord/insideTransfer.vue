<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/tradeRecord" class="title-m">交易记录 </router-link>
        <span> / 内部转账</span>
      </div>
      <div class="btn-right" @click="saveBtn()">
        <div class="btn-save">确认</div>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <li class="li-item search">
          <div class="search-box">
            <div class="label">发送者用户名</div>
            <div class="input-wrap"><input v-model="sendUserName"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">接收者用户名</div>
            <div class="input-wrap"><input v-model="acceptUserName" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">金额</div>
            <div class="input-wrap"><input v-model="amount"   type="number"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">币种</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand2">
              <span class="el-dropdown-link">
                {{ currencyText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in currencyArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">安全码</div>
            <div class="input-wrap"><input v-model="code" type="text" ></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import { Message } from 'element-ui'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        sendUserName: '',//发送用户
        acceptUserName: '',//接受用户
        amount: '',//金额
        code: '',//安全码
        currencyText:'',
        currencyArr: [],
        key: this.$route.query.key,
        currency:'',//币种
        time: ''
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.Transaction$CallbackEnum;user.Transaction$StateEnum;user.Transaction$PaymentTypeEnum;user.Transaction$OrderType;user.Transaction$CurrencyTypeEnum;&flag=false&state=1`).then(res => {
          if (res.code === 0) {
            this.currencyArr = res.data.data.CurrencyTypeEnum
          }
        })
      },
      handleCommand2(command) {
        this.currencyText = command.text
        this.currency = command.id
      },
      checkInput() {
        let val = this.amount
        if (!/^\d*.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
          this.amount = val.substring(0, val.length - 1)
        }
      },
      verify() {
        if(!this.sendUserName) {
          Message.error('请填写发送者用户名')
          return
        }
        if(!this.acceptUserName) {
          Message.error('请填写接收者用户名')
          return
        }
        if(!this.amount) {
          Message.error('请填写金额')
          return
        }
        if(!this.currencyText) {
          Message.error('请选择币种')
          return
        }
        if(!this.code) {
          Message.error('请填写安全码')
          return
        }
        return true
      },
      // 确认转账
      saveBtn(){
        if(this.verify()) {
          this.$fetch.post('/trade/transaction/reTransfer',{
            sendUserName: this.sendUserName,//发送用户
            currency: this.currency,//币种
            acceptUserName: this.acceptUserName,//接受用户
            amount: this.amount,// 金额
            code: this.code//安全码
          }).then(res => {
            if(res.code === 0) {
              Dialog({
                title: '',
                content: res.msg,
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .zoom-enter-to{
    transition: none;
  }
  .el-dropdown-menu{
    width 260px
  }
  .dialog-input{
    width 240px!important
  }
  .problem-box{
    display flex
    justify-content space-between
    align-items center
    .dropdown-wrap {
      cursor pointer
      text-align center
      line-height 40px
      width: 250px;
      margin-right: 20px;
      background-color #fff
      border: 1px solid #DCDFE6;
      border-radius: 6px;
      padding: 0 10px;
      font-size 15px
      height: 40px;
      >>>.el-dropdown-link{
        display flex
        justify-content space-between
        align-items center
      }
    }
    >>>.el-dropdown-menu{
      width 240px!important
    }
  }
  >>>.el-dialog__body{
    padding 30px 20px!important
  }
  .wrap
    background-color: @white;
  .search
    padding-bottom 0
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    .search-box
      margin-bottom 0
      display flex
      flex-direction row
      align-items center
      .input-wrap
        width 280px
        input
          width 100%
        textarea
          width 260px
          height 100px
          padding 10px
          border 1px solid #DCDFE6
          background #fff
      .label
        width 100px
      .dropdown-wrap
        width 280px!important
        cursor pointer
        text-align center
        line-height 40px
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height: 40px;
    .btns
      margin-top 30px
      margin-right 50px
      .btn
        cursor pointer
</style>

<style scoped>
  >>>.freezeListWrap .empty {
    top: 20px;
  }
  
  /*>>>.el-date-editor.el-input, .el-date-editor.el-input__inner {*/
  /*padding: 0 10px !important;*/
  /*margin-right: 20px !important;*/
  /*width: 130px !important;*/
  /*height: 25px;*/
  /*}*/
  
  >>> .el-dialog {
    margin: 0 auto;
    width: 80%;
    box-shadow: none;
  }
  >>>.dropdown-wrap{
    min-width: 160px !important;
  }
  /*>>> .el-dialog .el-dialog__headerbtn .el-icon-close:before {*/
  /*  border: 2px solid #ccc;*/
  /*  border-radius: 100%;*/
  /*}*/
  
  /*>>> .el-date-editor .el-input__inner {*/
  /*padding: 0 10px !important;*/
  /*}*/
  
  textarea {
    font-size: 14px;
    padding: 16px 0 0 18px;
    color: #000;
  }
  
  textarea::-webkit-input-placeholder {
    color: #b3b3b3;
  }
  
  .input:-moz-placeholder {
    color: #b3b3b3;
  }
  
  .input:-ms-input-placeholder {
    color: #b3b3b3;
  }
</style>>
