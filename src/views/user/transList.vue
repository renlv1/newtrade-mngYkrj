<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">查询交易列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">买入用户：</div>
        <div class="input-wrap"><input v-model="buyUserName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">买入用户地址：</div>
        <div class="input-wrap"><input v-model="buyUserAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">卖出用户：</div>
        <div class="input-wrap"><input v-model="sellUserName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">卖出用户地址：</div>
        <div class="input-wrap"><input v-model="sellUserAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">委托日期：</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>

        <span style="margin-right: 20px">到</span>

        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td style="width: 7%">买入用户</td>
            <td style="width: 14%">买入用户地址</td>
            <td>卖出用户</td>
            <td style="width: 14%">卖出用户地址</td>
            <td>买入价格</td>
            <td>卖出价格</td>
            <td>成交价格</td>
            <td style="width: 6%">成交数量</td>
            <td>成交总额（USD）</td>
            <td style="width: 6%">状态</td>
            <td>交易时间</td>
          </tr>
          <tr v-for="(item, index) in isListNull(list)" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.buyname}}</td>
            <td>{{item.buyAddress}}</td>
            <td>{{item.salename}}</td>
            <td>{{item.saleAddress}}</td>
            <td>{{item.buyPrice}}</td>
            <td>{{item.salePrice}}</td>
            <td>{{item.tradePrice}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.tradeTotalPrice}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.state)}}</td>
            <td>{{item.createAt | time}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif"/>
          </div>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buyUserName: '',
      buyUserAddress: '',
      sellUserName: '',
      sellUserAddress: '',
      changeText: '',
      changeType: '',
      ChangeTypeEnumList: [],
      startTime: '',
      endTime: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.buyUserName = ''
      this.buyUserAddress = ''
      this.sellUserName = ''
      this.sellUserAddress = ''
      this.changeText = '全部'
      this.changeType = -1
      this.startTime = ''
      this.endTime = ''
    },

    handleCommand(command) {
      this.changeText = command.text
      this.changeType = command.id
    },

    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let state = parseInt(this.changeType, 10) >= 0 ? parseInt(this.changeType, 10) : ''
        this.$fetch.post(`oldtrade/entrust/queryTradeList`, {
          buyname: this.buyUserName,
          buyAddress: this.buyUserAddress,
          salename: this.sellUserName,
          saleAddress: this.sellUserAddress,
          state: state,
          startDate: this.startTime,
          endDate: this.endTime,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: 10,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
    },
    getDropDownList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'RadarTradeRecord$StateEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.ChangeTypeEnumList = res.data.data.StateEnum
      })
    },
    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    position relative
    display flex
    flex-wrap wrap
    input {
      width 120px
      height 25px
    }
    .search-box
      margin 15px 0
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 25px
        min-width: 130px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height 25px
    .btns
      @media screen and (max-width 1800px) {
        margin-top 0
      }
      .btn
        line-height 25px
        height 25px
        width auto
        padding 0 20px
        cursor pointer
</style>

<style scoped>
  .el-date-editor.el-input  {
    width: 180px !important;
    height: 25px !important;
  }
  >>>.el-date-editor.el-input input {
    padding: 0 10px;
    width: 160px;
    height: 25px;
  }
</style>
