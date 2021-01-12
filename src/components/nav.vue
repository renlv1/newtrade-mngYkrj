<template>
<nav class="nav c-page" ref="scrollWrap" :class="{'active': isMob && $store.state.menuShow}">
        <vue-scroll :ops="ops">
            <!--$store.state.navList-->
          <div class="dl" v-for="(item, index) in $store.state.navList" :key="index">
            <div class="dt" @click="handle(item, index)" :class="{active: activeIndex === index}" v-if="item.name !== '订单管理' && item.name !== '收款单管理' && item.name !== '考勤管理'">
              <i v-if="item.list" style="margin-right: 10px;" class="icon-caret-right"></i>
              <span class="f1">{{item.name}}</span>
              <span class="el-icon-caret-right" :class="{'active': activeIndex === index}"></span>
            </div>
            <el-collapse-transition>
              <div class="child-wrap" v-if="item.list" v-show="activeIndex === index">
                  <div class="child-gap">
                    <div v-resetClick="3000" @click="navActiveFn(childItem,j,$event)" v-show="childItem.route" class="dd" :class="{'active': $route.path.indexOf(childItem.route) > -1,'disabled':disabled}" v-for="(childItem, j) in item.list" :key="j" >{{childItem.name}}</div>
                  </div>
              </div>
            </el-collapse-transition>
          </div>
        <div class="user-info">
            <div class="name">{{$store.state.user.username}}</div>
            <div class="cred" @click="logout">退出</div>
        </div>
        </vue-scroll>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      disabled: false,
      isMob: window.innerWidth <= 1024,
      isShow: true,
      activeNav: -1,
      navArr: [],
      arr: [],
      //activeIndex: Number(localStorage.getItem('SET_NAV_ACTIVE')) || -1,
      navList: [
        {
          name: '权限管理',
          list: [
              {
                  name: '管理员信息',
                  route: '/sysCenter/ctrlUser'
              },
              {
                  name: '资源信息',
                  route: '/sysCenter/menuList'
              },
              {
                  name: '角色列表',
                  route: '/sysCenter/role'
              }
          ]
        },
        {
          name: '用戶管理',
          list: [
            {
              name: '用戶申诉',
              route: '/users/user'
            },
            {
              name: '用戶查询',
              route: '/deal/userQuery'
            },
            {
              name: '登录日志',
              route: '/users/logging'
            },
            {
              name: '查询常用语言',
              route: '/users/queryLang'
            },
            {
              name: '用户账户查询',
              route: '/users/accountQuery'
            },
            {
              name: '用户认证查询',
              route: '/users/authenticationQuery',
            },
            {
              name: '用户账户记录',
              route: '/trade/userAccountLog',
            },
            {
              name: '验证码查询',
              route: '/users/verifyCode',
            },
            {
              name: 'Redis查询',
              route: '/user/redisKey'
            }
          ]
        },
        {
          name: '问题管理',
          list: [
              {
                  name: '意见反馈',
                  route: '/problem/problem'
              }
          ]
        },
        {
          name: '交易管理',
          list: [
              {
                  name: '市商管理',
                  route: '/business/business',
              },
              {
                  name: '订单审核',
                  route: '/business/orderAudit',
              },
              {
                  name: '银行卡查询',
                  route: '/trade/bankInfo/bankInfo',
              },
              {
                  name: '市商服务',
                  route: '/business/serviceOrder',
              },
              {
                name: '交易记录',
                route: '/user/tradeRecord',
              },
              { // 股票
                name: '查询统计金额',
                route: '/business/statisticalAmount'
              }
          ]
        },
        {
          name: '新交易所管理',
          list: [
              {
                  name: '虚拟币充提配额度',
                  route: '/coin/coinDepositAndDrawLimit',
              },
              {
                  name: '提币地址管理',
                  route: '/coin/drawCoinAccount',
              },
              {
                  name: '币币充值汇总任务',
                  route: '/coin/manTransLog',
              },
              {
                  name: '虚拟币账户',
                  route: '/coin/tcAccount',
              },
              {
                  name: '虚拟币充提记录',
                  route: '/coin/tcOrder',
              },
              {
                  name: '币种货币对',
                  route: '/coin/ccPair',
              },
              {
                  name: '币种委托',
                  route: '/coin/coinentrust',
              },
              {
                  name: '币种成交记录',
                  route: '/coin/cointrade',
              },
              {
                  name: '币种行情记录',
                  route: '/coin/coinVolume',
              },
          ]
        },
        {
          name: '系统管理',
          list: [
              {
                  name: '错误日志查询',
                  route: '/system/errorLog',
              },
              {
                  name: '消息记录查询',
                  route: '/system/messageList',
              },
              {
                  name: '公告查询',
                  route: '/system/notice',
              },
          ]
        },
      ],
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
      }
    }
  },
  created () {
  },
  mounted() {
    this.$store.commit('SET_LOADING', false)
    if (this.$route.path !== '/login') {
	    this.$store.dispatch('getNavList')
    }
    this.$nextTick(() => {
      if (this.isMob) {
        this.$store.state.menuShow = !this.$store.state.menuShow
        this.$store.commit('SET_MENU', !this.$store.state.menuShow)
      }
    })
  },
  computed: {
    // 解决Vuex不能响应式
    activeIndex() {
      return this.$store.state.navActiveIndex // 当前展开的菜单
    }
  },
  methods: {
    logout () {
      this.$confirm('确定退出登陆吗？').then(() => {
        this.$fetch.get('/sys/logout').then(() => {
          localStorage.removeItem('userName')
          this.$store.commit('SET_IS_LOGIN', false)
          this.$store.commit('CLEAR_ACCOUNT')
          this.$store.commit('SET_LOGIN_FLAG',false)
          localStorage.removeItem('SET_NAV_ACTIVE')
          this.$router.push('/login')
        }).catch(err => {
          localStorage.removeItem('userName')
          this.$store.commit('SET_IS_LOGIN', false)
          this.$store.commit('SET_LOGIN_FLAG',false)
          this.$store.commit('CLEAR_ACCOUNT')
          this.$router.push('/login')
        })
      })
    },
    navActiveFn (item,index,event) {
      /*let forbidS = this.$store.state.forbidS
      let arr = this.$store.state.navArr*/
      this.$router.push({path:item.route})
      //返回路径
      this.$store.commit('SET_PATH',item.route)
      // 头部追加nav
      let obj = {
        name: item.name,
        route: item.route,
        showTab: true,
      }
      if (event.target.disabled) {
        // 点击太频繁了
        return
      } else {
        this.$store.commit('SET_NAV_ARR', obj)
      }
      for (let i in this.$store.state.delList) {
        if (obj.name === this.$store.state.delList[i].name) {
          this.$store.state.delList[i].showTab = true
        }
      }
      // 移动端菜单nav-show
      if (this.isMob) {
        this.$store.state.menuShow = !this.$store.state.menuShow
        this.$store.commit('SET_MENU', this.$store.state.menuShow)
      }
    },
    // commit 为了防止刷新nav状态会变化
    handle(item, index) {
      if (this.activeIndex === index) {
        this.$store.commit('SET_NAV_ACTIVE', -1)
        // localStorage.setItem('SET_NAV_ACTIVE', -1)
      } else {
        this.$store.commit('SET_NAV_ACTIVE', index)
        // localStorage.setItem('SET_NAV_ACTIVE', index)
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .nav {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    width: 260px;
    z-index: 100;
    background: #000414;
    color: #fff;
    font-size: 16px;
    overflow-y: auto;
    padding-top: 30px;
    @media @ipad {
        z-index: 2000;
        height: 0;
        transition: height .3s linear;
        padding-top: 0;
        &.active{
            height: 100%;
        }
    }
    @media @ipad {
        top: 50px;
        width: 100% !important;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #376794;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    @media screen and (max-width:1400px) {
        width: 260px;
    }
    /deep/ .__vuescroll{
      .__view{
        padding: 0 0 40px !important;
        min-height: 100%;
        @media @ipad{
            min-height: 0 !important;
            height: calc(100vh - 90px) !important;
        }
      }
      .__rail-is-vertical{
        right: -1px !important;
      }
    }
    .ismob-h{
        height: 0;
        transition: height .3s linear;
        &.active{
           height: 100%;
        }
    }
    .dl {
      @media @ipad {
        //border-bottom: 1px solid #fff;
        box-shadow: 0px 1px 1px -1px #fff;
      }
      &:nth-child(1){
          .dt{
            i{
              background: url("~@img/PC/user-icon.svg") no-repeat center;
              background-size: contain;
            }
          }
      }
      &:nth-child(2),&:nth-child(3),&:nth-child(4),&:nth-child(5),&:nth-child(6),&:nth-child(7){
        .dt{
          i{
            background: url("~@img/PC/trading.svg") no-repeat center;
            background-size: contain;
          }
        }
      }
      .dt {
        .vCenter;
        font-size: 16px;
        padding: 0 48px 0 15px;
        height: 50px;
        cursor: pointer;
        background-color: rgba(240,240,240,.1);
        i{
            display: inline-block;
            width: 30px;
            height: 30px;
        }
       }
        @media screen and (max-width:1400px) {
          padding-left: 6px;
        }
        @media @ipad{
          padding-left: 0;
        }
        .f1{
          white-space: nowrap;
        }
        .el-icon-caret-right{
            transition: all .2s linear;
            &.active{
                &:before{
                    content: "\E790";
                }
            }
        }
      }
    .user-info{
        position: absolute;
        right: 20px;
        bottom: 34px;
        z-index: 100;
        display: block;
        @media screen and (min-width: 1025px){
            display: none;
        }
        .name{
            font-size: 16px;
        }
        .cred{
            width: 60px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 4px;
            background-color: #2176ff;
            color: white;
            margin-top: 20px;
        }
    }
    .child-wrap {
    background: #2b2e3a;
    }
    .child-gap {
    /*padding: 8px 0;*/
    }
    .dd {
        height: 50px;
        line-height: 50px;
        display: block;
        opacity: .5;
        white-space: nowrap;
        padding-left: 54px;
        cursor: pointer;
        @media screen and (max-width:1400px) {
        }
        &.active {
          background: #2176ff;
          opacity: 1;
          /*color: #2176ff;*/
        }
        &.disabled{
            pointer-events: none;
            cursor: default;
            opacity: 0.6;
        }
    }
  }
</style>

