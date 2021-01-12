<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/userCheck" class="title-m">用户查询 </router-link>
        <span> / 新增用户</span>
      </div>
      <div class="btn-right">
        <span class="btn-save" @click="saveBtn()">保存</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w ">
        <li class="li-item search">
          <div class="search-box">
            <div class="label">用户名</div>
              <div class="input-wrap"><input v-model="userName"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">手机区号</div>
            <div class="input-wrap"><input v-model="phoheCode" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">手机号</div>
            <div class="input-wrap"><input v-model="mobile" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">邮箱</div>
            <div class="input-wrap"><input v-model="email" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">登录密码</div>
            <div class="input-wrap"><input v-model="loginPassword" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">邀请人</div>
            <div class="input-wrap"><input v-model="inviter" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">昵称</div>
            <div class="input-wrap"><input v-model="nickName" type="text" ></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">性别</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ genderText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
            <div class="label">上级用户名</div>
            <div class="input-wrap"><input v-model="refUserName"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">层级</div>
            <div class="input-wrap"><input v-model="userLevel" type="number"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">用户来源</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand7">
              <span class="el-dropdown-link">
                {{ typeText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in typeArr" :key="index">{{item.text}}
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
                {{ statusText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
            <div class="label">支付密码</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand3">
              <span class="el-dropdown-link">
                {{ tradeText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                {{ mobileText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                {{ googleText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                {{ userTypeText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in userTypeArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  // import { Message } from 'element-ui'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        userName: '',//用户名
        phoheCode: '',//手机区号
        mobile: '',//手机号
        email: '',//邮箱
        loginPassword: '',//登录密码
        inviter: '',//邀请人
        nickName: '',//昵称
        genderText:  '',
        genderArr: [],//性别
        refUserName: '',//上级用户名
        userLevel: '',//层级
        typeArr: [],//用户来源
        typeText: '',
        statusText: '',
        statusArr: [],//账户状态
        openfire: '',//用户来源
        gender: '',//性别
        tradeArr: [],//支付密码
        tradeText: '',
        mobileArr: [],//手机验证码
        mobileText: '',
        googleArr: [],//Gogole验证码
        googleText: '',
        userTypeArr: [],//用户类型
        userTypeText: '',
        status: '',//账户状态
        openTradePassword: '',//开启支付密码
        openMobileCode: '',//开启手机验证码
        openGoogleCode: '',//开启Google验证码
        userType: '',//用户类型
      }
    },
    created() {
      this.getType()
      // this.getData()
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
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.User$GenderEnum;user.User$UserSourceEnum;user.User$StatusEnum;user.User$TradePwdEnum;user.User$MobileEnum;user.User$UserTypeEnum;user.User$GoogleEnum&flag=false&state=1`).then(res => {
          if (res.code === 0) {
            this.genderArr = res.data.data.GenderEnum
            this.statusArr = res.data.data.StatusEnum
            this.tradeArr = res.data.data.TradePwdEnum
            this.mobileArr = res.data.data.MobileEnum
            this.googleArr = res.data.data.GoogleEnum
            this.userTypeArr = res.data.data.UserTypeEnum
            this.typeArr = res.data.data.UserSourceEnum
          }
        })
      },
      // 用户来源
      handleCommand7(command) {
        this.typeText = command.text
        this.openfire = command.id
      },
      // 用户类型
      handleCommand6(command) {
        this.userTypeText = command.text
        this.userType = command.id
      },
      // Gogole验证码
      handleCommand5(command) {
        this.googleText = command.text
        this.openGoogleCode = command.id
      },
      // 手机验证码
      handleCommand4(command) {
        this.mobileText = command.text
        this.openMobileCode = command.id
      },
      // 支付密码
      handleCommand3(command) {
        this.tradeText = command.text
        this.openTradePassword = command.id
      },
      // 性别
      handleCommand(command) {
        this.genderText = command.text
        this.gender = command.id
      },
      //账户状态
      handleCommand2(command) {
        this.statusText = command.text
        this.status = command.id
      },
      verify() {
        // if(!this.userName) {
        //   Message.error('请填写用户名')
        //   return
        // }
        // if(!this.nickName) {
        //   Message.error('请填写昵称')
        //   return
        // }
        // if(!this.inviter) {
        //   Message.error('请填写邀请人')
        //   return
        // }
        // if(!this.refUserName) {
        //   Message.error('请填写上级用户名')
        //   return
        // }
        // if(!this.phoheCode) {
        //   Message.error('请填写手机区号')
        //   return
        // }
        // if(!this.mobile) {
        //   Message.error('请填写手机号')
        //   return
        // }
        return true
      },
      saveBtn(){
        if(this.verify()) {
          this.$fetch.post('/user/userAction/addUser',{
            ref: this.inviter, // 邀请人
            userName: this.userName, // 用户名
            nickName: this.nickName , // 昵称
            refUserName: this.refUserName, // 上级用户名
            phoheCode: this.phoheCode, // 手机区号
            mobile: this.mobile, // 手机号
            email: this.email, //  邮箱
            loginPassword: this.loginPassword, // 登录密码
            gender: this.gender, // 性别
            status: this.status, // 账户状态
            openTradePassword: this.openTradePassword, // 开启支付密码
            openMobileCode: this.openMobileCode, // 开启手机验证码
            openGoogleCode: this.openGoogleCode, // 开启Google验证码
            userType: this.userType, // 用户类型
            userLevel: this.userLevel, // 层级
            userSource: this.openfire, // 用户来源
          }).then(res => {
            if(res.code === 0) {
              Dialog({
                title: '',
                content: res.msg
              })
            }
          })
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .zoom-enter-to{
    transition: none;
  }
  .el-dropdown-menu{
    width 270px
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
        width 310px
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
        width 310px!important
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
