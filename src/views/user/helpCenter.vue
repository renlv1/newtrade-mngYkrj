<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>帮助中心</span>
      <router-link to="/user/helpCenter/helpDetail" class="pay-money">新增帮助 </router-link>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="valueID" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">标题：</div>
          <div class="input-wrap"><input v-model.trim="titleValue" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">内容：</div>
          <div class="input-wrap"><input v-model.trim="contentValue" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ statueText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label"></div>
          <div class="input-wrap"></div>
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
              <td>标题</td>
              <td width="15%">内容</td>
              <td>状态</td>
              <td>创建时间</td>
              <td>备注</td>
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in isListNull(list)" :key="index" class="tbody-tr">
              <td>{{item.id}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.title}}</td>
              <td class="td-content">
                  <el-button type="text" @click="showTextDialog(item.content)" v-html="item.content || '-'"></el-button>
              </td>
              <td>{{item.status === 1 ? '有效' : '无效'}}</td>
              <td>{{$changeDate(item.createTime,'-',8)}}</td>
              <td>{{item.remark || '-'}}</td>
              <td class="blue-td">
                <router-link tag="a" class="check" :to="{path: '/user/helpCenter/helpDetail',query: {title: item.title,content: item.content,id: item.id,status: item.status}}">查看</router-link> <span @click="btnChange(item)">标为{{item.status === 1 ? '无效' : '有效'}}</span>
              </td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
    </div>
    <el-dialog width="50%" class="targetDialog" :visible.sync="showTargetDialog" title="内容" height="auto">
      <div style="">
        <div style="position: relative; height: auto; display: flex; justify-content: center; align-items: center;overflow-y: auto" >
<!--          <div @click="showTargetDialog = false" class="close" style="position: absolute; color: #fff; right: -20px; top: -20px; z-index: 99999999; font-size: 18px; cursor: pointer">X</div>-->
          <div class="text-cont" v-html="textCont" ></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  export default {
    components: {ElButton},
    data() {
      return {
        showTargetDialog: false,
        valueID: '',
        titleValue: '',//标题
        contentValue: '',//   内容
        userName: '',// 用户名
        statueText: '',
        statusArr: [],//状态
        status: '',
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        clientType: '',// 状态
        pageSize: 10,
        textCont: '',
      }
    },
    created() {
      this.getType()
    },
    methods: {
      showTextDialog(item){
        if (item) {
          this.$alert(`${item}`, '回复内容', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
          });
        }
      },
      zoomSource(content){
        if (content) {
          Dialog ({
            title: '内容',
            content: content,
            type: 'confirm'
          })
        }
      },
      btnChange(item) {
        let content = ''
        if(item.status === 1) {
          content = '确定标为无效'
        } else if (item.status === 2) {
          content = '确定标为有效'
        }
        Dialog({
          title: '',
          content: content,
          okFn: () => {
            this.$fetch.post('/user/help/updateHelpCenter',{
              id: item.id,
              status: item.status === 1 ? 2: 1
            }).then(res => {
              if(res.msg === '修改成功') {
                Dialog({
                  title: '',
                  content: res.msg,
                  okFn: () => {
                    this.getData()
                  }
                })
              }
            })
          }
        })
      },
      handleCommand(command) {
        this.statueText = command.text
        this.clientType = command.id
      },
      getType() {
        this.$fetch.get(`public/enumValue?classPackage=user.HelpCenter$StatusEnum&flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.statusArr = res.data.data.StatusEnum
          }
        })
      },
      resetFields() {
        this.titleValue = ''
        this.contentValue= ''
        this.statueText = ''
        this.userName = ''
        this.valueID = ''
        this.clientType = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/help/queryHelpCenter', {
          id: this.valueID, // id
          userName: this.userName, // 用户名
          title: this.titleValue, //标题
          content: this.contentValue, //   内容
          status: this.clientType === 'selected' ? this.clientType = '' : this.clientType,// 状态
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize,
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .td-content
    cursor: pointer;
    .more-text
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      >>> p
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    >>> .el-button
            border 0 !important
            background-color none !important
    &:hover{
      text-decoration: underline;
      color: #2176ff;
      .more-text{
        color: #2176ff!important;
        >>> p{
          color: #2176ff!important;
          >>> span{
            color: none!important;
          }
        }
      }
    }
  .crumb
    display flex
    justify-content space-between
  .blue
    color #2176ff
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
