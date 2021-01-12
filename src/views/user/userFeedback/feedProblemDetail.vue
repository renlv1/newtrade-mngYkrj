<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/userFeedProblem" class="title-m">后台转账日志 </router-link>
        <span> / 问题详情</span>
      </div>
      <div class="btn-right">
        <span class="pay-money" @click="payMoney()">打钱</span>
        <span class="btn-save" @click="$router.push({path: '/user/userFeedProblem/answerQuestion',query: {item : JSON.stringify(item)}})">回复</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <li class="li-item">
          <div class="li-left">ID</div>
          <div class="li-right">{{item.id}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">订单id</div>
          <div class="li-right">{{item.orderId  || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">用户名</div>
          <div class="li-right">{{item.userName  || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">问题来源</div>
          <div class="li-right">{{$problemSources(item.resourceId)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">问题类型</div>
          <div class="li-right">{{$contentType(item.contentType)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">问题内容</div>
          <div class="li-right">{{item.content  || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">被回复次数</div>
          <div class="li-right">{{item.replyNum  || '0'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">问题状态</div>
          <div class="li-right">{{$problemStatus(item.problemStatus)}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">创建时间</div>
          <div class="li-right">{{$changeDate(item.createTime) || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">更新时间</div>
          <div class="li-right">{{$changeDate(item.updateTime) || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">备注</div>
          <div class="li-right">{{item.remark || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">备用字段1</div>
          <div class="li-right">{{item.backup1 || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">收款用户地址</div>
          <div class="li-right">{{item.userAddress  || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">备用字段2</div>
          <div class="li-right">{{item.backup2 || '-'}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">备用字段3</div>
          <div class="li-right">{{item.backup3 || '-'}}</div>
        </li>
      </ul>
    </div>
    <el-dialog width="30%" :visible.sync="showDialog" title="打钱">
      <div class="problem-box">
        <label>打钱对象</label>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand5">
              <span class="el-dropdown-link">
                {{ payText|| '未选择'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu class="menu dialog-input" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in paymentArr" :key="index">{{item.text}}
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
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        errTip: '',
        paymentArr: [
          {text: '给用户打钱',id: 1},
          {text: '给老板打钱',id: 2},
        ],
        showDialog: false,
        item: JSON.parse(this.$route.query.item),
        data: '',
        payText: '',
        payType: '',
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 打钱
      handleCommand5(command) {
        this.errTip = ''
        this.payText = command.text
        this.payType = command.id
      },
      paySure() {
        if(!this.payType) {
          this.errTip =  '请选择打钱对象'
          return
        }
        let url = ''
        this.payType === 1 ? url = '/user/problem/giveUserMoney' : url = '/user/problem/giveBossMoney'
        this.$fetch.post(url,{
          problemid: this.item.id
        }).then(res => {
          if(res.code === 0) {
            this.showDialog  = false
            Dialog({
              title: '',
              content: res.msg,
              // okFn: () => {
              //   this.getData()
              // }
            })
          } else {
            this.showDialog  = false
          }
        }).catch(err => {
          this.showDialog  = false
          console.log(err)
        })
      },
      payMoney() {
        this.errTip = ''
        this.payType = ''
        this.payText = ''
        this.showDialog  = true
      },
      getData() {
        this.$fetch.post(`/user/problem/preReplyProblem?id=${this.item.id}`).then(res => {
          if(res.code === 0) {
            this.data = res.data.problem
          }
        })
      }
    }
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
  
  .zoom-enter-to{
    transition: none;
  }
</style>
