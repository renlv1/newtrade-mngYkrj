<template>
    <div class="c-page mar-right transaction-list">
        <div class="page-wrap wrap">
            <div class="search">
                <div class="search-box">
                    <div class="label">ID：</div>
                    <div class="input-wrap"><input v-model="id" type="number"></div>
                </div>
                <div class="search-box">
                    <div class="label">用户名：</div>
                    <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">客户端类型：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="commandChange">
                              <span class="el-dropdown-link">
                                {{ clientText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in clientTypeEnum" :key="index">{{item.text}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">操作类型：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="commandChange">
                          <span class="el-dropdown-link">
                            {{ typeText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu payment" slot="dropdown" >
                                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in typeEnum" :key="index">{{item.text}}
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
            <list-wrap :list="isListNull(list)" :total="total" @change="getData">
                <div class="web-table">
                    <table class="center">
                        <tr class="thead">
                            <td>ID</td>
                            <td>用户名</td>
                            <td>用户系统识别码</td>
                            <td>设备Token</td>
                            <td>客户端类型</td>
                            <td>操作类型</td>
                            <td>登录ip</td>
                            <td>设备Id</td>
                            <td>客户端版本号</td>
                            <td>创建时间</td>
                            <td>备注</td>
                        </tr>
                        <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
                            <td>{{item.id}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.userSystemCode}}</td>
                            <td>{{item.deviceToken}}</td>
                            <td>{{clientFn(item.clientType)}}</td>
                            <td>{{typeFn(item.backup1)}}</td>
                            <td>{{item.ip}}</td>
                            <td>{{item.deviceId}}</td>
                            <td>{{item.clientVersion}}</td>
                            <td>{{item.createAt}}</td>
                            <td>{{item.remarks}}</td>
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
        userName: '',//用户
        clientText: '',
        clientId: '',
        clientTypeEnum: [],
        typeEnum: [],
        typeText: '',
        startTime: '',
        endTime: '',
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        let url ='/public/enumValue?classPackage=user.LoginLog$ClientTypeEnum;user.LoginLog$TypeEnum&flag=true&state=1'
        this.$fetch.get(`${url}`).then(res => {
          if (res.code === 0) {
            this.clientTypeEnum = res.data.data.ClientTypeEnum  // 客户端类型
            this.typeEnum = res.data.data.TypeEnum // 操作类型
          }
        })
      },
      resetFields() {
        this.clientText = ''
        this.clientId = ''
        this.userName = ''
        this.typeText = ''
        this.typeId = ''
        this.id = ''
        this.startTime = ''
        this.endTime = ''
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
        if(id === 1) {
          this.clientText = command.text
          this.clientId = command.id
        } else if (id === 2) {
          this.typeText = command.text
          this.typeId = command.id
        }
      },
      typeFn(index) {
        if (index !== null && index > 0 && this.typeEnum.length > 0) {}
        for (let i in this.typeEnum) {
          if (index === parseInt(this.typeEnum[i].id)) {
            return this.typeEnum[i].text
          }
        }
      },
      clientFn (item) {
        if (item !== null && item > 0 && this.clientTypeEnum.length > 0) {
          for (let i in this.clientTypeEnum) {
            if (item === parseInt(this.clientTypeEnum[i].id)) {
              return this.clientTypeEnum[i].text
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
        this.$fetch.post('/user/loginLog/queryLoginLogList', {
          id: this.id,
          userName: this.userName,
          clientType : this.clientId > 0 ? this.clientId : '',
          backup1: this.typeId > 0 ? this.typeId : '',
          startAtStr: this.$changeDate(this.startTime, '-', 8), //开始-更新时间
          endAtStr:  this.$changeDate(this.endTime, '-', 8), //最后登录时间
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
            .btn
                cursor pointer
</style>
