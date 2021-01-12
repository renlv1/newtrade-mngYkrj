<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/userCheck" class="title-m">用户查询 </router-link>
        <span> / 查看用户资产</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <li class="li-item">
          <div class="li-left">上级用户</div>
          <div class="li-right">{{data.refUserName || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">下级用户</div>
          <template v-if="juniorLine">
            <div class="li-right li-level" v-for="(item,index) in userLevel" :key="index">{{item}}</div>
            <div class="lower-level" @click="levelBtn()" :class="{'disable': disableFlag}" v-if="juniorLine"> 获取下级用户</div>
          </template>
           <template v-else>-</template>
        </li>
        <li class="li-item">
          <div class="li-left">达尔文</div>
          <div class="li-right">{{data.darwin || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">余额的优惠金额</div>
          <div class="li-right">{{data.darwinDis || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">开通达尔文获得的优惠金额</div>
          <div class="li-right">{{data.balanceDis || '-'}}</div>
        </li>
        <div class="web-table">
          <table class="center">
            <tr class="thead">
              <td width="6%">ID</td>
              <td>余额</td>
              <td>冻结余额</td>
              <td>委托冻结余额</td>
              <td>锁定的余额</td>
              <td>币种</td>
            </tr>
            <template v-if="list &&list.length > 0">
              <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
                <td>{{item.id}}</td>
                <td>{{item.balance}}</td>
                <td>{{item.balanceFreeze}}</td>
                <td>{{item.balanceEntrustFreeze}}</td>
                <td >{{item.balanceLock}}</td>
                <td>{{item.currency}}</td>
              </tr>
            </template>
            <template v-else>
              <div class="empty">
                <img src="@img/empty.png" alt>
                <p>暂无数据</p>
              </div>
            </template>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  // import Dialog from '@/components/dialog/dialog'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        disableFlag: false,
        userLevel: [],//下级用户
        loadShow: false,
        list: [],
        id: this.$route.query.id,
        data: '',
        juniorLine: ''
      }
    },
    created() {
      this.getData()
    },
    methods: {
      levelBtn() {
        this.$fetch.post(`/user/userAction/getUserSubList`, {
          id: this.id,
          junior: this.juniorLine
        }).then(res => {
          if(res.code === 0) {
            this.disableFlag = true
            Message.success('获取成功')
            this.userLevel = this.userLevel.concat( res.data.juniorLine)
          }
        })
      },
      getData() {
        this.loadShow = true
        this.$fetch.post(`/user/userAction/checkUserAsset`,{
          userId: this.id
        }).then(res => {
          if(res.code === 0) {
            this.loadShow = false
            if(res.data.accountList) {
              this.list = res.data.accountList
            }
            this.juniorLine = res.data.juniorLine
            this.userLevel = this.userLevel.concat( this.juniorLine)
            this.data = res.data
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .load-list-wrap{
    position: relative;
    min-height: 300px;
    width 100%
  }
  .empty{
    position absolute
    top 76%
    left 50%
    transform translate(-50%,-50%)
    text-align: center;
    font-size: 13px;
    color: #999999;
    height: auto!important;
    width: 100%;
    display flex
    align-items center
    justify-content: center;
    flex-direction: column;
    img{
      max-width: 100px;
      margin: 20px 0;
    }
  }
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
  
  .zoom-enter-to{
    transition: none;
  }
</style>
