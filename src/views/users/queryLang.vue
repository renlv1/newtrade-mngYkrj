<template>
    <div class="c-page mar-right transaction-list">
        <div class="page-wrap wrap">
            <div class="search">
                <div class="search-box">
                    <div class="label">ID：</div>
                    <div class="input-wrap"><input v-model="id" type="number"></div>
                </div>
                <div class="search-box">
                    <div class="label">用户系统识别码：</div>
                    <div class="input-wrap"><input v-model.trim="userSystemCode" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">状态：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="commandChange">
                          <span class="el-dropdown-link">
                            {{statusText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu payment" slot="dropdown" >
                                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in statusEnum" :key="index">{{item.text}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
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
                            <td>用户系统识别码</td>
                            <td>常用语言设置</td>
                            <td>状态</td>
                            <td>创建时间</td>
                            <td>更新时间</td>
                        </tr>
                        <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
                            <td>{{item.id}}</td>
                            <td>{{item.userSystemCode}}</td>
                            <td>{{item.content}}</td>
                            <td>{{statusFn(item.status)}}</td>
                            <td>{{item.createAt}}</td>
                            <td>{{item.updateAt}}</td>
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
        userSystemCode: '',
        clientstatusEnum: [],
        statusEnum: [],
        statusText: '',
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
        let url ='/public/enumValue?classPackage=user.CommonLanguage$StatusEnum;&flag=true&state=1'
        this.$fetch.get(`${url}`).then(res => {
          if (res.code === 0) {
            this.statusEnum = res.data.data.StatusEnum
          }
        })
      },
      resetFields() {
        this.statusText = ''
        this.statusId = ''
        this.id = ''
        this.startTime = ''
        this.endTime = ''
        this.userSystemCode = ''
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
       if (id === 2) {
          this.statusText = command.text
          this.statusId = command.id
        }
      },
      statusFn(index) {
        if (index !== null && index > 0 && this.statusEnum) {
            for (let i in this.statusEnum) {
              if (index === parseInt(this.statusEnum[i].id)) {
                return this.statusEnum[i].text
              }
            }
        }
      },
      clientFn (item) {
        if (item !== null && item > 0 && this.clientstatusEnum.length > 0) {
          for (let i in this.clientstatusEnum) {
            if (item === parseInt(this.clientstatusEnum[i].id)) {
              return this.clientstatusEnum[i].text
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
        this.$fetch.post('/user/userAccount/queryCommonLanguageList', {
          id: this.id,
          userSystemCode: this.userSystemCode,
          status: this.statusId > 0 ? this.statusId : '',
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
