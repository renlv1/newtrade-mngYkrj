<template>
    <!--api-->
  <div class="transaction-list">
    <div class="page-wrap">
      <div class="search clearfix">
        <div class="input-item">
          <div class="label">ID</div>
          <div class="input-wrap"><input type="number" v-model.trim="bankId"></div>
        </div>
        <div class="input-item">
          <div class="label">用户名</div>
          <div class="input-wrap"><input type="text" v-model.trim="username"></div>
        </div>
        <div class="input-item">
          <div class="label">类型</div>
          <div class="input-wrap dropdown-input">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link" >
                {{orderTypeText}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu dropdown-menu-hidden" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in orderType" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="input-item">
          <div class="label">接单充值</div>
          <div class="input-wrap dropdown-input">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{stateEnumText}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in stateEnum" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="input-item">
            <!--例,修改-->
          <div class="label">时间</div>
          <div class="input-wrap">
            <el-date-picker
              v-model="startDate"
              :picker-options="pickerBeginDateBefore"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              default-time="00:00:00"
              type="datetime">
            </el-date-picker>
          </div>
          <span class="margin">到</span>
          <div class="input-wrap">
            <el-date-picker
              :picker-options="pickerBeginDateAfter"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              v-model="endDate"
              default-time="23:59:59"
              type="datetime">
            </el-date-picker>
          </div>
        </div>
        <div class="input-item btn-ctrl-w">
          <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
          <div class="btn-ctrl" @click="search">查询</div>
        </div>
      </div>
      <list-wrap :list="listData" :total="total" @change="getData" :pageSize="pageSize">
        <div class="web-table">
          <table>
            <tr class="thead">
              <td>ID</td>
              <td>用户名</td>
              <td>用户地址</td>
              <td>类型</td>
              <td>银行名称</td>
              <td>户名</td>
              <td>银行卡号</td>
              <td>状态</td>
              <td>币种</td>
              <td>创建时间</td>
              <td>更新时间</td>
              <td>接单充值</td>
              <td>提现</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in isListNull(listData)" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.userName}}</td>
              <td class="text-left">{{item.userSystemCode}}</td>
              <td>{{statusFn4(item.bankType)}}</td>
              <td>{{isEmptyText(item.bankName)}}</td>
              <td>{{isEmptyText(item.realName)}}</td>
              <td>{{item.bankNumber}}</td>
              <td>{{statusFn1(item.status)}}</td>
              <td>{{item.currency}}</td>
              <td>{{item.createAtStr}}</td>
              <td>{{item.updateAtStr}}</td>
              <!--<td v-html="timeStrDate(item.createAt)" class="nowrap text-left"></td>
              <td v-html="timeStrDate(item.updateAt)" class="nowrap text-left"></td>-->
              <td>{{statusFn2(item.supportDeposit)}}</td>
              <td>{{statusFn3(item.supportDraw)}}</td>
              <td class="blue-td">
                <router-link tag="a" :to="{path: '/trade/bankInfo/bankInfoDetails', query: {id:item.id}}">查看</router-link>
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

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      loadShow: false,
      loadingShow: false,
      searchId: '',
      dialogFormVisible: false,
      pageSize: 20,
      dialogVisible: false,
      listData: [],
      bankId: '',
      username: '',
      startDate: '',
      endDate: '',
      state: '',
      orderTypeState: '',
      total: 0,
      //        日期控件
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endDate
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      pageIndex: 1,
      callbackStatus: '全部',
      stateEnumText: '全部',
      orderTypeText: '全部',
      bankStatusEnum: [],
      stateEnum: [
	      {id: 'selected', text: '全部'},
	      {id: 0, text: '不支持'},
	      {id: 1, text: '支持'},
      ],
      orderType: []
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
	  statusFn1 (status) { // 状态
      return this.bankStatusEnum[status].text
    },
	  statusFn4 (status) { // 银行卡类型
		  return this.orderType[status].text
    },
	  statusFn2 (status) { //支持接单充值 0不支持 1支持
		  if (status === 0) return '不支持'
		  if (status === 1) return '支持'
	  },
	  statusFn3 (status) { // //支持提现 0不支持 1支持
		  if (status === 0) return '不支持'
		  if (status === 1) return '支持'
	  },
    cancelSearch() {
      this.searchId = ''
      this.dialogFormVisible = false
    },
    showDialogFn() {
      this.dialogFormVisible = true
      this.searchId = ''
    },
    emptyFn() {
      this.bankId = ''
      this.username = ''
      this.startDate = ''
      this.endDate = ''
      this.state = ''
      this.orderTypeState = ''
      this.callbackStatus = '全部'
      this.stateEnumText = '全部'
      this.orderTypeText = '全部'
    },
    // btnCtrlFn(id) {
    //   this.$router.push({
    //     path: '/trade/bankInfo/bankInfoDetails',
    //     query: {id}
    //   })
    // },
    // 获取状态
    getStatus() {
      this.$fetch.get(`/public/enumValue?classPackage=trade.BankInfo$BankTypeEnum;trade.BankInfo$BankStatusEnum;trade.BankInfo$SupportDepositEnum&flag=true&state=1`).then(res => {
        if (res.code === 0) {
	        this.$store.commit('SET_BANKLIST', res.data.data)
          this.orderType = res.data.data.BankTypeEnum
          this.bankStatusEnum = res.data.data.BankStatusEnum
        }
      })
    },
    // 获取列表数据
    getData(index, pageSize) {
      if (parseInt(this.total) !== 0) {
        if (pageSize) {
          this.pageSize = pageSize
        }
        let dataObj = {
          pageIndex: index,
          pageSize: this.pageSize
        }
        if (this.bankId) dataObj.id = this.bankId
        if (this.username) dataObj.username = this.username
        if (this.startDate) dataObj.startDateStr = this.$changeDate(this.startDate, '-', 8)
        if (this.endDate) dataObj.endDateStr = this.$changeDate(this.endDate, '-', 8)
        if (this.state || this.state === 0) dataObj.supportDeposit = this.state
        if (this.orderTypeState) dataObj.bankType = this.orderTypeState
        this.loadShow = true
        this.$fetch.post(`/trade/bankInfo/queryBankInfoList`, dataObj).then(res => {
          this.loadShow = false
          if(res.data.page) {
            this.listData = res.data.page.list
            this.total = res.data.page.totalCount
          } else {
            this.listData = []
          }
        })
      }
    },
    commandChange (commend) {
      let num = commend.index
      if (num === 1) {
        this.orderTypeText = commend.item.text
        this.orderTypeState = Number(commend.item.id)
      } else if (num === 2) {
        this.stateEnumText = commend.item.text
        this.state = Number(commend.item.id)
      }
    },
    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData(1,  20)
    },
  }
}
</script>

<style lang="less" scoped>
  .el-dropdown-link{
    display: flex!important;
  }
  .view-page{
    .input-item-w{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }
</style>
