<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>用户账户记录</span>
      <div class="pay-money" @click="toTransfer()">转账 </div>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
        </div>
<!--        <div class="search-box">-->
<!--          <div class="label">用户地址：</div>-->
<!--          <div class="input-wrap"><input v-model="userAddress" type="text"></div>-->
<!--        </div>-->
<!--        <div class="search-box">-->
<!--          <div class="label">时间：</div>-->
<!--          <el-date-picker-->
<!--            placeholder="开始时间"-->
<!--            prefix-icon="el-icon-date"-->
<!--            clear-icon="none"-->
<!--            v-model="startTime"-->
<!--            type="datetime"-->
<!--            :picker-options="pickerOptionsStart"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--          -->
<!--          <span style="margin-right: 10px">到</span>-->
<!--          -->
<!--          <el-date-picker-->
<!--            placeholder="结束时间"-->
<!--            prefix-icon="el-icon-date"-->
<!--            clear-icon="none"-->
<!--            v-model="endTime"-->
<!--            type="datetime"-->
<!--            :picker-options="pickerOptionsEnd"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--        </div>-->
        <div class="f1"></div>
        <div class="btns">
          <div @click="resetFields()" class="btn black">清空</div>
          <div class="btn" @click="search">查询</div>
        </div>
      </div>
      <list-wrap :list="list" :total="total" @change="getData">
        <div class="web-table">
          <table class="center">
            <tr class="thead">
              <td>ID</td>
              <td>用户名</td>
              <td>余额</td>
              <td>冻结余额</td>
              <td>委托冻结金额</td>
              <td>币种</td>
              <td>累加转账金额</td>
              <td>创建时间</td>
              <td>更新时间</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.balance}}</td>
              <td>{{item.balanceFreeze}}</td>
              <td>{{item.balanceEntrustFreeze}}</td>
              <td>{{item.currency}}</td>
              <td>{{item.transfertoBalance || '0'}}</td>
              <td v-html="timeStrDate(item.createTime)"></td>
              <td v-html="timeStrDate(item.updateTime)"></td>
              <td class="blue-td" @click="modifyBtn(item)"><span>修改</span></td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
      <el-dialog width="30%" :visible.sync="showDialog" :before-close="handleClose" title="转账">
        <div class="search">
          <div class="search-box">
            <div class="label">最低金额</div>
            <div class="input-wrap"><input v-model="minAmount" type="number"></div>
          </div>
          <div class="search-box">
            <div class="label">币种</div>
            <div class="input-wrap curreny-wrap">
              <el-dropdown @command="handleCommand5">
              <span class="el-dropdown-link">
                {{ curText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu dialog-input" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in currencyArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">开始时间</div>
            <el-date-picker
              placeholder="开始时间"
              v-model="beginTime"
              prefix-icon="el-icon-date"
              type="datetime"
              :picker-options="pickerOptionsStart2"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
          <div class="search-box">
            <div class="label">结束时间</div>
            <el-date-picker
              prefix-icon="el-icon-date"
              placeholder="结束时间"
              v-model="overTime"
              type="datetime"
              :picker-options="pickerOptionsEnd2"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="paySure()">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog width="30%" :visible.sync="userDialog" :before-close="handleClose2" title="用户账户修改">
        <div class="search">
          <div class="search-box">
            <div class="label">账户用户名</div>
            <div class="input-wrap input-main"><input v-model="accountUser" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">余额</div>
            <div class="input-wrap input-main"><input v-model="balanceAmout" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">冻结余额</div>
            <div class="input-wrap input-main"><input v-model="blockedBalanceAmout" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">委托冻结余额</div>
            <div class="input-wrap input-main"><input v-model="balanceEntrustFreeze" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">币种</div>
            <div class="input-wrap input-main"><input v-model="curren" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">转到余额</div>
            <div class="input-wrap input-main"><input v-model="transfertoBalance" type="text"></div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2()">取 消</el-button>
        <el-button type="primary" @click="modifSure()">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        pickerOptionsStart: {
          disabledDate: time => {
            if (this.endTime) {
              return time.getTime() > new Date(this.endTime).getTime()
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            if (this.startTime) {
              return time.getTime() < new Date(this.startTime).getTime() - 86400000
            }
          }
        },
        pickerOptionsStart2: {
          disabledDate: time => {
            if (this.overTime) {
              return time.getTime() > new Date(this.overTime).getTime()
            }
          }
        },
        pickerOptionsEnd2: {
          disabledDate: time => {
            if (this.beginTime) {
              return time.getTime() < new Date(this.beginTime).getTime() - 86400000
            }
          }
        },
        userName: '',
        transfertoBalance:'',//转到余额
        curren: '',//币种
        balanceEntrustFreeze: '',//委托冻结余额
        blockedBalanceAmout:'',//冻结余额
        balanceAmout: '',//余额
        accountUser: '',//账户用户名
        userDialog: false,
        beginTime: '',
        overTime: '',
        minAmount: '',
        curText: '',
        orderArr: [],
        currencyText: '',
        currencyArr: [],
        id: '',
        startTime: '',
        endTime: '',
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        showDialog: false,
        userAddress: '',
        currency: '',
        idValue: '',
        pageSize: 10,
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.UserAccount$CurrencyTypeEnum;user.UserAccount$OperationEnum;&flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.currencyArr = res.data.data.CurrencyTypeEnum
          }
        })
      },
      // 修改
      modifyBtn(item) {
        this.idValue = item.id
        this.accountUser = item.userName
        this.balanceAmout = item.balance
        this.blockedBalanceAmout  = item.balanceFreeze
        this.balanceEntrustFreeze  = item.balanceEntrustFreeze
        this.curren  = item.currency
        this.transfertoBalance  = item.transfertoBalance
        this.userDialog = true
      },
      verify() {
        if(!this.minAmount) {
          Message.error('请填写最低金额')
          return
        }
        if(!this.curText || this.curText === 'selected') {
          Message.error('请选择币种')
          return
        }
        if(!this.beginTime) {
          Message.error('请选择开始时间')
          return
        }
        if(!this.overTime) {
          Message.error('请选择结束时间')
          return
        }
        return true
      },
      // 确定修改
      modifSure() {
        this.$fetch.post('/user/userAccount/updateUserAccount',{
          id: this.idValue,
          userName: this.accountUser, // 账户用户名
          balance:  this.balanceAmout,//余额
          balanceFreeze: this.blockedBalanceAmout,//冻结余额
          balanceEntrustFreeze: this.balanceEntrustFreeze,//委托冻结余额
          currency: this.curren,//币种
          transfertoBalance: this.transfertoBalance//转到余额
        }).then(res => {
          if(res.code === 0) {
            this.userDialog = false
            Dialog({
              title: '',
              content: res.msg,
              okFn: ( ) => {
                this.getData()
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 确定转账
      paySure() {
        if(this.verify()) {
          this.$fetch.post('/user/userAccount/transferUserAccount',{
            lowBalance: this.minAmount,
            currency: this.currency,
            startAtStr: this.beginTime,
            endAtStr: this.overTime
          }).then(res => {
            if(res.code === 0) {
              Message.error(res.msg)
              this.handleClose()
            } else {
              this.handleClose()
            }
          }).catch(err => {
            this.handleClose()
            console.log(err)
          })
        }
      },
      handleClose2() {
        this.userDialog = false
      },
      handleClose() {
        this.minAmount = ''
        this.beginTime = ''
        this.overTime = ''
        this.curText = ''
        this.showDialog = false
        this.currency = ''
      },
      toTransfer() {
        this.startTime = ''
        this.endTime = ''
        this.minAmount = ''
        this.beginTime = ''
        this.overTime = ''
        this.curText = ''
        this.showDialog = true
        this.currency = ''
      },
      resetFields() {
        this.state = ''
        this.currencyText = ''
        this.currency = ''
        this.id = ''
        this.userName = ''
        this.userAddress = ''
        this.startTime = ''
        this.endTime = ''
      },
      // 币种
      handleCommand5(command) {
        this.curText = command.text
        this.currency = command.id
      },
      // 状态
      handleCommand(command) {
        this.currencyText = command.text
        this.currency = command.id
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/userAccount/queryUserAccountList', {
          id: this.id,
          userName: this.userName, //设备登录的帐号
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if( res.data) {
            this.list = res.data.page.list
            this.total = res.data.page.totalCount
          }
        }).catch(err => {
          this.loadShow = false
          console.log(err)
        })
      },
      search() {
        if(!this.userName) {
          Message.error('请填写用户名')
        } else {
          this.total = 1 // hook listWrap组件的loading
          this.getData()
        }
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
    padding 0 20px!important
    .search{
      padding-bottom 0
      .search-box{
        width 100%
        margin-top 0
        margin-bottom 20px
        .el-input{
          display flex
          align-items center
          width 80%!important
          .el-input__inner{
            margin-right 0!important
            width 100%!important
          }
          .el-input__icon{
            line-height 35px!important
          }
        }
        .curreny-wrap{
          cursor pointer
          text-align center
          line-height 40px
          background-color #fff
          border: 1px solid #DCDFE6;
          border-radius: 6px;
          padding: 0 10px;
          font-size 15px
          height: 40px;
        }
        .input-wrap{
          width 80%
          &.input-main{
            width 70%
          }
          input{
            margin-right 0!important
            width 100%
          }
        }
      }
    }
  }
  .dialog-input{
    width 250px
  }
  .el-dropdown-menu{
    max-height 300px!important
    overflow auto !important
    /*max-width 200px!important*/
  }
  .payment{
    max-width 210px!important
  }
  .crumb
    display flex
    justify-content space-between
  .wrap
    background-color: @white;
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    .search-box
      margin-top 30px
      margin-bottom 0
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 40px
        width: 180px;
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
  
  >>> .el-dialog .el-dialog__headerbtn {
    top: 20px;
    right: 15px;
  }
  
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
</style>
