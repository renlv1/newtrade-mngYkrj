<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>用户查询</span>
      <router-link to="/user/userCheck/addUser" class="pay-money"> + 新增用户</router-link>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="valueID" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">用户地址：</div>
          <div class="input-wrap"><input v-model="accountAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">上级用户名：</div>
          <div class="input-wrap"><input v-model="refUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">上级用户地址：</div>
          <div class="input-wrap"><input v-model="refAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">手机：</div>
          <div class="input-wrap"><input v-model="mobile" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">邮箱：</div>
          <div class="input-wrap"><input v-model="email" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">账户状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">用户类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{userText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in userArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">以太坊地址：</div>
          <div class="input-wrap"><input v-model="systemAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">时间：</div>
          <el-date-picker
            placeholder="开始时间"
            v-model="startTime"
            type="datetime"
            default-time="00:00:00"
            :picker-options="pickerOptionsStart"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
    
          <span style="margin-right: 10px">到</span>
    
          <el-date-picker
            placeholder="结束时间"
            v-model="endTime"
            type="datetime"
            default-time="23:59:59"
            :picker-options="pickerOptionsEnd"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
  
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
              <td width="6%">ID</td>
              <td>用户名</td>
              <td width="15%">用户地址</td>
              <td>手机区号</td>
              <td>手机</td>
              <td>邮箱</td>
              <td>账户状态</td>
              <td>用户类型</td>
              <td>上级用户名</td>
              <td width="15%">操作</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.userName || '-'}}</td>
              <td>{{item.address || '-'}}</td>
              <td>{{item.phoheCode || '-'}}</td>
              <td>{{item.mobile || '-'}}</td>
              <td>{{item.email || '-'}}</td>
              <td>{{$userStatus(item.status)}}</td>
              <td>{{item.userType === 1 ? '普通用户' : '系统用户'}}</td>
              <td>{{item.refUserName || '-'}}</td>
              <td class="blue-td">
                <router-link tag = "a" :to="{path: '/user/userCheck/userCheckDetail',query: {id:item.id,refUserName: item.refUserName}}">查看 </router-link><span class="grey">| </span>
                <span @click="modiftyBtn(item)">修改上级 </span><span class="grey">| </span>
                <span @click="cancelBtn(item.id)"> 注销  </span> <span class="grey">| </span>
                <router-link tag="a" :to="{path: '/user/userCheck/checkUserAsset', query: {id: item.id}}">查看资产</router-link>
              </td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
    </div>
    <el-dialog width="30%" :visible.sync="contactInformationDialog" :before-close="handleClose" title="修改用户上级">
      <div class="search">
        <div class="search-box">
          <div class="label">用户id</div>
          <div class="input-wrap input-main"><input v-model="userId" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">上级用户名</div>
          <div class="input-wrap input-main"><input v-model="parentUserName" type="text"></div>
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
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        pickerOptionsStart: {
          disabledDate: (time) => {
            let beginDateVal = this.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: (time) => {
            let beginDateVal = this.startTime
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
        valueID: '',
        userName: '',//用户名
        accountAddress: '',//用户地址
        refUserName: '',//上级用户名
        refAddress: '',//上级用户地址
        mobile: '',//手机号
        email: '',//邮箱
        statusArr: [],//账户状态
        statusText: '',
        contactInformationDialog: false,//修改用户上级弹窗
        userText: '',
        userArr: [],//用户类型
        systemAddress: '',//以太坊地址
        startTime: '',
        endTime: '',
        status: '',//账户状态
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        showDialog: false,//确定注销弹窗
        userId: '',//用户id
        parentUserName: '',//上级用户名
        userType: '',//用户类型
        deleteId: '',
        pageSize: 10,
      }
    },
    created() {
      this.getType()
    },
    methods: {
      // 确定注销
      paySure() {
        this.$fetch.post(`/user/userAction/cancellation`,{
          id: this.deleteId
        }).then(res => {
          if(res.code === 0) {
            this.showDialog = false
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
      cancelBtn(id) {
        this.deleteId = id
        this.showDialog = true
      },
      // 确定修改
      modifSure() {
        if(!this.userId) {
          Message.error('请填写用户Id')
          return
        }
        if(!this.parentUserName) {
          Message.error('请填写上级用户名')
          return
        }
        this.$fetch.post('/user/userAction/updateUserLevel', {
          userId: this.userId,//用户id
          refUserName: this.parentUserName//上级用户名
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
      // 修改用户上级
      handleClose() {
        this.userId = ''
        this.parentUserName = ''
        this.contactInformationDialog = false
      },
      modiftyBtn(item) {
        this.userId = item.id
        this.parentUserName = item.refUserName
        this.contactInformationDialog  = true
      },
      // 枚举
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.User$StatusEnum;user.User$UserTypeEnum&flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.statusArr = res.data.data.StatusEnum
            this.userArr = res.data.data.UserTypeEnum
          }
        })
      },
      // 重置
      resetFields() {
        this.userText = ''
        this.statusText= ''
        this.refAddress = ''
        this.refUserName = ''
        this.userName = ''
        this.accountAddress = ''
        this.email = ''
        this.startTime = ''
        this.mobile = ''
        this.userType = ''
        this.endTime = ''
        this.systemAddress = ''
        this.status = ''
        this.valueID = ''
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
        if (id === 1) {
          this.statusText = command.text
          this.status = command.id
        } else if (id === 2) {
          this.userText = command.text
          this.userType = command.id
        }
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/userAction/queryUserList', {
          id: this.valueID,
          userName: this.userName, //用户名
          address: this.accountAddress,//用户地址
          refUserName: this.refUserName,//上级用户名
          refAddress: this.refAddress,//上级用户地址
          mobile: this.mobile,//手机号
          email: this.email,//邮箱
          status: this.status === 'selected' ? this.status = '' : this.status,//账户状态
          systemAddress: this.systemAddress,//以太坊地址
          userType: this.userType === 'selected' ? this.userType = '' : this.userType,//用户类型
          startAtStr: this.$changeDate(this.startTime, '-', 8),//创建-结束时间
          endAtStr:  this.$changeDate(this.endTime, '-', 8),
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if(res.data) {
            this.list = res.data.page.list
            this.total = res.data.page.totalCount
          } else {
            this.list = []
          }
        }).catch(err => {
          this.loadShow = false
          console.log(err)
        })
      },
      search() {
        this.total = 1 // hook listWrap组件的loading
        this.getData()
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .crumb
    display flex
    justify-content space-between
  .dialog-input{
    width 240px!important
  }
  .problem-box{
    margin-top 30px
    margin-bottom 40px
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
</style>
