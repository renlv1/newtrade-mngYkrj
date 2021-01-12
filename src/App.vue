<template>
  <div id="app" :class="{'hidden-a': routeFlag}">
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <img src="@img/loading2.gif" alt="">
        <p>{{$store.state.showLoading !== true ? $store.state.showLoading : '正在加载中...'}}</p>
      </div>
    </div>
    <web-nav v-show="$route.path !== '/login'"/>
    <web-header  v-if="$route.path !== '/login'"/>
    <transition name="zoom">
      <keep-alive>
        <router-view class="main-container" />
      </keep-alive>
    </transition>
    <!--<transition name="zoom">
      <router-view class="main-container"/>
    </transition>-->
  </div>
</template>
<script>
  export default {
    data() {
      return{
      	routeFlag: false,
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
			      background: '#c1c1c1',   //颜色
		      }
	      },
      }
    },
    watch: {
    	'$route': 'routeFn'
    },
    methods: {
	    routeFn () {
	    	this.routeFlag = true
        setTimeout(() => {
	        this.routeFlag = false
        }, 1500)
      }
    },
    mounted() {
      if (this.$route.path !== '/login') {
      	this.$store.commit('SET_IS_LOGIN', true)
      } else {
	      this.$store.commit('SET_IS_LOGIN', false)
      }
    },
    created () {
      // 解决vuex刷新数据丢失
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store")) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
      }
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("store", JSON.stringify(this.$store.state))
      })
    },
    components: {
      webNav: require('@/components/nav').default,
      webHeader: require('@/components/header').default,
    },
  }
</script>

<style lang="less">
@import "assets/css/reset.less";
@import "assets/css/common.less";
@import "assets/css/trade.less";
@import "assets/css/deploy.less";
@import "assets/css/var.less";
.viewer-canvas{
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/
  img{
    /*margin-right: 0 !important;*/
    /*margin-top: 0 !important;*/
    /*margin-left: 0 !important;*/
  }
}
textarea{
  touch-action: none;
  border: none;
  resize: none;
  outline: none;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  &:focus{
    border-color: #2176ff !important;
  }
}
.cube-scroll-wrapper{
  position: relative;
  height: 100%;
}
button.el-button--primary{
  background-color: #1962df;
  border-color: #1962df;
}
#app {
  font-size: 14px;
  color: #474747;
  background-color: @white;
  min-height: 100vh;
  word-break: break-all;
  font-family: "Helvetica Neue",Helvetica,"Microsoft YaHei","微软雅黑",Arial,sans-serif;
  padding-left: 260px;
  padding-top: 60px;
  overflow-x: hidden;
  @media @ipad{
      padding-left: 0;
      padding-top: 50px;
  }
  &.hidden-a{
    overflow: hidden;
  }
  .a-t{
    position: fixed !important;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    padding-left: 200px !important;
    padding-top: 66px !important;
  }
}

.ajax-loading{
  position: fixed;
  z-index: 999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .loading-content{
    position: absolute;
    width: 150px;
    height: 150px;
    background: rgba(0,0,0,.8);
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .vCenter;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    border-radius: 10px;
  }
  img{
    width: 80px;
    text-align: left;
    margin-bottom: 16px;
  }
}
.zoom-leave{
  display: none;
}
.zoom-enter-to{
  transition: .35s;
  @media screen and (max-width:1200px) {
    transition: none;
  }
}
.zoom-enter{
  transform: translateY(5px);
  overflow: hidden;
  opacity: .2;
}
.main-container{
  width: calc(100vw - 260px);
  //padding: 24px 20px 0 40px;
    @media @ipad{
        width: 100%;
    }
    @media screen and (max-width:1400px) {
        padding-left: 20px;
    }
    @media screen and (max-width:750px) {
        padding-left: 0;
    }
}
</style>


