<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>客户端信息</span>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">登录位置：</div>
          <div class="input-wrap"><input v-model.trim="accountAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">设备类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{equipment || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">首次登录此设备：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{isText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in isArr" :key="index">{{item.text}}
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
            :picker-options="pickerOptionsStart"
            format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          >
          </el-date-picker>
  
          <span style="margin-right: 10px">到</span>
  
          <el-date-picker
            placeholder="结束时间"
            v-model="endTime"
            type="datetime"
            :picker-options="pickerOptionsEnd"
            format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
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
              <td width="18%">加密设备号</td>
              <td>设备类型</td>
              <td>最后登录时间</td>
              <td>登录位置</td>
              <td>设备号</td>
              <td>是否第一次登录此设备</td>
              <td>设备版本号</td>
            </tr>
            <tr v-for="(item, index) in isListNull(list)" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.address}}</td>
              <td>{{item.deviceToken}}</td>
              <td>{{$clientType(item.clientType)}}</td>
              <td v-html="timeStrDate(item.lastLoginTime)"></td>
              <td>{{item.ip}}</td>
              <td>{{item.deviceId}}</td>
              <td>{{$deviceFlag(item.deviceFlag)}}</td>
              <td>{{item.clientVersion}}</td>
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
export default {
  data() {
    return {
      userName: '',//登录账户名
      accountAddress: '',//登录位置IP
      startTime: '',
      endTime: '',
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
      isArr:[
        {text: '全部',id: ''},
        {text: '是',id: 1},
        {text: '否',id: 2},
      ], //首次登录此设备
      isText: '',
      status: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,
      statusArr: [],//设备类型
      deviceFlag: '', //是否第一次登陆此设备
      clientType: '',//  设备类型
      equipment: '',
      pageSize: 10,
      startDate: ''
    }
  },
  created() {
    this.getType()
  },
  methods: {
    timeFn(time) {
      return time.split(' ')[0]
    },
    getType() {
      this.$fetch.get(`/public/enumValue?classPackage=user.Device$ClientTypeEnum;user.Device$DeviceFlagEnum &flag=true&state=1`).then(res => {
        if (res.code === 0) {
          this.statusArr = res.data.data.ClientTypeEnum
        }
      })
    },
    resetFields() {
      this.userName = ''
      this.accountAddress = ''
      this.clientType = ''
      this.startTime = ''
      this.endTime = ''
      this.isText = ''
      this.equipment = ''
    },
    commandChange (commend) {
      let command = commend.item
      let id = commend.index
      if (id === 1) {
        this.equipment = command.text
        this.clientType = command.id
      } else if (id === 2) {
        this.isText = command.text
        this.deviceFlag = command.id
      }
    },
    getData(pageIndex ,pageSize) {
      if(pageSize) {
        this.pageSize = pageSize
      }
      this.loadShow = true
      this.$fetch.post('/user/device/queryDeviceList', {
        userName: this.userName, //登录账户名
        ip: this.accountAddress, //登录位置IP
        clientType: this.clientType === 'selected' ? this.clientType = '' : this.clientType, //  设备类型
        startAtStr : this.$changeDate(this.startTime, '-', 8), //创建日期
        deviceFlag: this.deviceFlag, //是否第一次登陆此设备
        endAtStr: this.$changeDate(this.endTime, '-', 8), //最后登录时间
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

  >>> .el-dialog .el-dialog__headerbtn .el-icon-close:before {
    border: 2px solid #ccc;
    border-radius: 100%;
  }

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
