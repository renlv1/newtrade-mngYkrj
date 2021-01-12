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
                    <div class="label">用户地址：</div>
                    <div class="input-wrap"><input v-model.trim="userSystemCode" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">币种：</div>
                    <div class="input-wrap"><input v-model.trim="currency" type="text"></div>
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
                            <td>用户地址</td>
                            <td>余额</td>
                            <td>冻结余额</td>
                            <td>币种</td>
                            <td>创建时间</td>
                            <td>更新时间</td>
                            <td>备注</td>
                        </tr>
                        <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
                            <td>{{item.id}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.userSystemCode}}</td>
                            <td>{{item.balance}}</td>
                            <td>{{item.balanceFreeze}}</td>
                            <td>{{item.currency}}</td>
                            <td>{{item.createtime}}</td>
                            <td>{{item.updatetime}}</td>
                            <td>{{item.remark}}</td>
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
        userSystemCode: '',//用户
        currency: '',
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
      //this.getType()
    },
    methods: {
      /*getType() {
        let url ='/public/enumValue?classPackage=user.LoginLog$ClientTypeEnum;user.LoginLog$TypeEnum&flag=true&state=1'
        this.$fetch.get(`${url}`).then(res => {
          if (res.code === 0) {
            this.clientTypeEnum = res.data.data.ClientTypeEnum  // 客户端类型
            this.typeEnum = res.data.data.TypeEnum // 操作类型
          }
        })
      },*/
      resetFields() {
        this.clientText = ''
        this.clientId = ''
        this.userName = ''
        this.typeText = ''
        this.typeId = ''
        this.id = ''
        this.startTime = ''
        this.endTime = ''
        this.userSystemCode = ''
        this.currency = ''
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
        this.$fetch.post('/user/userAccount/queryUserAccountList', {
          id: this.id,
          userName: this.userName,
          userSystemCode : this.userSystemCode ,
          currency : this.currency,
          startAtStr: this.$changeDate(this.startTime, '-', 8), //开始-更新时间
          endAtStr :  this.$changeDate(this.endTime, '-', 8), //最后登录时间
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
