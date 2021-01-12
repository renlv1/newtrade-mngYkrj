<template>
    <div>
      <div class="header">
        <div class="tit">新交易所管理平台</div>
        <div class="main">
           <div class="tab-cache">
               <div class="tab-box">
                   <div class="tab-button" v-show="item.showTab" :class="{'active': $route.path.indexOf(item.route) > -1}" @click.stop="anvActiveFn(item,index)" v-for="(item,index) in list" :key="index">{{item.name}}
                       <i @click.stop.self="close(item,index)" class="close"></i>
                   </div>
               </div>
           </div>
           <div class="user-info">
               <span class="name">{{$store.state.user.username}}</span>
               <span class="cred pointer" @click="logout">退出</span>
           </div>
        </div>
        <div class="phone">
           <div class="back" @click="goBack"></div>
           <div class="title">{{title}}</div>
           <div class="operation">
               <div class="screening" @click="complaintScreening" v-show="$route.path === '/users/user'"></div>
               <div class="nav-icon" :class="{'active': this.$store.state.menuShow}" @click="menu"></div>
           </div>
        </div>
      </div>
    </div>
</template>

<script>
  import bus from '@/assets/js/bus'
  /*eslint-disable*/
export default {
  data() {
    return{
	    title: '',
      backFlag: false, // 判断backIcon是返回home还是上一级(true为home， false为上一级)
      activeIndex: -1,
      list: [],
      delState: false,
      delList: [],
      arr: [],
      navArr: [],
      newArr: [],
      headArr: [],
      pc: window.innerWidth,
      screeningShow: this.$store.state.screeningShow,
      username: localStorage.getItem('userName'),
    }
  },
  created() {},
  mounted () {
  	this.getRoute()
    this.checkCurrentPath()
  },
  watch: {
  	'$route': 'getRoute',
    /*list: function () {
      // 新增tab的数量大于8个,就删除数组的第一个
     if (this.pc >= 1500) {
        if (this.list.length > 7) {
          this.list.shift()
        }
      } else if (this.pc >= 1200) {
        if (this.list.length > 5) {
          this.list.shift()
        }
      } else if (this.pc >= 1024) {
        if (this.list.length > 4) {
          this.list.shift()
        }
      }
    }*/
  },
  beforeDestroy () {},
  methods: {
    checkCurrentPath() {
      if (this.$route.path === '/blank') {
        this.backFlag = true
      } else {
        this.backFlag = false
      }
    },
    goBack() {
	    this.$router.go(-1)
      // if (this.backFlag) {
      //   this.$router.push('/blank')
      // } else if (this.$route.path === this.$store.state.route) {
      //   this.$router.push('/blank')
      // } else {
      //   this.$router.go(-1)
      // }
    },
   menu () {
     this.$store.state.menuShow = !this.$store.state.menuShow
     this.$store.commit('SET_MENU', this.$store.state.menuShow)
   },
   complaintScreening () {
     this.$store.commit('SET_SCREENING', this.screeningShow)
   },
   close (item,index) {
     item.showTab = false
     this.$store.commit('SET_DELLIST',this.list)
     let tabShow =[]
     tabShow = this.list.filter(item => item.showTab === false)
     // 追加的按钮数组都删除时(隐藏),跳转home
     if (tabShow.length === this.list.length) {
       this.$router.push('/blank')
       this.list = []
       this.$store.state.navArr = {}
       this.navArr = []
     } else {
       if (item.showTab === false) {
         let activeIndex = index - 1
         let obj = {}
         let last =[]
         last = this.list.filter(item => item.showTab === true)
         obj =last[last.length-1]
         if (obj) {
           this.anvActiveFn(obj,activeIndex)
         }
       }
     }
   },
   anvActiveFn (item,index) {
     this.$router.push(item.route)
     if (index === 0) {
       index ++
     }
     this.activeIndex = index
   },
   getRoute () {
     if (this.$store.state.navArr !== '') {
       this.navArr.push(this.$store.state.navArr)
       for (let i=0; i <this.navArr.length;i++) {
         if (this.headArr.map(x => x.name).indexOf(this.navArr[i].name) === -1 && this.navArr[i] !== {}) { // 去重
           if (this.navArr[i].name) {
             this.headArr.push(this.navArr[i])
           }
         }
       }
     }
     this.list = this.headArr
     if (this.$route.path === '/blank') {
       this.navArr = []
       this.headArr = []
       this.list = []
       this.$store.state.navArr = {}
       this.$store.commit('SET_NAV_ARR', {})
     }
     let path = this.$route.path
	   if (path === '/blank') {this.title = '新交易所管理平台'} else
	   if (path === '/problem/problem') {this.title = '问题反馈'} else
	   if (path === '/problem/details') {this.title = '反馈详情'} else
	   if (path === '/users/user') {this.title = '用户申诉'} else
	   if (path === '/users/langSettings') {this.title = '用户申诉'} else
	   if (path === '/users/orderDetail') {this.title = '申诉详情'}
	   },
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
      }).catch(er => {

      })
    }
  }
};
</script>

<style lang="less" scoped>
.header{
  .fsCenter;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 300;
  height: 60px;
  line-height: 60px;
  background: #f3f3f5;
  justify-content: space-between;
  @media @ipad {
    height: 50px;
    line-height: 50px;
    background-color: #000414;
  }
  .tit{
    width: 260px;
    font-size: 26px;
    color: @white;
    text-align: center;
    padding-top: 30px;
    background-color: #000414;
      @media @ipad {
          display: none;
      }
  }
    .main{
        flex: 1;
        //width: calc(100vw - 260px);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media @ipad {
            display: none;
        }
        .tab-cache{
            width: calc(100% - 161px);
            //flex: 1;
            height: 100%;
            position: relative;
            /*overflow-y: hidden;
            overflow-x: scroll;*/
            .tab-box{
                width: auto;
                height: 60px;
                line-height: 60px;
                position: absolute;
                left: 0;
                display: flex;
                flex-flow: nowrap;
                align-items: flex-end;
                justify-content: flex-start;
                .tab-button{
                    width: 140px;
                    height: 46px;
                    line-height: 46px;
                    text-align: center;
                    color: @text;
                    font-size: @tabFontSize;
                    background-color: #e4e7ed;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    position: relative;
                    cursor: pointer;
                    margin-right: 10px;
                    transition: all .1s linear;
                    &.active{
                        background-color: @blue;
                        color: @white;
                        .close{
                            background: url("~@img/PC/close-fff.svg") no-repeat center;
                        }
                    }
                    &:hover{
                        opacity: .9;
                    }
                    .close{
                        position: absolute;
                        display: inline-block;
                        width: 10px;
                        height: 12px;
                        background: url("~@img/PC/close-black.svg") no-repeat center;
                        background-size: contain;
                        top: 0px;
                        right: 2px;
                    }
                }   
            }
        }
        .user-info{
            width: 161px;
            line-height: 15px;
            display: flex;
            align-items: center;
            font-size: 15px;
            color: @white;
            height: 100%;
            .to-audit{
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-right: 50px;
                position: relative;
                z-index: 100;
                height: 100%;
                /*&:hover{*/
                /*  .order-ul{*/
                /*    opacity: 1;*/
                /*    top: 68px;*/
                /*    visibility: visible;*/
                /*    transition: .3s .1s;*/
                /*  }*/
                /*}*/
                .order-box{
                    display: flex;
                    align-items: center;
                }
                .order-ul{
                    top: 60px;
                    opacity: 1;
                    display: block;
                    position: absolute;
                    z-index: 100;
                    width: 250px;
                    text-align: left;
                    left: -30px;
                    /*top: 20px;*/
                    border-radius: 3px;
                    line-height: 30px;
                    visibility: visible;
                    background: #fff;
                    box-shadow: 0 2px 5px rgba(9,131,239,.15);
                    padding: 10px 0;
                    &.active{
                        opacity: 0;
                        visibility: hidden;
                    }
                    //三角形
                    /*&:after{*/
                    /*  content: "";*/
                    /*  position: absolute;*/
                    /*  top: 2px;*/
                    /*  left: 50%;*/
                    /*  transform: translate(-50%);*/
                    /*  border-width: 0 38px 38px;*/
                    /*  border-style: solid;*/
                    /*  border-color: transparent transparent #fff;*/
                    /*}*/
                    .li-order{
                        /*text-align: left;*/
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        color: #444;
                        .blue{
                            color: #3376ff;
                        }
                    }
                }
                .order-icon{
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    background: url("~@img/order-icon.png") no-repeat center;
                    background-size: cover;
                    margin-right: 6px;
                }
                .pending-order{
                    .num{
                        background-color: @warn;
                        position: absolute;
                        /*width: 18px;*/
                        height: 18px;
                        line-height: 18px;
                        text-align: center;
                        font-size: 12px;
                        top: 16px;
                        right: -8px;
                        padding: 0 3px;
                        border-radius: 8px;
                        &.one-num{
                            border-radius: 50%;
                            padding: 0 6px;
                        }
                        &.more-num{
                            right: -30px;
                        }
                    }
                }
            }
            .user-icon{
                width: 15px;
                height: 15px;
                display: inline-block;
                background: url("~@img/user-icon.png") no-repeat center;
                background-size: cover;
                margin-right: 6px;
            }
            .name{
                padding-right: 20px;
                color: #3b4966;
            }
            .cred{
                display: inline-block;
                width: 100px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                color: @white;
                background-color: @blue;
                border-top-left-radius: 17px;
                border-bottom-left-radius: 17px;
                font-size: 15px;
            }
        }
    }
}
.phone{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    @media screen and (min-width: 1024px){
        display: none;
    }
    .back{
        width: 10px;
        height: 18px;
        background: url("~@img/mob/back.svg") no-repeat center;
        background-size: contain;
    }
    .title{
        font-size: 18px;
        color: #fff;
        text-align: center;
    }
    .operation{
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            width: 18px;
            height: 18px;
            background-color: pink;
            cursor: pointer;
        }
        .screening{
            background: url("~@img/mob/screening.svg") no-repeat center;
            background-size: contain;
        }
        .nav-icon{
            background: url("~@img/mob/menu.svg") no-repeat center;
            background-size: contain;
            margin-left: 14px;
            //transition: all .1s linear;
            &.active{
                background: url("~@img/mob/close.svg") no-repeat center;
                background-size: contain;
            }
        }
    }
}
</style>

