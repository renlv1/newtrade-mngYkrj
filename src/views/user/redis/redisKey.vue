<template>
  <div class="c-page mar-right">
    <!--<div class="crumb">
      <span>redis键值</span>
      &lt;!&ndash;<router-link to="">用户交易管理 ></router-link>
      <router-link to="">用户管理</router-link>&ndash;&gt;
    </div>-->
    <div class="page-wrap">
      <div class="search">
        <div class="search-box">
          <div class="label">key：</div>
          <div class="input-wrap"><input v-model.trim="valueID" type="text"></div>
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
              <td>key</td>
<!--              <td>值</td>-->
<!--              <td>超时时间</td>-->
<!--              <td width="15%">修改类型</td>-->
              <td>操作</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index" class="tbody-tr">
              <td>{{item.key}}</td>
<!--              <td>{{item.value || '-'}}</td>-->
<!--              <td>{{$changeDate(item.time) || '-'}}</td>-->
<!--              <td >{{$modifyType(item.type)}}</td>-->
              <td class="blue-td">
                <router-link tag="a" class="checkDetail" :to="{path: '/user/redisKey/redisDetail',query: {key: item.key}}">查看</router-link><span class="grey">| </span> <span @click="btnDelete(item)">  删除</span>
              </td>
            </tr>
            <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
              <img src="~@img/loading.gif" />
            </div>
          </table>
        </div>
      </list-wrap>
      <el-dialog width="30%" :visible.sync="showDialog">
        <div class="problem-box">
          <img src="../../../assets/img/warning.png"><label>是否确认删除？</label>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="paySure()">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        valueID: '',
        list: [],
        total: 0,
        pageIndex: 1,
        loadShow: false,
        showDialog: false,
        key: '',
        allList: [],
        pageSize: 10,
      }
    },
    created() {
      // this.getData()
    },
    methods: {
      btnDelete(item) {
        this.key = item.key
        this.showDialog = true
      },
      paySure() {
        this.$fetch.post('/user/user/delRedisValue',{
          key: this.key
        }).then(res => {
          if(res.code === 0) {
            this.showDialog = false
            Dialog({
              title: '',
              content: '删除成功',
              okFn: () => {
                this.getData()
              }
            })
          }
        })
      },
      resetFields() {
        this.valueID = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/user/queryRedisList', {
          mate: this.valueID, // id
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          // this.list = this.allList.slice(0,this.pageSize)
          this.total = res.data.page.totalCount
        }).catch(err => {
          this.loadShow = false
          console.log(err)
        })
      },
      getTurn(page) {
        this.list = this.allList.slice((page -1)  * this.pageSize, page * this.pageSize)
      },
      search() {
        this.total = 1 // hook listWrap组件的loading
        this.getData()
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .load-list-wrap{
    padding-top 25px
  }
  .problem-box{
    margin-top 20px
    img{
      margin-right 10px
    }
    label{
      font-size 16px
      color #121212
    }
  }
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
</style>
