<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/userCheck" class="title-m">用户查询 </router-link>
        <span> / 详情</span>
      </div>
      <div class="btn-right">
        <span class="pay-money" @click="$router.push({path: '/user/userCheck/checkUserAsset',query: {id: id}})">查看资产</span>
        <span class="pay-money" @click="cancelBtn()">注销</span>
        <span class="pay-money" @click="modiftyBtn()">修改上级</span>
        <span class="btn-save" @click="saveBtn()">保存</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <li class="li-item search">
          <div class="search-box">
            <div class="label">ID</div>
            <div class="input-wrap">{{dataDetail.id}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">用户名</div>
            <div class="input-wrap">{{dataDetail.userName}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">用户地址</div>
            <div class="input-wrap">{{dataDetail.address  || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">昵称</div>
            <div class="input-wrap">{{dataDetail.nickName || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">上级用户名</div>
            <div class="input-wrap">{{dataDetail.refUserName || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">上级用户地址</div>
            <div class="input-wrap">{{dataDetail.refUserAddress || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">手机区号</div>
            <div class="input-wrap">{{dataDetail.phoheCode || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">手机号</div>
            <div class="input-wrap">{{dataDetail.mobile || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">邮箱</div>
            <div class="input-wrap">{{dataDetail.email || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">登录密码</div>
            <div class="input-wrap"><input v-model="dataDetail.loginPassword"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">性别</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ genderText }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in genderArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">账户状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand2">
              <span class="el-dropdown-link">
                {{ statusText}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">冻结原因</div>
            <div class="input-wrap"><input v-model="dataDetail.remarks"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">支付密码</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand3">
              <span class="el-dropdown-link">
                {{ tradeText}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in tradeArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">手机验证码</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand4">
              <span class="el-dropdown-link">
                {{ mobileText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in mobileArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">Gogole验证码</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand5">
              <span class="el-dropdown-link">
                {{ googleText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in googleArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">用户类型</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand6">
              <span class="el-dropdown-link">
                {{ userTypeText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in userTypeArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">账户随机密码</div>
            <div class="input-wrap">{{dataDetail.salt}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">层级</div>
            <div class="input-wrap"><input v-model="dataDetail.userLevel" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">以太坊系统地址</div>
            <div class="input-wrap"><input v-model="dataDetail.systemAddress" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">是否注册openfire用户</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand7">
              <span class="el-dropdown-link">
                {{ openfireText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in openfireArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">注册数据同步状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand8">
              <span class="el-dropdown-link">
                {{ synStatusText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in synStatusArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">备注</div>
            <div class="input-wrap">{{dataDetail.remarks || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">openId(基金)</div>
            <div class="input-wrap">{{dataDetail.openId || '-'}}</div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">noneOpenId(藏宝)</div>
            <div class="input-wrap">{{dataDetail.noneOpenId || '-'}}</div>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog width="30%" :visible.sync="contactInformationDialog" :before-close="handleClose" title="修改用户上级">
      <div class="search">
        <div class="search-box">
          <div class="label">用户id</div>
          <div class="input-wrap input-main"><input v-model="id" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">上级用户名</div>
          <div class="input-wrap input-main"><input v-model="refUserName" type="text"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="modifSure()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="showDialog">
      <div class="problem-box">
        <img src="../../../assets/img/warning.png"><label>确定要注销该用户？</label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="paySure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import { Message } from 'element-ui'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        dataDetail: {},
        openfireArr: [
          {id: 0, text: '未注册'},
          {id: 1, text: '已注册'}
        ],//是否注册openfire用户
        synStatusArr: [
          {id: 0, text: '未注册'},
          {id: 1, text: '已注册'}
        ],//注册数据同步状态
        synStatusText: '',
        openfireText: '',
        openfire: '',//是否注册openfire用户
        genderText:  '',
        genderArr: [],//性别
        gender: '',
        statusArr: [],//账户状态
        statusText: '',
        tradeArr: [],//支付密码
        tradeText: '',
        mobileArr: [],//手机验证码
        mobileText: '',
        googleArr: [],//Gogole验证码
        googleText: '',
        userTypeArr: [],//用户类型
        userTypeText: '',
        loginPassword: '',
        contactInformationDialog: false,//修改用户上级弹窗
        showDialog: false,// 注销用户弹窗
        id: this.$route.query.id,
        refUserName: this.$route.query.refUserName,//上级用户名
        status: '',
        openTradePassword: '',//开启支付密码
        openMobileCode: '',//开启手机验证码
        openGoogleCode: '',//开启Google验证
        userType: '',//用户类型
        synStatus: '',//注册数据同步状态
      }
    },
    created() {
      this.getType()
      this.getData()
    },
    watch: {
      // Keyword: {
      //   handler(newName, oldName) {
      //     if (newName !== oldName) {
      //       this.bountyProductList = []
      //       this.isChange = true
      //     }
      //   },
      //   immediate: true
      // }
    },
    methods: {
      // 修改上级
      modiftyBtn(){
        this.contactInformationDialog = true
      },
      // 确定修改
      modifSure() {
        if(!this.id) {
          Message.error('请填写用户Id')
          return
        }
        if(!this.refUserName) {
          Message.error('请填写上级用户名')
          return
        }
        this.$fetch.post('/user/userAction/updateUserLevel', {
          userId: this.id,
          refUserName: this.refUserName
        }).then(res => {
          if(res.code === 0) {
            this.contactInformationDialog = false
            Dialog({
              title: '',
              content: res.msg,
              okFn: () => {
                this.getData()
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 注销
      cancelBtn() {
        this.showDialog = true
      },
      // 修改用户上级
      handleClose() {
        this.contactInformationDialog = false
      },
      // 注销
      paySure() {
        this.$fetch.post(`/user/userAction/cancellation`,{
          id: this.id
        }).then(res => {
          if(res.code === 0) {
            this.showDialog = false
            Dialog({
              title: '',
              content: res.msg,
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 枚举
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.User$GenderEnum;user.User$StatusEnum;user.User$TradePwdEnum;user.User$MobileEnum;user.User$UserTypeEnum;user.User$GoogleEnum&flag=false&state=1`).then(res => {
          if (res.code === 0) {
            this.genderArr = res.data.data.GenderEnum
            this.statusArr = res.data.data.StatusEnum
            this.tradeArr = res.data.data.TradePwdEnum
            this.mobileArr = res.data.data.MobileEnum
            this.googleArr = res.data.data.GoogleEnum
            this.userTypeArr = res.data.data.UserTypeEnum
          }
        })
      },
      // 注册数据同步状态
      handleCommand8(command) {
        this.synStatusText = command.text
        this.dataDetail.synStatus = command.id
      },
      // 是否注册openfire用户
      handleCommand7(command) {
        this.openfireText = command.text
        this.dataDetail.openfire = command.id
      },
      // 用户类型
      handleCommand6(command) {
        this.userTypeText = command.text
        this.dataDetail.userType = command.id
      },
      // Gogole验证码
      handleCommand5(command) {
        this.googleText = command.text
        this.dataDetail.openGoogleCode = command.id
      },
      // 手机验证码
      handleCommand4(command) {
        this.mobileText = command.text
        this.dataDetail.openMobileCode = command.id
      },
      // 支付密码
      handleCommand3(command) {
        this.tradeText = command.text
        this.dataDetail.openTradePassword = command.id
      },
      // 性别
      handleCommand(command) {
      this.genderText = command.text
      this.dataDetail.gender = command.id
      },
      //账户状态
      handleCommand2(command) {
        this.statusText = command.text
        this.dataDetail.status = command.id
      },
      verify() {
        // if(!this.sendUserName) {
        //   Message.error('请填写发送者用户名')
        //   return
        // }
        // if(!this.acceptUserName) {
        //   Message.error('请填写接收者用户名')
        //   return
        // }
        // if(!this.amount) {
        //   Message.error('请填写金额')
        //   return
        // }
        // if(!this.currencyText) {
        //   Message.error('请选择币种')
        //   return
        // }
        // if(!this.code) {
        //   Message.error('请填写安全码')
        //   return
        // }
        return true
      },
      // 保存
      saveBtn(){
        if(this.verify()) {
          this.$fetch.post('/user/userAction/updateUser',{
            id: this.id,
            userName: this.dataDetail.userName,//用户名 (只需显示)
            address: this.dataDetail.address,//用户地址(只需显示)
            nickName: this.dataDetail.nickName ,//昵称(只需显示)
            refUserName: this.dataDetail.refUserName,//上级用户名(只需显示)
            refAddress: this.dataDetail.refAddress,//上级用户地址(只需显示)
            phoheCode: this.dataDetail.phoheCode,//手机区号 (只需显示)
            mobile: this.dataDetail.mobile,//手机号(只需显示)
            email: this.dataDetail.email,//邮箱(只需显示)
            loginPassword: this.dataDetail.loginPassword,//登录密码
            gender: this.dataDetail.gender,//性别
            status: this.dataDetail.status,//账户状态
            openTradePassword: this.dataDetail.openTradePassword,//开启支付密码
            openMobileCode: this.dataDetail.openMobileCode,//开启手机验证码
            openGoogleCode:  this.dataDetail.openGoogleCode,//开启Google验证
            userType: this.dataDetail.userType,//用户类型
            remarks: this.dataDetail.remarks,//冻结原因
            // salt: this.dataDetail.salt,
            userLevel: this.dataDetail.userLevel,//层级
            systemAddress: this.dataDetail.systemAddress,//以太坊系统地址
            xmppRegister: this.dataDetail.openfire,//是否注册openfire用户
            synStatus: this.dataDetail.synStatus,//注册数据同步状态
            // openId: this.dataDetail.openId,
            // noneOpenId: this.dataDetail.noneOpenId,
          }).then(res => {
            if(res.code === 0) {
              Dialog({
                title: '',
                content: res.msg,
                okFn: () => {
                  this.getData()
                }
              })
            }
          })
        }
      },
      getData(){
        this.$fetch.post(`/user/userAction/preUpdateUser`,{
          id: this.id
        }).then(res => {
          this.dataDetail = res.data.resultData
          this.genderFn( this.dataDetail.gender)
          this.Accountstatus(this.dataDetail.status)
          this.TradeFn(this.dataDetail.openTradePassword)
          this.openMobileFn(this.dataDetail.openMobileCode)
          this.openGoogleFn(this.dataDetail.openGoogleCode)
          this.UserTypeFn(this.dataDetail.userType)
          this.xmppRegisterFn(this.dataDetail.xmppRegister)
          this.synStatusFn(this.dataDetail.synStatus)
        })
      },
      // 注册数据同步状态
      synStatusFn(val) {
        if(Number(val) === 0)  return this.synStatusText = '未注册'
        if (Number(val) === 1) return  this.synStatusText = '已注册'
        return  this.synStatusText = '未选择'
      },
      // 是否注册openfire用户
      xmppRegisterFn(val) {
        if(Number(val) === 0)  return this.openfireText = '未注册'
        if (Number(val) === 1) return  this.openfireText = '已注册'
        return  this.openfireText = '未选择'
      },
      // 用户类型
      UserTypeFn(val) {
        if(Number(val) === 1)  return this.userTypeText = '普通用户'
        if (Number(val) === 2) return  this.userTypeText = '系统用户'
        return  this.userTypeText = '未选择'
      },
      // 手机验证码
      openMobileFn(val) {
        if(Number(val) === 1)  return this.mobileText = '未设置'
        if (Number(val) === 2) return  this.mobileText = '开启'
        if (Number(val) === 3) return  this.mobileText = '关闭'
        return  this.mobileText = '未选择'
      },
      // 谷歌状态
      openGoogleFn(val) {
        if(Number(val) === 1)  return this.googleText = '未设置'
        if (Number(val) === 2) return  this.googleText = '开启'
        if (Number(val) === 3) return  this.googleText = '关闭'
        return  this.googleText = '未选择'
      },
      // 支付状态
      TradeFn(val) {
        if(Number(val) === 1)  return this.tradeText = '未设置'
        if (Number(val) === 2) return  this.tradeText = '开启'
        if (Number(val) === 3) return  this.tradeText = '关闭'
        return  this.tradeText = '未选择'
      },
      // 账户状态
      Accountstatus(val){
        if(Number(val) === 0)  return this.statusText = '注册冻结'
        if (Number(val) === 1) return  this.statusText = '正常'
        if (Number(val) === 2) return  this.statusText = '后台冻结'
        if (Number(val) === 3) return  this.statusText = '市场要求冻结'
        if (Number(val) === 4) return  this.statusText = '登陆密码错误次数超限冻结'
        if (Number(val) === 5) return  this.statusText = '支付密码错误次数超限冻结'
        if (Number(val) === 5) return  this.statusText = '注册冻结（未同步到SDK）'
        return  this.statusText = '未选择'
      },
      // 显示性别
      genderFn(val) {
        if(Number(val) === 1)  return this.genderText = '男'
        if (Number(val) === 2) return  this.genderText = '女'
        return  this.genderText = '未选择'
      },
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
        width 150px
        color #b2b3bc
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
