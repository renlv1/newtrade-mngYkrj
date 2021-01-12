<template>
  <div class="c-page mar-right transaction-list">
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="userId" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="sendUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">币种：</div>
          <div class="input-wrap"><input v-model.trim="sendAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ tradetext|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                <vue-scroll :ops="ops" style="height: 300px">
                  <el-dropdown-item :command="item" v-for="(item, index) in tradeArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </vue-scroll>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">时间：</div>
          <el-date-picker
            placeholder="开始时间"
            v-model="startTime"
            type="datetime"
            default-time="00:00:00"
            :picker-options="pickerBeginDateBefore"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>

          <span style="margin-right: 10px">到</span>

          <el-date-picker
            placeholder="结束时间"
            v-model="endTime"
            type="datetime"
            default-time="23:59:59"
            :picker-options="pickerBeginDateAfter"
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
          <div class="center">
            <div class="common-thead">
              <div class="thead">ID</div>
              <div class="thead">用户名</div>
              <div class="thead tbody-address">币种</div>
              <div class="thead">类型</div>
              <div class="thead tbody-address">业务id</div>
              <div class="thead">变动前余额</div>
              <div class="thead">冻结变动金额</div>
              <div class="thead">最终金额</div>
              <div class="thead">操作</div>
            </div>
            <div v-for="(item, index) in isListNull(list)" :key="index" class="tbody-wrap">
              <div class=" common-tbody">
                <div class="tbody">{{item.id}}</div>
                <div class="tbody">{{item.userName}}</div>
                <div class="tbody tbody-address">{{item.currency}}</div>
                <div class="tbody">{{changeTypeFn(item.changeType)}}</div>
                <div class="tbody tbody-address">{{item.orderId}}</div>
                <div class="tbody">{{item.beforeChangeBalance}}</div>
                <div class="tbody">{{item.changeAmountFreeze}}</div>
                <div class="tbody">{{item.finalBalance}}</div>
                <div @click="upload(item)" class="blue-td cursor tbody" v-show="item.packFlag === false"> <span>展开</span><img src="../../../src/assets/img/kai.png"></div>
                <div @click="shouqi(item)" class="blue-td cursor tbody" v-show="item.packFlag === true"> <span>收起</span><img src="../../../src/assets/img/shou.png"></div>
              </div>
              <div class="add-more" v-show="item.packFlag === true">
                <div class="add-up">
                  <span>变动金额：{{item.changeAmount || '0'}}</span>
                  <span>最终冻结金额: {{Number(item.finalFreezeBalance ) || '0'}}</span>
                  <span>委托前冻结余额: {{Number(item.entustBeforeChangeFreezeBalance) || '0'}}</span>
                  <span>委托后冻结余额: {{Number(item.entrustChangeAmountFreeze) || '0'}}</span>
                  <span>委托最终冻结余额: {{Number(item.entrustFinalFreezeBalance ) || '0'}}</span>
                  <span>变动前冻结余额: {{Number(item.beforeChangeFreezeBalance) || '0'}}</span>
                  <span>创建时间: {{item.createtime}}</span>
                  <span>更新时间: {{item.updatetime}}</span>
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
</template>

<script>
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
	      ops: {
		      vuescroll: {},
		      scrollPanel: {
			      easing: 'easeInQuad',
			      scrollingX: false,//是否启用 x 或者 y 方向上的滚动
		      },
		      rail: {
			      background: '#01a99a',
			      opacity: 0,
			      size: '10px',
			      specifyBorderRadius: false,
			      gutterOfEnds: null,    //轨道距 x 和 y 轴两端的距离
			      gutterOfSide: '0',   //距离容器的距离
			      keepShow: false,   //是否即使 bar 不存在的情况下也保持显示
			      border:'none'    //边框
		      },
		      bar: {
			      hoverStyle: true,
			      onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
			      background: '#eee',   //颜色
		      }
	      },
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.startTime
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
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
        sendUserName: '',
        sendAddress: '',
        recAddress: '',
        callbackArr: [],
        confirmArr: [],
        tradetext: '',
        tradeArr: [],
        typeArr: [],
        shareName: '',
        bossName2: '',
        userId: '',
        userName: '',
        statusArr: [],
        statustext: '',
        transfertoBalance:'',//转到余额
        curren: '',//币种
        balanceEntrustFreeze: '',//委托冻结余额
        blockedBalanceAmout:'',//冻结余额
        balanceAmout: '',//余额
        accountUser: '',//账户用户名
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
        pageSize: 10,
        loadShow: false,
        showDialog: false,
        userAddress: '',
        currency: '',
        idValue: '',
        totaltext: '',
        changeType: '',
        status: '',
      }
    },
    created() {
      this.getType()
      // this.getData()
    },
    methods: {
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=user.UserAccountLog$ChangeTypeEnum&flag=true&state=1`).then(res => {
          if (res) {
            this.tradeArr = res.data.data.ChangeTypeEnum
          }
        })
      },
      changeTypeFn (item) {
        if (item !== null && this.tradeArr.length >0 && item > 0) {
          for (let i in this.tradeArr){
            if(item === parseInt(this.tradeArr[i].id)){
              return this.tradeArr[i].text
            }
          }
        }
      },
      handleCommand(command) {
        this.tradetext = command.text
        this.changeType = command.id
      },
      upload(item) {
        item.packFlag = !item.packFlag
      },
      shouqi(item) {
        item.packFlag = !item.packFlag
      },
      resetFields() {
        this.changeType = ''
        this.tradetext = ''
        this.recAddress = ''
        this.sendAddress = ''
        this.sendUserName = ''
        this.totaltext = ''
        this.statustext = ''
        this.userAddress = ''
        this.state = ''
        this.currencyText = ''
        this.currency = ''
        this.userId = ''
        this.userName = ''
        this.startTime = ''
        this.endTime = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/userAccountLog/queryUserAccountLogList', {
          id: this.userId,
          userName: this.sendUserName,
          currency: this.sendAddress,
          orderId: this.receiveUserName,
          changeType: this.changeType > 0 ? this.changeType: '',
          startDateStr: this.$changeDate(this.startTime, '-', 8),
          endDateStr: this.$changeDate(this.endTime, '-', 8),
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if( res.data) {
            this.loadShow = false
            let list = res.data.page.list
            list.forEach(item => {
              item.packFlag = false
            })
            this.list = list
            this.total = res.data.page.totalCount
          } else {
            this.list = []
            this.total = 0
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
    max-height 320px!important
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
