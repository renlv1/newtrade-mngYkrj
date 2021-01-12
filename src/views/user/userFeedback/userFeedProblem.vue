<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>用户反馈问题</span>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="valueID" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">订单id：</div>
          <div class="input-wrap"><input v-model="orderID" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">用户地址：</div>
          <div class="input-wrap"><input v-model.trim="accountAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">回复次数：</div>
          <div class="input-wrap"><input v-model="replyNum" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">问题来源：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ problemFrom|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in fromArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">问题类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ protype|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in typeArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">问题状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{problemStatus || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 3)" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
              <td>订单ID</td>
              <td>用户名</td>
              <td width="15%">用户地址</td>
              <td>问题来源</td>
              <td>问题类型</td>
              <td>问题内容</td>
              <td>问题状态</td>
              <td>被打钱用户</td>
              <td width="15%">操作</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.orderId}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.userAddress}}</td>
              <td>{{$problemSources(item.resourceId)}}</td>
              <td>{{$contentType(item.contentType)}}</td>
              <td class="td-content" >
                  <el-button type="text" @click="showDialogFn(item.content)" v-html="item.content || '-'"></el-button>
              </td>
              <td>{{$problemStatus(item.problemStatus)}}</td>
              <td>{{paidUsers(item)}}</td>
              <td class="blue-td">
                <router-link tag="a" :to="{path: '/user/userFeedProblem/feedProblemDetail',query: {item: JSON.stringify(item)}}">查看 </router-link><span class="grey">| </span>
                <router-link tag="a" :to="{path: '/user/userFeedProblem/answerQuestion',query: {item: JSON.stringify(item)}}">回复 </router-link><span class="grey">| </span>
                <span @click="payMoney(item.id)">打钱 </span><span class="grey">| </span>
                <span @click="stateBtn(item)">状态处理</span>
              </td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
    </div>
    <el-dialog width="30%" :visible.sync="showDialog" title="打钱">
      <div class="problem-box">
        <label>打钱对象</label>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{payText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu class="menu dialog-input" slot="dropdown">
              <el-dropdown-item :command="composeValue(item, 4)" v-for="(item, index) in paymentArr" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="errMsg" v-show="errTip">{{errTip}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="paySure()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="stateDialog" title="状态处理">
      <div class="problem-box">
        <label>问题状态</label>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{statusText || '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu class="menu dialog-input" slot="dropdown">
              <el-dropdown-item :command="composeValue(item, 5)" v-for="(item, index) in statusArr" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="errMsg" v-show="errTip">{{errTip}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateDialog = false">取 消</el-button>
        <el-button type="primary" @click="stateSure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        valueID: '',
        orderID: '',//订单id
        userName: '', //用户名
        accountAddress: '',//用户地址
        replyNum: '', // 回复次数
        fromArr: [],
        problemFrom: '',
        typeArr: [],
        protype: '',
        statusArr: [],
        statusText: '',
        paymentArr: [
          {text: '给用户打钱',id: 1},
          {text: '给老板打钱',id: 2},
        ],
        errTip: '',
        stateDialog:false,
        payType: '',
        payText: '',
        problemStatus:'',
        status: '',
        list: [],
        total: 0,
        resourceId: '',//问题来源
        pageIndex: 1,
        loadShow: false,
        showDialog: false,
        contentType: '',// 问题状态
        payId: '',
        stateID: '',
        tyepID: '',//问题类型
        pageSize: 10,
      }
    },
    created() {
      this.getType()
      // this.getData()
    },
    methods: {
      showDialogFn(item) {
        if (item) {
          this.$alert(`${item}`, '回复内容', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
          })
        }
      },
      paidUsers(item) {
        if(item.backup2 !== undefined && item.backup2 === item.userAddress) return '用户赢'
        if(item.backup2 !== undefined && item.backup2 !== item.userAddress) return '老板赢'
        return '-'
      },
      stateBtn(item) {
        this.errTip =  ''
        this.statusText = ''
        this.stateID = item.id
        this.stateDialog = true
        this.contentType = ''
      },
      stateSure() {
        if (!this.statusText) {
          this.errTip =  '请选择问题状态'
          return
        }
        this.$fetch.post('/user/problem/updateProblem',{
          id: this.stateID,//问题id
          problemStatus: this.contentType //问题状态，0为待处理 1处理中，2为已解决
        }).then(res => {
          if(res.code === 0) {
            this.contentType = ''
            this.stateDialog  = false
            Dialog({
              title: '',
              content: res.msg,
              okFn: () => {
                this.total = 1 // hook listWrap组件的loading
                this.getData()
              }
            })
          } else {
            this.contentType = ''
            this.stateDialog  = false
          }
        }).catch(err => {
          this.contentType = ''
          this.stateDialog  = false
          console.log(err)
        })
      },
      paySure() {
        if(!this.payType) {
          this.errTip =  '请选择打钱对象'
          return
        }
        let url = ''
        this.payType === 1 ? url = '/user/problem/giveUserMoney' : url = '/user/problem/giveBossMoney'
        this.$fetch.post(url,{
          problemid: this.payId //问题id
        }).then(res => {
          if(res.code === 0) {
            this.showDialog  = false
            Dialog({
              title: '',
              content: res.msg,
              okFn: () => {
                this.total = 1 // hook listWrap组件的loading
                this.getData()
              }
            })
          } else {
            this.showDialog  = false
          }
        }).catch(err => {
          this.showDialog  = false
          console.log(err)
        })
      },
      payMoney(id) {
        this.errTip = ''
        this.payText = ''
        this.payId = id
        this.showDialog  = true
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
        if (id === 1) {
          this.problemFrom = command.text
          this.resourceId = command.id
        } else if (id === 2) {
          this.protype = command.text
          this.tyepID = command.id
        } else if (id === 3) {
          this.problemStatus = command.text
          this.contentType = command.id
        } else if (id === 4) {
          this.errTip = ''
          this.payText = command.text
          this.payType = command.id
        } else if (id === 5) {
          this.errTip =  ''
          this.statusText = command.text
          this.contentType = command.id
        }
      },
      // 枚举
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.Problem$ProblemContentTypeEnum;user.Problem$ProblemResourceIdEnum;user.Problem$ProblemStatusEnum;user.Transaction$StateEnum;finance.DepositRecord$DepositStatusEnum;finance.DepositRecord$DepositPayStatusEnum;finance.DrawRecord$DrawStatusEnum;finance.DrawRecord$DrawPayStatusEnum;&flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.fromArr = res.data.data.ProblemResourceIdEnum
            this.typeArr = res.data.data.ProblemContentTypeEnum
            this.statusArr = res.data.data.ProblemStatusEnum
          }
        })
      },
      // 重置
      resetFields() {
        this.userName = ''
        this.accountAddress = ''
        this.protype = ''
        this.problemStatus = ''
        this.problemFrom = ''
        this.replyNum = ''
        this.resourceId = ''
        this.tyepID = ''
        this.contentType = ''
        this.orderID = ''
        this.valueID = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/problem/queryProblemList', {
          id: this.valueID,
          contentType : this.tyepID === 'selected' ? this.tyepID = '' : this.tyepID,//问题类型
          userName: this.userName, //用户名
          orderId: this.orderID,//订单id
          userAddress: this.accountAddress, //用户地址
          replyNum: this.replyNum,//回复次数
          resourceId: this.resourceId === 'selected' ? this.resourceId = '' : this.resourceId,//问题来源
          problemStatus: this.contentType === 'selected' ? this.contentType =  '' : this.contentType,// 问题状态
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
