<template>
  <div   class="" @click.stop  @touchmove.prevent="">
    <transition name="dialog">
      <div class="dialog"  @click="hide($event)"  v-if="merchantShow" @touchmove.prevent=""></div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" @click="quicklySendShow = false" v-if="merchantShow" @touchmove.prevent="">
        <div class="message-box">
          <div class="border-a">
            <div class="border-t"></div>
          </div>
          <div class="msg-uls" ref="msgUls">
            <div class="web-loading1" v-show="loadingMobile"> <img src="@img/loading2.gif" alt=""></div>
            <cube-scroll
                    ref="scroll"
                    :data="msgArr">
              <ul class=" clearfix" ref="msgUls" id="MessageBoxPlus">
                <li class="msg-list" v-for="(item, index) in msgArr" :key="index"
                    :class="{'is-receive': tradingData.buySystemCode !== item.receiveSystemCode}">
                  <div class="time-t">{{item.createAtStr}}</div>
                  <div class="msg-name"  v-if="item.messageType !== 8 && item.messageType !== 9 && item.sendUserName !== 'adminuser'">{{item.sendUserName}}</div>
                  <div class="img-box-a" v-if="ifImg(item.messageBody) === true && item.messageType !== 7">
                    <viewer :images="[item.messageBody]" class="img-list">
                      <img  :src="item.messageBody" >
                    </viewer>
                  </div>


                  <div class="msg-content" :class="kefuCls(item)" v-else-if="item.messageType === 7">
                    <div v-if="messageBodyFn(item.messageBody).bankType === 1">
                      <p class="title-bank">银行卡</p>
                      <p>银行卡号：{{messageBodyFn(item.messageBody).bankNumber}}</p>
                      <p>开户人：{{messageBodyFn(item.messageBody).realName}}</p>
                      <p>开户银行：{{messageBodyFn(item.messageBody).bankName}}</p>
                      <p>开发分行：{{messageBodyFn(item.messageBody).subBankName}}</p>
                    </div>
                    <div v-else>
                      <p class="title-bank">支付宝</p>
                      <p>账号：{{messageBodyFn(item.messageBody).realName}}</p>
                      <p>账户名称：{{messageBodyFn(item.messageBody).bankNumber}}</p>
                    </div>
                  </div>
                  <div class="msg-content" :class="kefuCls(item)" v-else>{{item.messageBody}}</div>
    <!--              <div class="msg-content">{{item.messageBody}}</div>-->
                </li>
              </ul>
            </cube-scroll>
          </div>
        </div>
        <div class="send-box" @keyup.enter="sendFn(2)" @click.stop>
          <div class="quickly-send" :class="{'active': quicklySendShow}" @click.stop="quicklySend">
            <div class="quickly-content" v-if="quicklySendShow">
              <cube-scroll :data="languageList">

                  <li class="item">常用语言</li>
                  <li class="item" v-for="(item,index) in languageList" :key="index" @click="sendFn(1, item)">{{item.content}}</li>

              </cube-scroll>
            </div>
          </div>
          <input class="sendMessage" type="text" v-model="sendMessage" >
          <div class="send-btn" @click="sendFn(2)">发送</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
	      loadingMobile: true,
	      quicklySendShow: false,
	      sendMessage:'',
        avtiveIndex: 0,
	      msgArr: [],
	      scrollY: 0,
	      loadingShow: false,
      }
    },
    props: {
	    tradingData: Object, // 数据
	    languageList: Array, // 常用语言
      merchantShow: Boolean, // 显示隐藏
    },
    mounted () {
	    document.onclick = ()=>  {
		    this.quicklySendShow = false
	    }
    },
    watch: {
	    merchantShow: function (newval) {
        if (newval === true) {
	        if (!this.tradingData.problemId) {
	        }
        	this.getMsgList()
        }
	    }
    },
    methods: {
	    messageBodyFn (body) {
		    if (body) {
			    return JSON.parse(body)
		    }
	    },
	    ifImg (url) {
		    if (url.indexOf('http') > -1 && (url.indexOf('png') > -1 || url.indexOf('jpg') > -1 || url.indexOf('gif') > -1)) {
			    return true
		    }
		    return  false
	    },
	    kefuCls (item) {
		    if (item.messageType === 8 || item.messageType === 9 || item.sendUserName === 'adminuser') {
			    return 'msg-content2'
		    }
		    return ''
	    },
	    quicklySend () {
		    this.quicklySendShow = !this.quicklySendShow
	    },
	    getMsgList () {
		    if (!this.tradingData.problemId) {
			    this.loadingShow = false
          this.loadingMobile = false
			    return
		    }
		    this.$fetch.post(`/user/problem/preCheckMessageList`,{
			    type: 1,
			    id: this.tradingData.problemId
		    }).then(res => {
			    if (res.code === 0) {
				    this.loadingShow = false
				    this.loadingMobile = false
				    this.msgArr = res.data.page.list.reverse()
				    setTimeout(() => {
					    this.scrollTo()
				    }, 100)
			    }
		    })
	    },
	    scrollTo() {
		    this.scrollY = document.getElementById("MessageBoxPlus").scrollHeight - this.$refs.msgUls.offsetHeight; //可滚动长度，300是整个框实际高度
		    this.$refs.scroll.refresh();
		    this.$refs.scroll.scrollTo(
			    0,
			    -this.scrollY,
			    200,
		    );
	    },
	    nameFn (item) {
		    if (this.tradingData.buySystemCode === item.receiveSystemCode) { // 系统和第三方
			    if (item.sendSystemCode === item.receiveSystemCode || item.sendSystemCode === item.receiveOtherCode) {
				    return item.receiveUserName
			    } else {
				    return item.sendUserName
			    }
		    } else { // 客户
			    return item.receiveUserName
		    }
	    },
	    // 发送消息
	    sendFn (index, item) {
		    let msg = ''
		    if (index === 1) {
			    msg = item.content
		    } else {
			    if (!this.sendMessage) return
			    msg = this.sendMessage
		    }
		    this.sendMessage = ''
		    this.$fetch.post('/user/problem/sendMessageInfo', {
			    id: this.tradingData.problemId, //	Long	申诉id
			    messageBody: msg, //		String	消息内容
			    type: 1, //		Integer	类型 1.申诉 2市商交易
		    }).then(res => {
			    if (res.code === 0) {
				    this.getMsgList()
			    }
		    })
	    },
      hide () {
	      this.quicklySendShow = false
	      this.$emit('hideDialog')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog,.wrap-t
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 700
    background-color: rgba(0,0,0, .4)
    &.wrap-t
      z-index: 750
    &.no-click
      pointer-events none
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1
  .dialog-w
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    padding: 0 0 30px 0
    height: 80%
    z-index: 800
    transform translate3d(0,0,0)
    background-color: #f5f5f5
    border-radius .6rem .6rem 0 0
    display: flex
    flex-direction column
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0,100%,0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0,0,0)
    .uls
      .list
        cursor pointer
        width: 100%
        height: 1.2rem
        display: flex
        align-items center
        justify-content center
        color #000
        font-size: .32rem
        border-bottom: 1px solid #e6e6e6
        &.active-list
          color #ff004e
  .message-box
    padding: 40px 0 0 0
    background-color: #4d4d4d
    overflow auto
    flex 1
    display: flex
    flex-direction column
    .border-a
      position: fixed
      left: 0
      top: 0
      width: 100%
      padding: 10px 0 20px
      .border-t
        margin: 0 auto
        width: 60px
        height: 5px
        background-color: #fff
        border-radius 4px
    .msg-uls
      flex 1
      overflow: hidden
      padding: 0 20px 30px 20px
      .web-loading1
        width: 100px
        height: 100px
      .msg-list
        display: flex
        align-items flex-end
        flex-direction column
        margin-bottom: 40px
        &.is-receive
          align-items flex-start
          .img-box-a .img-list
            align-items flex-start
            justify-content flex-start
          .msg-name
            text-align: right
          .msg-content
            background-color: #f5f5f5
        .time-t
          width: 100%
          text-align: center
          margin-bottom: 5px
          color #fff
        .img-box-a .img-list
          display: flex
          align-items flex-end
          justify-content flex-end
          margin: 10px 0
        img
          width: 70%
        .msg-name
          font-size: 14px
          color #fff
        .msg-content
          margin: 10px 0 0
          border-radius 10px
          background-color: #e7effc
          display inline-block
          padding: 16px
          line-height: 1.5
          &.msg-content2
            color #aaa
            font-size: 12px
            background-color: #f5f5f5
            padding: 5px 10px
            text-align: center
            margin: 0 auto 0
  .send-box
    width 100%
    display flex
    align-items center
    justify-content space-between
    bottom 0
    left 0
    z-index 100
    padding-top: 20px
    .quickly-send
      width 26px
      height 26px
      background url("~@img/PC/send-icon.svg") no-repeat center
      background-size contain
      cursor pointer
      position relative
      margin: 0 10px
      opacity  .8
      transition all .3s linear
      &::before
        content ''
        display: none
        border-width: 15px 15px;
        border-color: rgba(0,0,0,.1) transparent transparent;
        border-style: solid;
        position: absolute;
        top: -30px;
        left: 0;
        width: 0;
        height: 0;
      &.active
        opacity  1
      .quickly-content
        cursor auto
        position absolute
        width 360px
        height: 300px
        max-height: 300px
        background-color: #fff
        left -10px
        top -326px
        overflow hidden
        border-radius 4px
        z-index 6
        box-shadow 0 0 9px 5px rgba(0, 0, 0, .2)  //外部阴影
        &::before
          content ''
          display: block
          position: fixed
          z-index: 710
          left: 0
          top: 0
          right: 0
          bottom: 0
        >>> .cube-scroll-wrapper
          z-index: 720
        >>> .cube-scroll-list-wrapper
          min-height 310px !important
          .item
            font-size 14px
            color #000
            padding 10px 10px
            margin-bottom: 5px
            border-bottom: 1px solid #eee
            &:nth-child(1)
              padding-top 10px
              font-size 14px
              line-height 14px
              font-weight 600
              padding-bottom 12px
            &:nth-child(n+2)
              line-height 1.5
              min-height 30px
              display: flex
              align-items center
              transition all .3s linear
              &:hover
                color #1962df
                background-color rgba(0,0,0,.03)
                cursor pointer
    .sendMessage
      flex 1
      height 40px
      border 1px solid #a8a8a8
      border-radius 4px
      padding 0 10px
    .send-btn
      height 100%
      cursor pointer
      transition all .3s linear
      color #666
      font-size: 16px
      padding: 0 10px
      display: flex
      align-items center
      justify-content center
      &:hover
        color #2176ff
</style>
