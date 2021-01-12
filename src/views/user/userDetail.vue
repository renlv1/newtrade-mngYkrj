<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="/user/userInfo">用户管理 ></router-link>
      <router-link to="">用户详情</router-link>
    </div>
    <div class="web-table" style="width: 94%; min-height: auto;">
      <table>
        <tr class="thead">
          <td width="6%">资产ID</td>
          <td>用户名</td>
          <td>昵称</td>
          <td width="15%">账户地址</td>
          <td>邀请人</td>
          <td>邀请人用户名</td>
          <td width="15%">激活状态</td>
          <td>secret对应邮箱</td>
          <td>openId</td>
        </tr>
        <tr>
          <td>{{userInfo.id}}</td>
          <td>{{userInfo.username}}</td>
          <td>{{userInfo.nickname || '-'}}</td>
          <td>{{userInfo.address || '-'}}</td>
          <td>{{userInfo.ref || '-'}}</td>
          <td>{{userInfo.refUserName || '-'}}</td>
          <td>{{$userStatus2Text(userInfo.status, 1)}}</td>
          <td>{{userInfo.emailOfSecret || '-'}}</td>
          <td>{{userInfo.openId || '-'}}</td>
        </tr>
      </table>
    </div>

    <div style="width: 94%;">
      <el-tabs style="border-radius: 5px;" type="border-card" v-model="activeName" @tab-click="handleClick">
        <!-- 账户信息 -->
        <el-tab-pane label="账户信息" name="first">
          <div class="pane-box">
            <div class="pane-title" style="display: flex; justify-content: space-between">
              <h5>{{userInfo.username}}用户信息</h5>
              <div class="btns">
                <div class="btn" @click="modify">保存修改</div>
                <div class="btn">重置登录密码</div>
                <div class="btn">重置交易密码</div>
              </div>
            </div>
            <div
              style="margin-top: 20px; width: 90%; border-right: 1px solid #e6e6e6; border-left: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6">
              <div class="table-box">
                <div class="key">账户状态</div>
                <div class="value">
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{$userStatus2Text(parseInt(userInfo.status, 10), 1)}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="menu" slot="dropdown">
                      <el-dropdown-item :command="{val: '0', type: '0'}">注册冻结</el-dropdown-item>
                      <el-dropdown-item :command="{val: '1', type: '0'}">正常</el-dropdown-item>
                      <el-dropdown-item :command="{val: '2', type: '0'}">冻结中</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="table-box">
                <div class="key">绑定邮箱</div>
                <div class="value">
                  <input class="big-input" v-model="userInfo.email" />
                </div>
              </div>
              <div class="table-box">
                <div class="key">手机号码</div>
                <div class="value">
                  <span style="margin-right: 10px">+{{userInfo.phoheCode || 86}}</span>
                  <input class="small-input" v-model="mobile" />
                </div>
              </div>
              <div class="table-box">
                <div class="key">支付密码</div>
                <div class="value">
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{$userStatus2Text(parseInt(userInfo.openTradePassword, 10), 3)}}<i
                      class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="menu" slot="dropdown">
                      <el-dropdown-item :command="{val: '1', type: '1'}">未设置</el-dropdown-item>
                      <el-dropdown-item :command="{val: '2', type: '1'}">开启</el-dropdown-item>
                      <el-dropdown-item :command="{val: '3', type: '1'}">关闭</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="table-box">
                <div class="key">手机验证码</div>
                <div class="value">
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{$userStatus2Text(parseInt(userInfo.openMobileCode, 10), 3)}}<i
                      class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="menu" slot="dropdown">
                      <el-dropdown-item :command="{val: '1', type: '2'}">未设置</el-dropdown-item>
                      <el-dropdown-item :command="{val: '2', type: '2'}">开启</el-dropdown-item>
                      <el-dropdown-item :command="{val: '3', type: '2'}">关闭</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="table-box">
                <div class="key">谷歌验证码</div>
                <div class="value">
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{$userStatus2Text(parseInt(userInfo.openGoogleCode, 10), 3)}}<i
                      class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="menu" slot="dropdown">
                      <el-dropdown-item :command="{val: '1', type: '3'}">未设置</el-dropdown-item>
                      <el-dropdown-item :command="{val: '2', type: '3'}">开启</el-dropdown-item>
                      <el-dropdown-item :command="{val: '3', type: '3'}">关闭</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="table-box">
                <div class="key">注册时间</div>
                <div class="value">
                 {{userInfo.createAt}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">用户来源</div>
                <div class="value">
                  {{$userStatus2Text(userInfo.userSource, 2)}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">数字交易CNY开关</div>
                <div class="value">
                  {{userInfo.coinCnyRateShow == 1 ? '关' : '开'}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">AR累计藏宝量</div>
                <div class="value">
                  {{userInfo.arMineTotal || 0}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">累计藏宝量</div>
                <div class="value">
                  {{userInfo.mineTotal || 0}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">优先权值</div>
                <div class="value">
                  {{userInfo.userPriorityTotal || '-'}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">已使用优先权值</div>
                <div class="value">
                  {{userInfo.userPriorityUseTotal || '-'}}
                </div>
              </div>
              <div class="table-box">
                <div class="key">联系方式</div>
                <div class="value">
                  {{userInfo.contactWay || '-'}}
                </div>
              </div>
            </div>

          </div>
        </el-tab-pane>
        <!-- 资产信息 -->
        <el-tab-pane label="资产信息" name="second">
          <div style="margin-top: 20px; width: 90%; border-right: 1px solid #e6e6e6; border-left: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6">
            <div class="table-box">
              <div class="key">所有上级用户：</div>
              <div class="value">{{refNames || '- -'}}</div>
            </div>
            <div class="table-box">
              <div class="key">所有上级用户地址：</div>
              <div class="value">{{userRefs || '- -'}}</div>
            </div>
          </div>
          <div class="pane-box">
            <h5>USD资产</h5>
            <table style="width: 90%" class="web-table-grid">
              <tr class="thead" style="background: #7d7d7d">
                <td>USD余额</td>
                <td>USD冻结金额</td>
                <td>USD委托交易冻结金额</td>
                <td>USD红包冻结金额</td>
              </tr>
              <tr>
                <td>{{userAccount && userAccount.usdBalance || 0}}</td>
                <td>{{userAccount && userAccount.usdBalanceFreeze || 0}}</td>
                <td>{{userInfo.usdBalanceEntrustFreeze || 0}}</td>
                <td>{{userAccount && userAccount.usdBalancePackageFreeze || 0}}</td>
              </tr>
            </table>
          </div>
          <div class="pane-box">
            <h5>PI资产</h5>
            <table style="width: 90%" class="web-table-grid">
              <tr class="thead" style="background: #7d7d7d">
                <td>PI余额</td>
                <td>PI冻结金额</td>
                <td>PI委托交易冻结金额</td>
                <td>PI红包冻结金额</td>
              </tr>
              <tr>
                <td>{{(userAccount && userAccount.piBalance) || 0}}</td>
                <td>{{(userAccount && userAccount.piBalanceFreeze) || 0}}</td>
                <td>{{userInfo.piBalanceEntrustFreeze || 0}}</td>
                <td>{{userInfo.piBalancePackageFreeze || 0}}</td>
              </tr>
            </table>
          </div>
          <div class="pane-box">
            <h5>基金、派付钱包和自助餐券</h5>
            <table style="width: 90%" class="web-table-grid">
              <tr class="thead" style="background: #7d7d7d">
                <td width="25%">基金股数</td>
                <td width="25%">基金冻结股数</td>
                <td width="25%">派付钱包余额</td>
                <td width="25%">餐券数</td>
              </tr>
              <tr>
                <td>{{(userAccount && userAccount.fundBalance) || 0}}</td>
                <td>{{(userAccount && userAccount.fundBalanceEntrustFreeze) || 0}}</td>
                <td>{{(userAccount && userAccount.paiPurseBalance) || 0}}</td>
                <td>{{(userAccount && userAccount.voucherBalance) || 0}}</td>
              </tr>
            </table>
            <table style="width: calc(45% + 1px)" class="web-table-grid">
              <tr class="thead" style="background: #7d7d7d">
                <td width="25%">餐券委托冻结数</td>
                <td width="25%">餐券委托冻结PI</td>
              </tr>
              <tr>
                <td>{{(userAccount && userAccount.voucherBalanceEntrustFreeze) || 0}}</td>
                <td>{{(userAccount && userAccount.voucherPiBalanceEntrustFreeze) || 0}}</td>
              </tr>
            </table>
          </div>
          <div class="pane-box">
            <h5>其他货币资产</h5>
            <table style="width: 90%" class="web-table-grid">
              <tr class="thead" style="background: #7d7d7d">
                <td>币种</td>
                <td>余额</td>
                <td>冻结金额（其他）</td>
                <td>委托交易冻结金额</td>
              </tr>
              <tr v-for="(item, index) in coinList" :key="index">
                <td>{{item.currency || 0}}</td>
                <td>{{item.balance || 0}}</td>
                <td>{{item.balanceFreeze || 0}}</td>
                <td>{{item.balanceEntrustFreeze || 0}}</td>
              </tr>
            </table>
          </div>
        </el-tab-pane>
        <!-- 冻结记录 -->
        <el-tab-pane label="冻结记录" name="third">
          <h5>{{userInfo.username}}冻结记录</h5>
          <list-wrap :list="list" :total="total" @change="getData">
            <div class="web-table-grid">
              <table>
                <tr class="thead">
                  <td width="6%">记录ID</td>
                  <td>操作人</td>
                  <td>操作来源</td>
                  <td width="15%">操作类型</td>
                  <td>原因</td>
                  <td>操作时间</td>
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.operateName}}</td>
                  <td>{{item.operateSource == 1 ? '管理平台' : '客户端'}}</td>
                  <td>{{item.operateType == 1 ? '冻结' : '解冻'}}</td>
                  <td>{{item.reason}}</td>
                  <td>{{item.createAt | time}}</td>
                </tr>
              </table>
            </div>
          </list-wrap>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "userDetail",
  data() {
    return {
      userInfo: {},
      userAccount: {},
      coinList: [],
      activeName: 'first',
      mobile: '',
      email: '',
      refNames: '', // 上级链用户名串
      userRefs: '', // 上级链地址串
      list: [],
      total: -1,
      pageIndex: 1,
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    handleCommand(command) {
      // type不同触发不同的下拉 0.账户状态； 1.支付密码； 2.手机验证码； 3.谷歌验证码
      switch (parseInt(command.type)) {
        case 0:
          this.userInfo.status = command.val
          break;
        case 1:
          this.userInfo.openTradePassword = command.val
          break;
        case 2:
          this.userInfo.openMobileCode = command.val
          break;
        case 3:
          this.userInfo.openGoogleCode = command.val
          break;
      }
    },
    handleClick(options) {
      // 点击切换Tabs时触发对应tab的事件
      if (options.name === 'second') {
        this.getUserAccount()
      } else if (options.name === 'third') {
        this.getData()
      }
    },
    modify() {
      this.$fetch.post('/user/user/updateUserInfo', {
        id: this.userInfo.id,
        mobile: this.mobile,
        email: this.email,
        status: this.userInfo.status,
        openTradePassword: this.userInfo.openTradePassword,
        openMobileCode : this.userInfo.openMobileCode,
        openGoogleCode  : this.userInfo.openGoogleCode,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功！')
        }
      })
    },

    // 获取用户账户信息
    getDetail() {
      this.$fetch.post('/user/user/queryUserDetail', {
        userAddress: this.$route.query.userAddress
      }).then((res) => {
        this.userInfo = res.data.user
        this.email = res.data.user.email
        this.mobile = res.data.user.mobile
      })
    },

    // 获取用户的资产信息
    getUserAccount() {
      this.$fetch.post('/user/user/queryUserAccount', {
        userAddress: this.$route.query.userAddress
      }).then((res) => {
        this.userAccount = res.data.userAccount
        this.coinList = res.data.coinUserAccountList
        this.refNames = res.data.refNames
        this.userRefs = res.data.userRefs
      })
    },

    // 获取冻结记录
    getData(pageIndex) {
      this.$fetch.post('/user/user/queryUserUnlockReasonList', {
        userAddress: this.$route.query.userAddress,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10,
      }).then((res) => {
        this.list = res.data.page.list
        this.total = res.data.page.totalCount
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .pane-box
    margin-bottom 40px
</style>
<style scoped>
  >>>.empty {
    top: 0;
  }
  .table-box {
    min-height: 60px;
    display: flex;
    line-height: 60px;
    text-align: center;
  }

  .key {
    width: 30%;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .value {
    padding: 5px;
    width: 70%;
    line-height: 1.4;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .el-dropdown {
    width: 180px;
    display: inline-block;
    line-height: 30px;
    height: 30px;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  input {
    height: 30px;
    border: 1px solid #474747;
    border-radius: 4px;
    line-height: 30px;
    text-align: center;
  }

  .big-input {
    width: 180px;
  }

  .small-input {
    width: 150px;
  }
  h5 {
    font-weight: bold;
    font-size: 18px;
    margin: 20px 0 20px 30px;
  }
</style>
