<template>
  <div class="c-page mar-right transaction-list">
    <div class="page-wrap wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="id" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">发送用户：</div>
          <div class="input-wrap"><input v-model.trim="sendUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">接收用户：</div>
          <div class="input-wrap"><input v-model.trim="receiveUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ stateText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in stateArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">支付类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ payText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu payment" slot="dropdown" >
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in payArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">回调状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{callbackText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 4)" v-for="(item, index) in callbackArr" :key="index">{{item.text}}
                </el-dropdown-item>
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
              <td>ID</td>
              <td>订单id</td>
              <td>发送用户</td>
              <td>接收用户</td>
              <td>币种</td>
              <td>金额</td>
              <td>手续费</td>
              <td>状态</td>
              <td>支付类型</td>
              <td>回调状态</td>
              <td>创建时间</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in isListNull(list)" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.orderId}}</td>
              <td>{{item.sendUserName}}</td>
              <td>{{item.receiveUserName}}</td>
              <td >{{item.currency}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.feeAmount}}</td>
              <td>{{stateFn(item.status)}}</td>
              <td>{{payType(item.paymentType)}}</td>
              <td>{{callbackStateFn(item.callbackState)}}</td>
              <td>{{item.createtime}}</td>
              <td class="blue-td" >
                <router-link tag="a" :to="{path: '/user/tradeRecord/tradeDetail',query: {id: item.id, obj: JSON.stringify(item)}}">查看</router-link>
              </td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
    </div>
  </div>
</template>

<script>
  // import Dialog from '@/components/dialog/dialog'
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
        id: '',
        sendUserName: '',//发送用户
        receiveUserName: '',//接受用户
        stateText: '',
        stateArr: [],
        payArr: [],
        payText: '',
        callbackArr: [],
        callbackText: '',
        startTime: '',
        endTime: '',
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        state: '',//状态
        paymentType: '',//支付类型
        orderType:'',//订单类型
        callbackState: '',//回调状态
        currency: '',//币种
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        let url ='/public/enumValue?classPackage=trade.Transaction$CallbackEnum;trade.Transaction$StateEnum;trade.Transaction$PaymentTypeEnum&flag=true&state=1'
        this.$fetch.get(`${url}`).then(res => {
          if (res.code === 0) {
            this.stateArr = res.data.data.StateEnum  // 状态
            this.payArr = res.data.data.PaymentTypeEnum // 支付状态
            this.callbackArr = res.data.data.CallbackEnum // 回调状态
          }
        })
      },
      resetFields() {
        this.stateText = ''
        this.state = ''
        this.orderType = ''
        this.payText = ''
        this.paymentType = ''
        this.callbackText = ''
        this.callbackState = ''
        this.currency = ''
        this.receiveUserName = ''
        this.sendUserName = ''
        this.id = ''
        this.startTime = ''
        this.endTime = ''
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
        if(id === 1) {
          this.stateText = command.text
          this.state = command.id
        } else if (id === 2) {
          this.payText = command.text
          this.paymentType = command.id
        } else if (id === 4) {
          this.callbackText = command.text
          this.callbackState = command.id
        }
      },
      // 回调状态
      handleCommand4(command) {
        this.callbackText = command.text
        this.callbackState = command.id
      },
      // 支付类型
      handleCommand2(command) {
        this.payText = command.text
        this.paymentType = command.id
      },
      // 状态
      handleCommand(command) {
        this.stateText = command.text
        this.state = command.id
      },
      callbackStateFn (item) {
        if (item !== null && item >=1 && this.callbackArr.length > 0) {
          for (let i in this.callbackArr) {
            if (item === parseInt(this.callbackArr[i].id)) {
              return this.callbackArr[i].text
            }
          }
        }
      },
      payType(index) {
        if (index !== null && index >= 1 && this.payArr.length > 0) {}
        for (let i in this.payArr) {
          if (index === parseInt(this.payArr[i].id)) {
            return this.payArr[i].text
          }
        }
      },
      stateFn (item) {
        if (item !== null && item >= -1 && this.stateArr.length > 0) {
          for (let i in this.stateArr) {
            if (item === parseInt(this.stateArr[i].id)) {
              return this.stateArr[i].text
            }
          }
        }
        return '-'
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/trade/transaction/queryTransactionList', {
          id: this.id,
          sendUserName: this.sendUserName,// 发送用户
          receiveUserName: this.receiveUserName,// 接受用户
          status: this.state >= -1 ? this.state : '', //状态
          paymentType: this.paymentType >= 1 ? this.paymentType: '',//支付类型
          callbackState: this.callbackState >= 1 ? this.callbackState: '',//回调状态
          startDateStr: this.$changeDate(this.startTime, '-', 8), //开始-更新时间
          endDateStr:  this.$changeDate(this.endTime, '-', 8), //最后登录时间
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if(res.code === 0) {
            this.list = res.data.page.list
            this.total = res.data.page.totalCount
          } else {
            this.list = []
          }
        }).catch(err => {
          this.loadShow = false
        })
      },
      search() {
        this.total = 1 // hook listWrap组件的loading
        this.getData()
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
                margin-right: 26px;
                background-color #fff
                border: 1px solid #DCDFE6;
                border-radius: 6px;
                padding: 0 10px;
                font-size 15px
                height: 40px;
        .btns
            margin-top 30px
            //margin-right 50px
            .btn
                cursor pointer
</style>
