<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb">
      <span>问题回复</span>
    </div>
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">ID：</div>
          <div class="input-wrap"><input v-model="id" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">问题id：</div>
          <div class="input-wrap"><input v-model="problemId" type="number"></div>
        </div>
        <div class="search-box">
          <div class="label">用户名：</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">用户地址：</div>
          <div class="input-wrap"><input v-model.trim="userAddress" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">回复用户名：</div>
          <div class="input-wrap"><input v-model.trim="fromUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">回复身份：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ equipment || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in statusArr" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">是否已读：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
              <span class="el-dropdown-link">
                {{ isText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in isArr" :key="index">{{item.text}}
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
          <div class="center">
            <div class="common-thead">
              <div class="thead">ID</div>
              <div class="thead">问题id</div>
              <div class="thead">用户名</div>
              <div class="thead tbody-address">用户地址</div>
              <div class="thead tboby-cont">回复内容</div>
              <div class="thead">回复用户名</div>
              <div class="thead">回复身份</div>
              <div class="thead">是否已读</div>
              <div class="thead">创建时间</div>
              <div class="thead">更新时间</div>
            </div>
            <div v-for="(item, index) in list" :key="index" class="tbody-wrap">
              <div class=" common-tbody">
                <div class="tbody">{{item.id}}</div>
                <div class="tbody">{{item.problemId}}</div>
                <div class="tbody">{{item.userName}}</div>
                <div class="tbody tbody-address">{{item.userAddress}}</div>
                <div class="tbody tboby-cont">
                    <div class="reply-cont" >
                        <el-button type="text" @click="showDialog(item.content)" v-html="item.content || '-'"></el-button>
                    </div>
                </div>
                <div class="tbody">{{item.fromUserName}}</div>
                <div class="tbody">{{$isAuthor(item.isAuthor)}}</div>
                <div class="tbody">{{$isRead(item.isRead)}}</div>
                <div class="tbody" v-html="timeStrDate(item.createTime)"></div>
<!--                <div  @click="upload(item)" class="blue-td cursor tbody" v-show="item.packFlag === false"> <span>展开</span><img src="../../../src/assets/img/kai.png"></div>-->
<!--                <div  @click="shouqi(item)" class="blue-td cursor tbody" v-show="item.packFlag === true"> <span>收起</span><img src="../../../src/assets/img/shou.png"></div>-->
                <div  class=" cursor tbody" v-html="timeStrDate(item.updateTime)"></div>
              </div>
<!--              v-show="item.packFlag === true"-->
<!--              <div class="add-time" v-show="item.packFlag === true"> 更新时间 ：{{item.updateTime| time}}</div>-->
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
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        id: '',
        problemId: '',//问题id
        userName: '',//用户名
        userAddress: '',//用户地址
        fromUserName: '',//回复用户名
        isArr:[],
        isText: '',
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        statusArr: [],
        equipment: '',
        isAuthor: '',// 回复身份
        isRead: '',// 是否已读
        pageSize: 10,
      }
    },
    created() {
      this.getType()
      // this.getData()
    },
    methods: {
      showDialog(item) {
        if (item) {
          this.$alert(`${item}`, '回复内容', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
          })
        }
      },
      upload(item) {
        item.packFlag = !item.packFlag
      },
      shouqi(item) {
        item.packFlag = !item.packFlag
      },
      getType() {
        this.$fetch.get(`public/enumValue?classPackage=user.ProblemFeedback$ProblemFeedbackAuthorEnum;user.ProblemFeedback$ProblemFeedbackReadEnum&flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.statusArr = res.data.data.ProblemFeedbackAuthorEnum
            this.isArr = res.data.data.ProblemFeedbackReadEnum
          }
        })
      },
      resetFields() {
        this.userAddress = ''
        this.fromUserName = ''
        this.problemId = ''
        this.id = ''
        this.userName = ''
        this.isAuthor = ''
        this.isText = ''
        this.equipment = ''
        this.isRead = ''
      },
      commandChange (commend) {
        let command = commend.item
        let id = commend.index
        if (id === 1) {
          this.equipment = command.text
          this.isAuthor = command.id
        } else if (id === 2) {
          this.isText = command.text
          this.isRead = command.id
        }
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/problemFeedBack/queryProblemFeedBack', {
          id: this.id,
          problemId: this.problemId, // 问题id
          userAddress: this.userAddress, // 用户地址
          fromUserName: this.fromUserName,//回复用户名
          isAuthor: this.isAuthor === 'selected' ? this.isAuthor = '' : this.isAuthor,// 回复身份
          isRead: this.isRead === 'selected' ? this.isRead = '' : this.isRead, // 是否已读
          userName: this.userName, //用户名
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if(res.data) {
            let list = res.data.page.list
            list.forEach(item => {
              item.packFlag = false
            })
            this.list = list
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
  .time
    text-align left
  .tbody-tr
    display: flex
    align-items center
    div
      flex 1
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
