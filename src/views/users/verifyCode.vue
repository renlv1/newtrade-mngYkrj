<template>
    <div class="c-page mar-right transaction-list">
        <div class="page-wrap">
            <div class="search">
                <div class="search-box">
                    <div class="label">ID：</div>
                    <div class="input-wrap"><input v-model="id" type="number"></div>
                </div>
                <div class="search-box">
                    <div class="label">发送账号：</div>
                    <div class="input-wrap"><input v-model.trim="sendAcount" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">接收账号：</div>
                    <div class="input-wrap"><input v-model.trim="receiveAcount" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">发送类型：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{sendTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                <vue-scroll :ops="ops" style="height: 300px">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in sendTypeEnum" :key="index">{{item.text}}
                                    </el-dropdown-item>
                                </vue-scroll>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">短信发送平台：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{sendPlatformText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                <vue-scroll :ops="ops" style="height: 300px">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in sendPlatformEnum" :key="index">{{item.text}}
                                    </el-dropdown-item>
                                </vue-scroll>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <!--<div class="search-box">
                    <div class="label">时间：</div>
                    <el-date-picker
                            placeholder="开始时间"
                            v-model="startTime"
                            type="datetime"
                            default-time="00:00:00"
                            :picker-options="pickerBeginDateBefore"
                            format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>

                    <span style="margin-right: 10px">到</span>

                    <el-date-picker
                            placeholder="结束时间"
                            v-model="endTime"
                            type="datetime"
                            default-time="23:59:59"
                            :picker-options="pickerBeginDateAfter"
                            format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </div>-->
                <div class="f1"></div>
                <div class="btns">
                    <div @click="resetFields()" class="btn black">清空</div>
                    <div class="btn" @click="search">查询</div>
                </div>
            </div>
            <list-wrap :list="list" :total="total" @change="getData">
                <div class="web-table">
                    <div class="center">
                        <div class="common-thead">
                            <div class="thead">ID</div>
                            <div class="thead">发送账号</div>
                            <div class="thead">接收账号</div>
                            <div class="thead">发送类型</div>
                            <div class="thead ">短信发送平台</div>
                            <div class="thead ">请求的IP地址</div>
                            <div class="thead ">创建时间</div>
                            <div class="thead">修改时间</div>
                            <div class="thead">操作</div>
                        </div>
                        <div v-for="(item, index) in isListNull(list)" :key="index" class="tbody-wrap">
                            <div class=" common-tbody">
                                <div class="tbody">{{item.id}}</div>
                                <div class="tbody">{{item.sendAcount}}</div>
                                <div class="tbody">{{item.receiveAcount}}</div>
                                <div class="tbody">{{statusFn(item.sendType )}}</div>
                                <div class="tbody">{{sendTypeIdFn(item.sendPlatform)}}</div>
                                <div class="tbody">{{item.ip}}</div>
                                <div class="tbody">{{item.createAt}}</div>
                                <div class="tbody">{{item.updateAt}}</div>
                                <div @click="upload(item)" class="blue-td cursor tbody" v-show="item.packFlag === false"> <span>展开</span><img src="../../../src/assets/img/kai.png"></div>
                                <div @click="shouqi(item)" class="blue-td cursor tbody" v-show="item.packFlag === true"> <span>收起</span><img src="../../../src/assets/img/shou.png"></div>
                            </div>
                            <div class="add-more" v-show="item.packFlag === true">
                                <div class="add-up">
                                    <span>验证码: {{item.verifyCode || '0'}}</span>
                                    <span>备注: {{item.remarks || '0'}}</span>
                                </div>
                            </div>
                        </div>
                        <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                            <img src="~@img/loading.gif" />
                        </div>
                    </div>
                </div>
            </list-wrap>
        </div>
    </div>
</template>

<script>
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        ops: {
          vuescroll: {},
          scrollPanel: {
            easing: 'easeInQuad',
            scrollingX: false,//是否启用 x 或者 y 方向上的滚动
          },
          rail: {
            background: '#01a99a',
            opacity: 0,
            size: '10px',
            specifyBorderRadius: false,
            gutterOfEnds: null,    //轨道距 x 和 y 轴两端的距离
            gutterOfSide: '0',   //距离容器的距离
            keepShow: false,   //是否即使 bar 不存在的情况下也保持显示
            border:'none'    //边框
          },
          bar: {
            hoverStyle: true,
            onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
            background: '#eee',   //颜色
          }
        },
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.startTime
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
        id: '',
        sendAcount: '',
        receiveAcount: '',
        sendTypeText: '',
        sendTypeId: '',
        sendPlatformText: '',
        sendPlatformId: '',
        startTime: '',
        endTime: '',
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        showDialog: false,
        sendTypeEnum: [],
        sendPlatformEnum: [],
      }
    },
    created() {
      this.getTypeFn()
    },
    methods: {
      getTypeFn() {
        this.$fetch.get(`/public/enumValue?classPackage=user.VerifyCode$SendPlatformEnum;user.VerifyCode$SendTypeEnum&flag=true&state=1`).then(res => {
          if (res) {
            this.sendPlatformEnum = res.data.data.SendPlatformEnum
            this.sendTypeEnum = res.data.data.SendTypeEnum
          }
        })
      },
      sendTypeIdFn (item) {
        if (item !== null && this.sendPlatformEnum.length >0 && item > 0) {
          for (let i in this.sendPlatformEnum){
            if(parseInt(item) === parseInt(this.sendPlatformEnum[i].id)){
              return this.sendPlatformEnum[i].text
            }
          }
        }
      },
      statusFn (item) {
        if (item !== null && this.sendTypeEnum.length >0 && item > 0) {
          for (let i in this.sendTypeEnum){
            if(parseInt(item) === parseInt(this.sendTypeEnum[i].id)){
              return this.sendTypeEnum[i].text
            }
          }
        }
      },
      handleCommand(commend) {
        let command = commend.item
        let id = commend.index
        if (id === 1) {
          this.sendTypeText = command.text
          this.sendTypeId = command.id
        } else if (id === 2) {
          this.sendPlatformText = command.text
          this.sendPlatformId = command.id
        }
      },
      upload(item) {
        item.packFlag = !item.packFlag
      },
      shouqi(item) {
        item.packFlag = !item.packFlag
      },
      resetFields() {
        this.sendPlatformId = ''
        this.sendPlatformText = ''
        this.sendTypeId = ''
        this.sendTypeText = ''
        this.sendAcount = ''
        this.receiveAcount = ''
        this.id = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/verify/queryVerifyList', {
          id: this.id,
          sendAcount : this.sendAcount ,
          receiveAcount : this.receiveAcount ,
          sendType : this.sendTypeId > 0 ? this.sendTypeId : '' ,
          sendPlatform : this.sendPlatformId > 0 ? this.sendPlatformId : '' ,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if( res.data) {
            this.loadShow = false
            let list = res.data.page.list
            list.forEach(item => {
              item.packFlag = false
            })
            this.list = list
            this.total = res.data.page.totalCount
          } else {
            this.list = []
            this.total = 0
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
           padding 0 20px!important
           .search{
               padding-bottom 0
               .search-box{
                   width 100%
                   margin-top 0
                   margin-bottom 20px
                   .el-input{
                       display flex
                       align-items center
                       .el-input__inner{
                           margin-right 0!important
                           width 100%!important
                       }
                       .el-input__icon{
                           line-height 35px!important
                       }
                   }
                   .curreny-wrap{
                       cursor pointer
                       text-align center
                       line-height 40px
                       background-color #fff
                       border: 1px solid #DCDFE6;
                       border-radius: 6px;
                       padding: 0 10px;
                       font-size 15px
                       height: 40px;
                   }
                   .input-wrap{
                       width 80%
                       &.input-main{
                           width 70%
                       }
                       input{
                           margin-right 0!important
                           width 100%
                       }
                   }
               }
           }
       }
    .dialog-input{
        width 250px
    }
    .el-dropdown-menu{
        max-height 320px!important
        overflow auto !important
        /*max-width 200px!important*/
    }
    .payment{
        max-width 210px!important
    }
    .crumb
        display flex
        justify-content space-between
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

    >>> .el-dialog {
        margin: 0 auto;
        width: 80%;
        box-shadow: none;
    }

    >>> .el-dialog .el-dialog__headerbtn {
        top: 20px;
        right: 15px;
    }

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
