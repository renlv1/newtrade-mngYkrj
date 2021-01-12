<template>
  <div class="c-page  mar-right transaction-list">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">权限管理 ></router-link>
      <router-link to="">系统日志</router-link>
    </div>
    <div class="page-wrap">
      <div class="search hCenter">
        <div class="vCenter">
          <div class="label">用户名/操作描述：</div>
          <div class="input-wrap"><input type="text" v-model="searchVal"></div>
          <div class="btns">
            <div class="btn" @click="getData">查询</div>
            <div class="btn black" @click="searchVal = ''">清空</div>
          </div>
        </div>
      </div>
      <list-wrap :list="isListNull(list)" :total="total" @change="getData">
        <div class="web-table">
          <table>
            <tr class="thead">
              <td width="6%">id</td>
              <td width="6%">用户名</td>
              <td width="10%">用户操作</td>
              <td width="15%">请求方法</td>
              <td>请求参数</td>
              <td width="8%">执行时长</td>
              <td width="8%">IP地址</td>
              <td width="8%">创建时间</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.username}}</td>
              <td>{{item.operation}}</td>
              <td>{{item.method}}</td>
              <td>{{item.params}}</td>
              <td>{{item.time}}</td>
              <td>{{item.ip}}</td>
              <td>{{item.createDate}}</td>
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
  /*eslint-disable*/
  export default {
    data() {
      return {
        list: [],
        total: 0,
        searchVal: '',
        page: 1,
        loadShow: false
      }
    },
    mounted() {
    },
    methods: {
      getData(page) {
        this.loadShow = true
        this.$fetch.post('/sys/log/list?sysCode=system_center', {
          key: this.searchVal,
          page: page || this.page,
          pageSize: 10,
        }).then(res => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
    },
    
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap
    background-color: @white;
  .search
    padding-top 20px
</style>
