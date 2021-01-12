<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/redisKey" class="title-m">redis键值 </router-link>
        <span> / 详情</span>
      </div>
      <div class="btn-right" @click="saveBtn()">
        <div class="btn-save">保存</div>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w ">
        <li class="li-item search">
          <div class="search-box">
            <div class="label">key</div>
            <div class="input-wrap"><input v-model="data.key" type="text" disabled></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">值</div>
            <div class="input-wrap"><textarea v-model="data.value" type="text" :disabled = "valueDisabled"></textarea></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">超时时间</div>
            <div class="input-wrap"><input v-model="data.time" type="text" :disabled = "timeDisabled"></div>
          </div>
        </li>
        <li class="li-item search">
          <div class="search-box">
            <div class="label">修改类型：</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="handleCommand2">
              <span class="el-dropdown-link">
                {{ modifyText|| '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item, index) in typeArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    name: "transferLogDetail",
    data() {
      return{
        timeDisabled: false,
        valueDisabled: false,
        typeArr: [
          {value: 1,text: 'value'},
          {value: 2,text: '时间'},
          {value: 3,text: '全部'}
        ],
        modifyText: '',
        key: this.$route.query.key,
        data: '',
        value:3,
        time: ''
      }
    },
    created() {
      this.getData()
    },
    methods: {
      handleCommand2(command) {
        this.modifyText = command.text
        this.value = command.value
        if(this.value === 1) {
          this.timeDisabled = true
          this.valueDisabled = false
        }  else if(this.value === 2) {
          this.valueDisabled = true
          this.timeDisabled = false
        } else if (this.value === 3) {
          this.valueDisabled = false
          this.timeDisabled = false
        }
      },
      saveBtn(){
        this.$fetch.post('/user/user/updateRedisValue',{
          key: this.data.key, //key键
          value: this.data.value,// value值
          time: this.data.time, // 过期时间
          type: this.value // 修改类型 1value 2时间 3全部
        }).then(res => {
          if(res.code === 0) {
            Dialog({
              title: '',
              content: res.msg,
              okFn: () => {
                this.getData()
              }
            })
          }
        })
      },
      getData() {
        this.$fetch.post(`/user/user/queryRedisValue?key=${this.key}`).then(res => {
          if(res.code === 0) {
            this.data = res.data.resultData
            this.detail = res.data.resultData.value
            this.time = this.$changeDate(this.data.time, '-')
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .zoom-enter-to{
    transition: none;
  }
  .el-dropdown-menu{
    width 260px
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
      width: 280px;
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
      .input-wrap
        width 280px
        input
          width 100%
        textarea
          width 260px
          height 100px
          padding 10px
          border 1px solid #DCDFE6
          background #fff
      .label
        width 100px
      .dropdown-wrap
        width 280px!important
        cursor pointer
        text-align center
        line-height 40px
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
  >>>.dropdown-wrap{
    min-width: 160px !important;
  }
  /*>>> .el-dialog .el-dialog__headerbtn .el-icon-close:before {*/
  /*  border: 2px solid #ccc;*/
  /*  border-radius: 100%;*/
  /*}*/
  
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
</style>>
