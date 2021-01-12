<template>
    <div class="c-page mar-right transaction-list">
        <div class="page-wrap">
            <div class="search">
                <div class="search-box">
                    <div class="label">时间：</div>
                    <el-date-picker
                            placeholder="开始时间"
                            v-model="startTime"
                            type="datetime"
                            default-time="00:00:00"
                            :picker-options="pickerOptionsStart"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>

                    <span style="margin-right: 10px">到</span>

                    <el-date-picker
                            placeholder="结束时间"
                            v-model="endTime"
                            type="datetime"
                            default-time="23:59:59"
                            :picker-options="pickerOptionsEnd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </div>
                <div class="btns">
                    <div class="btn" @click="searchInput">查询</div>
                    <div class="btn black" @click="clearInput">清空</div>
                </div>
            </div>
            <div class="list" v-show="moneyObjShow">
                <div class="li-item">
                    <div class="name">充值金额</div>
                    <div class="num">{{moneyObj.depositAmount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">充值笔数</div>
                    <div class="num">{{moneyObj.depositCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">USDT的ERC20充值</div>
                    <div class="num">{{moneyObj.USDTERCCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">USDT的OMNI提现</div>
                    <div class="num">{{moneyObj.USDTOMNIDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">LTC充值金额</div>
                    <div class="num">{{moneyObj.LTCCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">ETH充值金额</div>
                    <div class="num">{{moneyObj.ETHCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">ETH提现金额</div>
                    <div class="num">{{moneyObj.ETHDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">BTC充值金额</div>
                    <div class="num">{{moneyObj.BTCCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">有效广告商数量</div>
                    <div class="num">{{moneyObj.validCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">BTC提现金额</div>
                    <div class="num">{{moneyObj.BTCDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">USDT的OMNI充值</div>
                    <div class="num">{{moneyObj.USDTOMNICount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">BCH提现金额</div>
                    <div class="num">{{moneyObj.BCHDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">LTC提现金额</div>
                    <div class="num">{{moneyObj.LTCDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">活跃广告商数量</div>
                    <div class="num">{{moneyObj.bussCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">XRP充值金额</div>
                    <div class="num">{{moneyObj.XRPCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">BCH充值金额</div>
                    <div class="num">{{moneyObj.BCHCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">USDT的ERC20提现</div>
                    <div class="num">{{moneyObj.USDTERCDrawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">提现笔数</div>
                    <div class="num">{{moneyObj.drawCount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">提现金额</div>
                    <div class="num">{{moneyObj.drawAmount}}</div>
                </div>
                <div class="li-item">
                    <div class="name">XRP提现金额</div>
                    <div class="num">{{moneyObj.XRPDrawCount}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  /*eslint-disable*/
  import Dialog from '@/components/dialog/dialog'
  export default {
    data () {
      return {
        startTime: '',
        endTime: '',
        moneyObj: {},
        moneyObjShow: false,
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
        }
      }
    },
    created () {},
    methods: {
      // 搜索
      searchInput () {
        if (this.startTime !== '' && this.endTime !== '') {
          this.getData()
        } else {
          this.moneyObjShow = false
        }
      },
      clearInput () {
        this.startTime = ''
        this.endTime = ''
      },
      // 列表数据
      getData () {
        this.$store.commit('SET_LOADING', true)
        this.$fetch.post('/coin/census/queryTcCensusList', {
          startAtStr: this.startTime,
          endAtStr: this.endTime,
        }).then(res => {
          this.$store.commit('SET_LOADING', false)
          this.moneyObj = res.data.result
          if (this.moneyObj !== '' && this.moneyObj) {
            this.moneyObjShow = true
          }
        }).catch(err => {
          this.$store.commit('SET_LOADING', false)
        })
      }
    },
    components: {
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .input-t-a
        width: 200px
        margin-right: 20px
        input
            width: 100%
    .wrap
        background-color: @white;
    .search
        padding-top 20px
        flex-wrap wrap
        justify-content space-between
    .list
        display flex
        align-items center
        flex-flow wrap
        justify-content flex-start
        .li-item
            width 50%
            border-bottom 1px solid #f1f1f1
            .name
                line-height 40px
            .num
                line-height 40px
                color #8D8D8D
    .table-a
        .red
            color #f00
    .tree-wrap{
        /deep/ .el-dialog{
            width: 500px;
        }
        .tit{
            text-align: center;
            font-size: 18px;
            padding-bottom: 20px;
            margin-bottom: 10px;
        }
        .btns{
            padding: 20px 0
            display: flex
            align-items center
            justify-content center
        }
    }
    .dialog-t-a
    >>> .g-dialog-wrap
            width: 700px
    .search-t
        display: flex
    .list-check
        height: 36px
        display: flex
        align-items center
        font-size: 14px
        color #000
        margin-bottom: 5px
        cursor pointer
        .check-a
            width: 20px
            height: 20px
            border: 1px solid #e5e8ed
            margin-right: 20px
            &.checked
                border none
    //background: url("../../../assets/img/checked.svg") no-repeat center / cover
    .b-a
        margin-top: 30px
    .label
        width: 80px
        line-height: 36px
    .search-box
        height: 36px
        line-height 36px
        .input-wrap
            flex 1
            background-color: #f7f7f7
            line-height: 36px
            padding: 0 10px
    .dropdown-menu3
        width: 300px !important
        height: 500px !important
        overflow-x hidden !important
    >>> .el-dropdown-menu__item
            width: 100%
    .dialog-t
        .v-box
            margin-top: 30px
        .msg-t
            color #f00
            margin: 10px 0 10px 80px
        .search-box
            .label
                line-height: 36px
                width: 80px
            .input-wrap
                flex 1
                &.dept-input
                    background-color: #eee
                    border: 1px solid #e5e8ed
                    border-radius 4px
                    cursor pointer
                    line-height 36px
                    padding: 0 10px
                    .no-name
                        color #b3b3b3
                input
                    width: 100%
                textarea
                    width: 100%
                    height: 80px
                    border: 1px solid #e5e8ed
                    border-radius 4px
                    padding: 10px
            .dropdown-wrap
                border-radius 4px
                border: 1px solid #e5e8ed
                padding: 0 10px
</style>
