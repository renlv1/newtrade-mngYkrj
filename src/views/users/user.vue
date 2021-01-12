<template>
    <div class="c-page media-wrap mar-right"  @click.stop="quicklySendShow = false">
        <div class="wrap pc-wrap">
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">订单ID</div>
                        <div class="input-wrap"><input v-model.trim="orderId" type="number" placeholder="请输入订单ID"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">申诉方</div>
                        <div class="input-wrap"><input v-model.trim="userName" type="text" placeholder="输入申诉方昵称"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">被申诉方</div>
                        <div class="input-wrap"><input v-model.trim="replyName" type="text" placeholder="输入被申诉方昵称"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">问题来源</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                            <span class="el-dropdown-link">
                              {{refStateText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in  problemResourceIdEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">问题状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                  {{roundRewardText || '待处理'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in problemStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box">
                        <div class="label">申诉类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="commandChange">
                            <span class="el-dropdown-link">
                              {{problemTypeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                <el-dropdown-menu class="menu" slot="dropdown">
                                    <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in problemContentTypeEnum" :key="index">{{item.text}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="search-box btns">
                        <!--<div @click="resetFields()" class="btn black">清空</div>-->
                        <div class="btn" @click="search">查询</div>
                        <div class="btn lang-btn" @click="langSettings">常用语言设置</div>
                        <div class="btn" v-show="itemActiveShow" @click="check">查看</div>
                    </div>
                </div>
                <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
                  <el-table
                          :data="list"
                          border
                          :highlight-current-row="true"
                          :index="indexF"
                          class="table-w-a"
                          @row-click="itemDetail"
                          style="width: 100%">
                    <el-table-column
                            prop="id"
                            width="40"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="orderId"
                            label="订单编号">
                    </el-table-column>
                    <el-table-column
                            label="状态">
                      <template slot-scope="scope"><div :class="{'no-s': scope.row.problemStatus === 0}">{{matchType(problemStatusEnum,scope.row.problemStatus)}}</div></template>
                    </el-table-column>

                    <el-table-column
                            prop="userName"
                            label="申诉方">
                    </el-table-column>
                    <el-table-column
                            prop="userSystemCode"
                            label="申诉方地址">
                    </el-table-column>
                    <el-table-column
                            prop="replyName"
                            label="被申诉方">
                    </el-table-column>
                    <el-table-column
                            prop="replySystemCode"
                            label="被申诉方地址">
                    </el-table-column>
                    <el-table-column
                            label="来源">
                      <template slot-scope="scope">{{matchType(problemResourceIdEnum,scope.row.resourceId)}}</template>
                    </el-table-column>
                    <el-table-column
                            label="类型">
                      <template slot-scope="scope">{{matchType(problemContentTypeEnum,scope.row.contentType)}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="发布时间">
                    </el-table-column>
                    <el-table-column
                            prop="updatetime"
                            label="修改时间">
                    </el-table-column>
                  </el-table>
                </list-wrap>
                <div style="z-index: 9999" class="web-loading1" v-show="loadingShow2">
                  <img src="~@img/loading2.gif" />
                </div>
            </div>
        </div>
        <div class="dialog" v-show="detaildialogShow">
            <div class="content-box">
                <div class="content-info">
                    <div class="complaintOrder">
                        <ul>
                            <li class="li order">申诉订单：{{detailObj.orderId}} ({{matchType(problemResourceIdEnum,detailObj.resourceId)}})</li>
                            <li class="li complaint">
                                <div class="title"><span class="tit">申诉方：</span>{{detailObj.userName}} ({{detailObj.businessType === 1 ? "市商": "用户"}})</div>
                                <div class="complaint-btn" @click="winFn(1)"
                                     :class="{'is-blue': detailObj.problemStatus !== 0, 'win-t':detailObj.backup2 && detailObj.backup2 === detailObj.userSystemCode}"
                                     v-show="(detailObj.backup2 === detailObj.userSystemCode) || !detailObj.backup2">申诉方胜</div>
                            </li>
                            <li class="li ppeal-reason">
                                <div class="tit">申诉原因：</div>
                                <div class="con">{{matchType(problemContentTypeEnum,detailObj.contentType)}}</div>
                            </li>
                            <li class="li describe">
                                <div class="tit">详细描述：</div>
                                <div class="con">
                                  <pre>{{isEmptyText(detailObj.content)}}</pre>
                                </div>
                            </li>
                            <li class="li img">
                                <div class="tit">图片附件：</div>
                                <div class="con" v-if="contentimg && contentimg.length > 0">
                                    <viewer :images="contentimg" class="img-list">
                                      <img v-for="(src, a) in contentimg" :src="src" :key="a">
                                    </viewer>
                                </div>
                                <div class="con" v-else>-</div>
                            </li>
                            <li class="li hr"></li>
                            <li class="li by-the-complainant">
                                <div ><span class="tit">被申诉方：</span>{{isEmptyText(detailObj.replyName)}} ({{detailObj.businessType === 2 ? "市商": "用户"}})</div>
                                <div class="complaint-btn" @click="winFn(2)"
                                     :class="{'is-blue': detailObj.problemStatus !== 0,'win-t': detailObj.backup2 && detailObj.backup2 === detailObj.replySystemCode}"
                                     v-show="(detailObj.backup2 && detailObj.backup2 === detailObj.replySystemCode) || !detailObj.backup2">被申诉方胜</div>
                            </li>
                            <li class="li describe">
                                <div class="tit">申诉描述：</div>
                                <div class="con">
                                  <pre>{{isEmptyText(detailObj.replycontent)}}</pre>
                                </div>
                            </li>
                            <li class="li img">
                                <div class="tit">图片附件：</div>
                                <div class="con" v-if="replyimg && replyimg.length > 0">
                                    <viewer :images="replyimg" class="img-list">
                                      <img v-for="(src, b) in replyimg" :src="src" :key="b">
                                    </viewer>
                                </div>
                                <div class="con" v-else>-</div>
                            </li>
                            <li class="li hr"></li>
                            <li class="li order-information">
                                <div class="information">
                                  <div class="info-li">订单信息：{{detailObj.orderId}}</div>
                                  <div class="loading-t" v-show="loading2">
                                    <img src="@img/loading2.gif" />
                                  </div>
                                  <div v-show="isShow && tradingData.rate">
                                    <div class="info-li">实际收款金额：{{tradingData.transferAmount}} {{tradingData.currency}}</div>
                                    <div class="info-li">单价：{{tradingData.rate}}</div>
                                    <div class="info-li">数量：{{tradingData.total}}</div>
                                    <div class="info-li">订单状态：{{statusFn(tradingData.status)}}</div>
                                    <div class="info-li">放款ID：{{tradingData.transactionId}}</div>
                                    <div class="info-li">下单时间：{{tradingData.createTime}}</div>
                                    <div class="info-li">用户信息：{{tradingData.giveBankName}} / {{tradingData.giveRealName}} / {{tradingData.giveAccount}}</div>
                                    <div class="info-li">市商信息：{{sellBankAccount.bankName}} / {{sellBankAccount.realName}} / {{sellBankAccount.bankNumber}}</div>
                                  </div>
                                  <div v-show="!tradingData.rate && isShow" class="no-data">暂无订单信息</div>
                                </div>
                                <div class="complaint-btn" @click="checkData2">查询</div>
                            </li>
                            <!--<li class="li ancel-the-complaint">取消申诉</li>-->
                        </ul>
                    </div>
                    <div class="chat">
                        <div class="show-btn">
                            <div class="tit">
                                显示会话
                                <el-switch
                                        v-model="switchValue"
                                        active-color="#2176ff"
                                        inactive-color="#ddd"
                                        @change="switchActive">
                                </el-switch>
                            </div>
                            <img class="close" @click="close" src="~@img/PC/close-no.svg" alt="">
                        </div>
                        <div class="chat-box" >
                            <div class="loading" v-show="loadingShow"></div>
                            <div class="infn" v-show="!loadingShow">
                                <div class="chat-top">
                                  <span class="text-a">会话内容</span>
                                  <div @click="refresh">
                                    <img src="@img/PC/refresh.svg" alt="">
                                  </div>
                                </div>
                                <div class="message-box" ref="msgUls">
                                  <ul class="msg-uls clearfix">
                                    <li class="msg-list"
                                        v-for="(item, index) in msgArr" :key="index"
                                        :class="{'is-receive': item.sendSystemCode !== tradingData.sellSystemCode}">
                                      <div class="time-t">{{item.createAtStr}}</div>
                                      <div class="msg-name" v-if="item.messageType !== 8 && item.messageType !== 9 && item.sendUserName !== 'adminuser'">{{nameFn(item)}}</div>
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
                                    </li>
                                  </ul>
                                </div>
                                <div class="send-box" @keyup.enter="sendFn(2)">
                                    <div class="quickly-send" :class="{'active': quicklySendShow}" @click.stop="quicklySend">
                                        <div class="quickly-content" v-show="quicklySendShow">
                                            <ul>
                                                <li class="item">常用语言</li>
                                                <li class="item" v-for="(item,index) in languageList" :key="index" @click="sendFn(1, item)">{{item.content}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="textarea-w">
                                      <textarea  class="sendMessage"  v-model="sendMessage" @keyup="inputFn" @input="inputFn" ref="textarea"
                                                 :style="{height: fheight + 'px'}"> </textarea>
                                      <div class="texta-hidden" ref="textaHidden">{{sendMessage}}</div>
                                    </div>

                                    <div class="send-btn" @click="sendFn(2)">发送</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="img-big-dialog" v-show="bigImgShow" @click="bigImgShow = false">
          <div class="img-box">
            <img :src="bigImg" alt="">
          </div>
        </div>
        <div class="mob-wrap">
          <div class="top-a" @click="showSwitch"></div>
          <div class="search-box" @click="change3">
            <div class="label">问题状态</div>
            <div class="input-wrap dropdown-wrap">
              <span class="el-dropdown-link">
                {{roundRewardText || '待处理'}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            </div>
          </div>
          <div class="scroll-list-wrap">
            <div class="web-loading1" v-show="loadingMobile"> <img src="@img/loading2.gif" alt=""></div>
            <div class="no-data" v-show="noDataShow">
              <img src="@img/empty.png" >
              <span>暂无数据</span>
            </div>
            <cube-scroll
                    ref="scroll"
                    :options="options"
                    :data="listMob"
                    @pulling-up="onPullingDown">
              <div class="item-li" v-for="(item, index) in listMob" :key="index" @click="gotoDetails(item)">
                <div class="li">
                  <div class="order-id">充值订单编号： {{item.orderId}}</div>
                  <div class="state" :class="{'active': item.problemStatus === 0}">{{matchType(problemStatusEnum,item.problemStatus)}}</div>
                </div>
                <div class="li" v-if="item.userName === '-' ">申诉人：{{item.userName}} -</div>
                <div class="li" v-else>申诉人：{{isEmptyText(item.userName)}} （{{item.businessType === 1 ? "市商": "用户"}}）</div>
                <div class="li" v-if="item.replyName === '-' ">被申诉人：{{item.replyName}} -</div>
                <div class="li" v-else>被申诉人：{{isEmptyText(item.replyName)}} （{{item.businessType === 2? "市商": "用户"}}）</div>
                <div class="li">
                  <div class="cause">{{matchType(problemContentTypeEnum,item.contentType)}}</div>
                  <div class="Date">{{item.createtime}}</div>
                </div>
              </div>
            </cube-scroll>
          </div>
          <div class="search-order" v-show="searchShow" @click="searchShow = false">
            <div class="search-main" @click.stop>
              <div class="search-input"><input type="number" placeholder="搜索订单号" v-model.trim="orderId"></div>
              <div class="search-input"><input type="text" placeholder="输入申诉方名称" v-model.trim="userName"></div>
              <div class="search-input"><input type="text" placeholder="输入被申诉方名称" v-model.trim="replyName"></div>
            </div>
            <div class="btn-ok" @click="searchFn">完成</div>
          </div>
        </div>
        <div class="search-order2">
          <transition name="dialog">
            <div class="dialog"  @click="searchCancel"  v-if="sShow" @touchmove.prevent=""></div>
          </transition>
          <transition name="fade-up">
            <div class="dialog-w" @click="searchCancel"  v-if="sShow">
              <div class="search-main" @click.stop>
                <div class="search-input" v-for="(item, index) in problemStatusEnum" :key="index" @click="searchOne(item)">{{item.text}}</div>
              </div>
              <div class="btn-ok" @click="searchCancel">取消</div>
            </div>
          </transition>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
	      sShow: false,
	      noDataShow: false,
	      loadingMobile: false,
	      loadingShow2: false,
	      fheight: 42,
	      searchShow: false,
	      listMob: [],
	      indexF: '',
	      isShow: false,
	      loading2: false,
	      sellBankAccount: {},
	      bigImg: '',
	      bigImgShow: false,
        activeIndex: -1,
        detailObj: {},
        replyimg: [],
        contentimg: [],
        itemActiveShow: false,
        switchValue: false,
        loadingShow: false,
        dialogShow: false,
        detaildialogShow: false,
        quicklySendShow: false,
        id: '',
        orderId: '',
        userName: '',
        replyName: '',
        resourceId: '',  //申诉来源
        contentType: '', // 申诉类型
        problemStatus: 0, // 申诉状态 默认待处理
        list: [],
        languageList:[],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        itemShow: false,
        refStateText: '',
        refStateId: '',
        roundRewardText: '',
        problemTypeText: '',
        roundRewardId: '',
        unfoldActive: 0,
        problemStatusEnum: [],
        problemResourceIdEnum: [],
        sendMessage: '',
        problemContentTypeEnum: [],
        tradingData: {},
	      listTotal: 0,
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
	      msgArr: [],
	      dataId: ''
      }
    },
    created () {
      this.getType()
      if (window.innerWidth < 1200) {
      	this.loadingMobile = true
      	this.getData()
      }
    },
    watch: {
	    msgArr: function () {
		    if (this.$refs.msgUls) {
			    this.$refs.msgUls.scrollTop = this.$refs.msgUls.scrollHeight + 100
		    }
	    },
      '$route': function () {
        this.itemActiveShow = false
      }
    },
    methods: {
    	//  0 新创建 1选择收款方式（卖家,等待买家打款） 2已打款 3完成（卖家确认收款） 4取消 5仲裁中  6仲裁完成 7支付待确认 8申请取消提现订单
      statusFn (type) {
	      if (type === 0) return '新创建'
	      if (type === 1) return '选择收款方式（卖家,等待买家打款）'
	      if (type === 2) return '已打款'
	      if (type === 3) return '完成（卖家确认收款）'
	      if (type === 4) return '取消'
	      if (type === 5) return '仲裁中'
	      if (type === 6) return '仲裁完成'
	      if (type === 7) return '支付待确认'
	      if (type === 8) return '申请取消提现订单'
      },
	    change3 () {
		    this.sShow = true
	    },
	    searchCancel () {
		    this.sShow = false
	    },
	    searchOne (item) {
		    this.pageIndex = 1
		    this.loadingMobile = true
		    this.roundRewardText = item.text
		    this.problemStatus = item.id
		    this.getData(1,10)
		    this.sShow = false
	    },
	    patch(re, s) {
		    re = eval("/" + re + "/ig")
		    return s.indexOf(re.source) > -1 ? s.match(re).length : 0;
	    },
	    inputFn () {
		    // let content = this.sendMessage;
		    // var data = content.replace(/\n/g, "<br>");
		    // var num = this.patch('<br>', data);
		    if (this.$refs.textaHidden.offsetHeight < 80) {
			    this.fheight = this.$refs.textaHidden.offsetHeight
        } else {
			    this.fheight = 80
        }
		    // console.log(this.$refs.textarea.innerText.length, this.$refs.textarea.innerHTML.includes('br'))

      },
	    messageBodyFn (body) {
	    	if (body) {
	    		return JSON.parse(body)
        }
      },
    	// 消息class
	    kefuCls (item) {
	    	if (item.messageType === 8 || item.messageType === 9 || item.sendUserName === 'adminuser') {
	    		return 'msg-content2'
        }
	    	return ''
      },
    	ifImg (url) {
        if (url.indexOf('http') > -1 && (url.indexOf('png') > -1 || url.indexOf('jpg') > -1 || url.indexOf('gif') > -1)) {
        	return true
        }
        return  false
      },
	    searchFn () {
	    	this.searchShow = false
		    this.listMob = []
        this.pageIndex = 1
        this.problemStatus = ''
        this.roundRewardText = '全部'
		    this.loadingMobile = true
		    this.getData()
      },
	    showSwitch () {
	    	this.searchShow = !this.searchShow
      },
	    gotoDetails (item) {
	    	this.$router.push({
          path: '/users/orderDetail',
          query: {
          	id: item.id
          }
        })
      },
    	// 刷新消息
	    refresh () {
		    this.loadingShow = true
		    this.getMsgList()
      },
    	// 判输赢
	    winFn (index) {
	    	if (!this.tradingData.problemId) return
        let dialogText = ''
		    let userName = this.detailObj.userName ? this.detailObj.userName : ' '
		    let replyName = this.detailObj.replyName ? this.detailObj.replyName : ' '
		    if (index === 1) dialogText = '是否判定（申诉方：'+ userName + '）胜？'
		    if (index === 2) dialogText = '是否判定（被申诉方：'+ replyName + '）胜？'
		    Dialog({
			    content: dialogText,
			    okFn: () => {
				    this.$fetch.post('/user/problem/arbitWinAndReturn', {
					    problemId: this.tradingData.problemId, //	Long	申诉id
					    choose: index, //		Integer	类型 1给申诉打款 2给回复打款
				    }).then(res => {
					    if (res.code === 0) {
						    Dialog({
							    content: res.msg,
                  okFn: () =>{
	                  this.close()
                  }
                })
					    }
				    })
			    }
		    })
      },
      // 查询订单详情
	    checkData2 () {
	    	if (this.isShow === false) {
			    this.loading2 = true
			    setTimeout(() => {
				    this.loading2 = false
				    this.isShow = true
			    }, 1000)
        }
      },
	    nameFn (item) {
		    return item.sendUserName
    		// if (item.messageType === 8) {
    		// 	return item.sendUserName
        // }
	    	// if (this.tradingData.buySystemCode === item.receiveSystemCode) { // 系统和第三方
			  //   return item.sendUserName
        // } else { // 客户
			  //   return item.receiveUserName
        // }

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
	    bigFn (img) {
	    	this.bigImgShow = true
	    	this.bigImg = img
      },
      // 关闭弹窗
      close () {
	    	this.switchValue = false
	      this.msgArr = []
        this.detaildialogShow = false
	      document.body.style.overflow = ''
	      this.tradingData = []
        this.contentimg = []
        this.replyimg = []
	      this.detailObj = {}
	      this.isShow = false
      },
      // 会话列表
      getMsgList () {
	    	if (!this.detailObj.id) {
	    		Dialog({
				    content: '暂无消息',
          })
			    this.loadingShow = false
	    		return
		    }
	      this.$fetch.post(`/user/problem/preCheckMessageList`,{
		      type: 1,
		      id: this.tradingData.problemId
	      }).then(res => {
		      if (res.code === 0) {
			      this.loadingShow = false
			      this.msgArr = res.data.page.list.reverse()
            setTimeout(() => {
	            if (this.$refs.msgUls) {
		            this.$refs.msgUls.scrollTop = this.$refs.msgUls.scrollHeight + 100
	            }
            }, 100)
		      }
	      })
      },
      switchActive () {
        if (this.switchValue === true) {
          this.loadingShow = true
          this.getMsgList()
        } else {
        	this.msgArr = []
        }
      },
      checkData () {
	    	if (!this.detailObj.orderId) return
        this.$fetch.post(`/user/problem/preQueryOrderInfo`,{
	        orderId: this.detailObj.orderId
        }).then(res => {
          if (res.code === 0) {
            if (res.data.resultData) {
              this.tradingData = res.data.resultData
              this.sellBankAccount = JSON.parse(this.tradingData.sellBankAccount)
            }
          }
        })
      },
      langSettings () {
        let item = {
          name: '常用语言设置',
          route: '/users/langSettings',
          showTab: true
        }
        this.$router.push({path:item.route})
        this.$store.commit('SET_NAV_ARR', item)
        for (let i in this.$store.state.delList) {
          if (item.name === this.$store.state.delList[i].name) {
            this.$store.state.delList[i].showTab = true
          }
        }
      },
      itemDetail (item, a, b) {
        this.dataId = item
        this.itemActiveShow = true
	      this.detaildialogShow = true
        document.body.style.overflow = 'hidden'
        this.$fetch.post(`/user/problem/preCheckProblem`, {
	        id: item.id
        }).then(res => {
          if (res.code === 0) {
            this.detailObj = res.data.resultData
            this.replyimg = this.detailObj.replyImgList
            this.contentimg = this.detailObj.contentImgList
            this.checkData()
          } else {
          }
        }).catch(err => {
        	console.log(err)
        })
      },
      // 常用语言
      getLanguage () {
	      this.$fetch.post(`/user/problem/queryLanguageList`,{
		      pageIndex: 1,
		      pageSize: 20
	      }).then(res =>{
		      if (res.code === 0) {
			      this.languageList  = res.data.page.list
		      }
	      })
      },
      // 查看，詳情
      check () {
    		this.itemDetail(this.dataId)
        // this.detaildialogShow = true
        // if (this.detaildialogShow) {
        //   // {{matchType(problemResourceIdEnum,item.contentType)}}
        //   let type = this.matchType(this.problemResourceIdEnum,this.detailObj.contentType)
        //
        //   this.checkData ()
        // }
      },
      quicklySend () {
        this.quicklySendShow = !this.quicklySendShow
      },
      resetFields () {
        this.id = ''
        this.userName = ''
        this.userAddress = ''
        this.refName = ''
        this.refAddress = ''
        this.refStateText = ''
        this.roundRewardText = ''
        this.roundRewardId = ''
        this.refStateId = ''
        this.problemTypeText = ''
      },
      getType () {
        let url = '/public/enumValue?classPackage=trade.Problem$ProblemStatusEnum;trade.Problem$ProblemResourceIdEnum;trade.Problem$ProblemContentTypeEnum&flag=true&state=1'
        this.$fetch.post(`${url}`).then((res) => {
          if (res.code === 0) {
            this.problemContentTypeEnum = res.data.data.ProblemContentTypeEnum //问题来源
            this.problemStatusEnum = res.data.data.ProblemStatusEnum //问题处理状态
            this.problemResourceIdEnum = res.data.data.ProblemResourceIdEnum  // 申诉原因
          }
        })
      },
	    onPullingDown () {
		    if (this.listTotal < 10) {
			    this.$refs.scroll.forceUpdate(true, false)
		    } else {
			    this.getData(this.pageIndex, this.pageSize)
		    }
	    },
      search () {
	    	this.activeIndex = -1
        this.total = 1
        this.getLanguage()
        this.getData(this.pageIndex,10)
      },
      getData (pageIndex,pageSize) {
	      this.noDataShow = false
        this.loadShow = true
	      let resourceId = this.resourceId > -1 ? this.resourceId : ''
	      let contentType = this.contentType > -1 ? this.contentType : ''
	      let problemStatus = this.problemStatus > -2 ? this.problemStatus : ''
        this.loadingShow2 = true
        this.$fetch.post(`/user/problem/queryProblemList`,{
          //id: this.id,
          orderId: this.orderId,
          userName: this.userName,
          replyName: this.replyName,
          resourceId: resourceId,
          contentType: contentType,
          problemStatus: problemStatus,
          pageIndex: this.pageIndex || pageIndex,
          pageSize: pageSize || this.pageSize,
        }).then(res => {
          this.loadShow = false
	        this.loadingShow2 = false
	        this.loadingMobile = false
          if (res.code === 0) {
          	this.listTotal = res.data.page.list.length
            let _list  = res.data.page.list
            if (this.pageIndex === 1 && this.listTotal === 0) {
            	this.noDataShow = true
            }
            if (window.innerWidth < 1200) {
              if (_list) {
                if (this.pageIndex ===1 ) {
                  this.listMob = _list
                } else {
                  this.listMob.push(..._list) // BUG
                }
                this.pageIndex++
              } else {
                if (this.pageIndex === 1) {
                  this.listMob = []
                }
              }
            } else {
              this.list = res.data.page.list
            }
            this.total = res.data.page.totalCount
          }
        })
      },
      commandChange (commend) {
        if (commend.index === 1) {
          this.refStateText = commend.item.text
          this.resourceId = commend.item.id
        } else if (commend.index === 2) {
          this.roundRewardText = commend.item.text
          this.problemStatus = commend.item.id
          if (window.innerWidth < 1200) {
	          this.pageIndex = 1
	          this.loadingMobile = true
	          this.getData(1,10)
          }
        } else if (commend.index === 3) {
          this.problemTypeText = commend.item.text
          this.contentType = commend.item.id
        }
      }
    },
	  computed: {
		  options () {
			  return {
				  pullUpLoad: true
			  }
		  }
	  }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    /deep/ .__vuescroll{
        .__view{
            padding: 0 0 40px !important;
        }
        .__rail-is-vertical{
            right: -1px !important;
        }
    }
    .table-w-a
      >>> .cell
        border none
        white-space nowrap
        overflow hidden !important
      >>> .el-table--border td
        border-right none
      >>> .has-gutter th
        padding: 20px 5px
        background-color: #f3f3f5
        color #000
      >>> .el-table__row td
        padding: 20px 5px
        border-right none
    .search-order2
      .dialog
        position: fixed
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: 1000
        background-color: rgba(0,0,0, .4)
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
        padding: 0 20px 80px
        overflow: auto
        z-index: 1200
        transform translate3d(0,0,0)
        border-radius .6rem .6rem 0 0
        display: flex
        flex-direction column
        &.fade-up-enter-active, &.fade-up-leave-active
          transition: all .3s linear;
        &.fade-up-enter, &.fade-up-leave-to
          transform translate3d(0,100%,0)
        &.fade-up-enter-to, &.fade-up-leave
          transform translate3d(0,0,0)
      .search-main
        width 100%
        display block
        border-radius 6px
        background-color #fff
        .search-input
          width 100%
          height 50px
          line-height 50px
          color #000
          text-align center
          border-bottom: 1px solid #e7effc
          &:last-child
            border-bottom: none
          input
            display block
            width 100%
            height 100%
            padding 0 10px
            text-align: center
            color #000
            &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
              color: #000;
            }
            &::-moz-placeholder { /* Firefox 19+ */
              color: #000;
            }
            &:-ms-input-placeholder { /* IE 10+ */
              color: #000;
            }
            &:-moz-placeholder { /* Firefox 18- */
              color: #000;
            }
    .btn-ok
      height: 50px
      margin-top: 10px
      display: flex
      align-items center
      justify-content center
      color #999
      font-size: 16px
      border-radius 6px
      background-color: #fff
    .web-loading1{
      width: 100px
      img{
        width: 100px
        max-height: 100px
        max-width: 100px
      }
    }
    .table-w-a{
      >>> tr td:nth-child(1) .cell, >>> tr th:nth-child(1) .cell {
        padding: 0
      }
      >>> .el-table__row{
        cursor pointer
      }
    }
    .no-s{
        color #ff0000
        text-align: left
    }
    .con{
      .img-list{
        display: flex
        align-items center
      }
      img{
        cursor pointer
        max-height: 100px;
        max-width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
      }
    }
    .top-a
      position: fixed
      top: 0
      right: 50px
      width: 30px
      height: 60px
      z-index: 2000
    .flexStart
        display flex
        align-items center
        justify-content flex-start
    .img-big-dialog
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: 10000
      background-color: rgba(0,0,0,.5)
      .img-box
        position: absolute
        left: 50%
        top: 50%
        transform translate(-50%,-50%)
        width: 100%
        text-align: center
        img
          max-width 80%
    .wrap
        &.pc-wrap
          display: block
          @media screen and (max-width:1200px){
            display: none
          }
        .main-content
            width 100%;
            background-color #fff;
            padding 0 40px 0 24px;
            min-height calc(100vh - 147px);
            .web-table
                padding-top 0
                .item-list
                    width 100%
                    height 64px
                    line-height 64px
                    display flex
                    align-items center
                    justify-content flex-start
                    transition all .2s linear
                    &.active
                        border:1px dashed red;
                        background-color #e7effc
                    &:nth-child(n+2)
                        display block
                        height auto
                        line-height normal
                        width 100%
                        .flex-item
                            width 100%
                            height 64px
                            line-height 64px
                            display flex
                            align-items center
                            justify-content flex-start
                            cursor pointer
                            .blue
                              color #1962df
                    /*&:nth-child(odd)
                        background-color #F8F8FA*/
                    .li
                        flex 1
                        line-height 15px
                        width auto
                        text-align center
                    &:first-child
                        background-color #f3f3f5;
                    .unfold
                        color #2176ff
                        cursor pointer
                        display flex
                        align-items center
                        justify-content center
                        .icon
                            display inline-block
                            width 10px
                            height 6px
                            background url("~@img/unfold.png") no-repeat center
                            background-size cover
                            margin-left 6px
                            transition all .2s linear
                            &.active
                                transform rotate(180deg)
                    .item-table
                        width 100%
                        position relative
                        .on-the-details
                            position absolute
                            width 100%
                            height 80px
                            left 0
                            right 0
                            bottom -80px
                .table-list
                    height auto
            .search
                position relative
                display flex
                flex-direction row
                flex-wrap wrap
                justify-content flex-start
                border-bottom 0
                .search-box
                    width 318px
                    height 34px
                    line-height 34px
                    margin: 4px 0 15px;
                    display flex
                    align-items center
                    &:nth-child(7)
                        .label
                            width 100px
                        .input-wrap
                            flex 1
                    .label
                        padding-right 16px
                        font-size 14px
                    .input-wrap
                        flex 1
                        height 34px
                        margin-right 40px
                        input
                            width 100%
                            height 100%
                            margin-right 0
                            border-radius 0
                    .dropdown-wrap
                        cursor pointer
                        text-align center
                        background-color #fff
                        border: 1px solid #efefef;
                        border-radius: 0;
                        padding: 0 10px;
                        font-size 14px
                        min-width: 130px !important;
                        width: 200px !important;
                        height: 34px !important;
                        line-height: 34px !important;
                        .el-dropdown
                            width 100%
                            height 100%
                            span
                                width 100%
                                display flex
                                align-items center
                                justify-content space-between
                .btns
                    justify-content flex-start
                    .btn
                        cursor pointer
                    .lang-btn
                        width 120px

    .dialog
        position fixed
        top 0
        left 0
        right: 0
        bottom 0
        z-index 500
        background-color rgba(0,0,0,.4)
        display flex
        align-items center
        justify-content center
        .content-box
            width: 1200px
            height: 90%
            background-color #fff
            border-radius 6px
            .content-info
                width 100%
                height 100%
                padding 40px 30px
                display flex
                justify-content space-between
                overflow auto
                position: relative
                .complaintOrder
                    flex 1
                    overflow auto
                    position: relative
                    padding-right: 30px
                    height 100%
                    ul
                        font-size 14px
                        color #000
                        .li
                            font-size 14px
                            line-height 14px
                            display flex
                            align-items center
                            justify-content flex-start
                            margin-bottom 10px
                            .tit
                              font-weight: bold
                              line-height: 1.5
                              white-space nowrap
                            .con
                                width auto
                                line-height: 1.5
                                pre
                                  user-select auto
                                  font-family: "Helvetica Neue", Helvetica, "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
                                  white-space: pre-line;
                            .complaint-btn
                                width 100px
                                height 34px
                                line-height 34px
                                background-color #2176ff
                                text-align center
                                color #fff
                                cursor pointer
                                border-radius 4px
                                &.is-blue
                                  pointer-events none
                                  cursor not-allowed
                                  background-color: #eee
                                  color #000000
                                &.win-t
                                  pointer-events none
                                  color #fff
                                  background-color: #2176ff
                        .order
                            font-size 16px
                            font-weight 600
                            line-height: 1.5
                            padding-bottom 20px
                        .complaint
                            height 34px
                            line-height 34px
                            display flex
                            align-items center
                            justify-content space-between
                        .ppeal-reason
                            display flex
                            align-items center
                            justify-content flex-start
                            .con
                                flex 1
                        .describe
                            display flex
                            align-items flex-start
                            justify-content flex-start
                        .img
                            display flex
                            align-items flex-start
                            justify-content flex-start
                            .con
                                display flex
                                align-items center
                                justify-content flex-start
                                width 550px
                                .li-img
                                    width 88px
                                    height 88px
                                    margin-right 28px
                                    overflow hidden
                                    display: flex
                                    align-items center
                                    justify-content center
                                    overflow-x auto
                                    >>> .el-image
                                      .el-icon-circle-close
                                        color #1962df
                                      .el-image-viewer__canvas
                                        cursor move
                                    .bg-img
                                      cursor pointer
                                      width: 100%
                                      height: 100%
                                      background-repeat: no-repeat
                                      background-position: center
                                      background-size: cover
                        .hr
                            width 100%
                            height 1px
                            background-color #DCDFE6
                            position relative
                            margin 30px auto
                            &:after
                                content ''
                                display block
                                width 20px
                                height 3px
                                background-color #2176ff
                                position absolute
                                top -1px
                                left 0
                        .by-the-complainant
                            justify-content space-between
                            .con
                                .complainant-btn
                                    width 100px
                        .order-information
                            align-items flex-start
                            .no-data
                              text-align: center
                              color #ccc
                              margin-top: 30px
                            .information
                                flex 1
                                .loading-t
                                  text-align: center
                                  margin: 20px auto
                                  img
                                    width: 100px
                                .info-li
                                    line-height 34px
                        .ancel-the-complaint
                            width 100%
                            height: 34px
                            line-height 34px
                            background-color #2176ff
                            text-align center
                            justify-content center
                            color #fff
                            cursor pointer
                            border-radius 4px
                .chat
                    width 440px
                    height 100%
                    flex-direction column
                    display: flex
                    .show-btn
                        display flex
                        align-items center
                        justify-content space-between
                        margin-bottom 30px
                        .tit
                            font-size 16px
                            line-height 34px
                            vertical-align middle
                            font-weight 600
                        .close
                            display inline-block
                            width 24px
                            height 24px
                            cursor pointer
                    .chat-box
                        width 100%
                        flex 1
                        overflow hidden
                        border-radius 10px
                        box-shadow 0 0 6px 2px rgba(0, 0, 0, .06)  //外部阴影
                        position relative
                        .infn
                          height: 100%
                          display: flex
                          flex-direction column
                        .chat-top
                          display: flex
                          align-items center
                          justify-content space-between
                          padding: 20px 20px 10px 20px
                          .text-a
                            font-size: 16px
                            font-weight: bold
                          img
                            cursor pointer
                        .message-box
                          padding: 0 20px 10px 20px
                          flex 1
                          overflow auto
                          &::-webkit-scrollbar-track{
                            background-color: #fff;
                          }
                          &::-webkit-scrollbar-thumb{
                            border-radius: 10px;
                            background-color: #c1c1c1;
                          }
                          .msg-uls
                            border-top: 1px solid #efefef
                            padding-top: 30px
                            .msg-list
                              display: flex
                              align-items flex-end
                              flex-direction column
                              margin-bottom: 60px
                              &.is-receive
                                align-items flex-start
                                .msg-name
                                  text-align: right
                                .msg-content
                                  background-color: #f5f5f5
                              .time-t
                                width: 100%
                                text-align: center
                                font-size: 14px
                                margin-bottom: 5px
                                color #999
                              .img-box-a
                                width: 80%
                                margin: 10px 0 30px;
                                img
                                  cursor pointer
                                  max-width: 100%
                              .msg-name
                                font-size: 14px
                              .msg-content
                                margin: 10px 0 0
                                line-height: 1.5
                                border-radius 10px
                                background-color: #e7effc
                                display inline-block
                                padding: 16px
                              .title-bank
                                font-weight: bold
                                margin-bottom: 5px
                              p
                                line-height: 1.5
                              .msg-content2
                                color #aaa
                                font-size: 12px
                                line-height: 1.5
                                background-color: #f5f5f5
                                padding: 5px 10px
                                text-align: center
                                margin: 0 auto
                        .loading
                           position absolute
                           top 50%
                           left 50%
                           transform translate(-50%, -50%)
                           width 60px
                           height 60px
                           z-index 4
                        .send-box

                            width 100%
                            height 80px
                            // line-height 80px
                            padding 20px
                            display flex
                            /*align-items center*/
                            justify-content space-between
                            bottom 0
                            left 0
                            z-index 4
                            .quickly-send
                                width 26px
                                height 26px
                                margin-top: 7px
                                background url("~@img/PC/send-icon.svg") no-repeat center
                                background-size contain
                                cursor pointer
                                position relative
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
                                    max-height: 300px
                                    background-color: #fff
                                    left -10px
                                    top -330px
                                    overflow auto
                                    border-radius 4px
                                    z-index 6
                                    box-shadow 0 0 9px 5px rgba(0, 0, 0, .2)  //外部阴影
                                    ul
                                        width 100%
                                        height 100%
                                        position relative
                                        padding-bottom: 10px
                                        .item
                                            font-size 14px
                                            color #000
                                            padding 0 10px
                                            margin-bottom: 5px
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
                                width: 100%
                                height 42px
                                border 1px solid #DCDFE6
                                border-radius 4px
                                padding 10px 20px
                                font-size: 16px
                                resize none
                                outline none
                                box-sizing border-box
                                line-height 20px
                            .textarea-w
                              flex 1
                              margin 0 16px
                              .texta-hidden
                                opacity: 0
                                min-height 42px
                                border 1px solid #DCDFE6
                                border-radius 4px
                                line-height 20px
                                width: 100%
                                font-size: 16px
                                padding 10px 20px
                            .send-btn
                                height 100%
                                line-height 40px
                                cursor pointer
                                transition all .3s linear
                                &:hover
                                    color #2176ff
    .mob-wrap
      width 100%
      height calc(100vh - 80px)
      padding 0 20px
      display: none
      @media screen and (max-width:1200px){
        display: block
      }
      .search-box
        width 100%
        height 34px
        line-height 34px
        margin: 20px auto;
        display flex
        align-items center
        .label
          margin-right: 20px
          font-size 14px
        .input-wrap
          flex 1
          height 34px
          input
            width 100%
            height 100%
            margin-right 0
            border-radius 0
        .dropdown-wrap
          cursor pointer
          text-align center
          background-color #fff
          border: 1px solid #efefef;
          border-radius: 0;
          font-size 14px
          .el-dropdown-link
            height 34px
            line-height 34px
            padding 0 10px
          .el-dropdown
            width 100%
            height 100%
            position absolute
            top 0
            left 0
            .el-dropdown-link
              height 34px
              line-height 34px
              padding 0 10px
              color #b3b3b3
            span
              width 100%
              display flex
              align-items center
              justify-content space-between
      .scroll-list-wrap
        width 100%
        padding-bottom: 70px
        >>> .cube-scroll-content
          transform scale(1),translateZ(0) !important
        .no-data
          display: flex
          align-items center
          justify-content center
          flex-direction column
          color #b3b3b3
          padding-top: 50px
          img
            width: 80px
            display: block
            margin-bottom: 10px
        .web-loading1
          img
            width: 100px;
            max-height: 100px;
            max-width: 100px;
        .item-li
          padding 10px 0
          border-bottom 1px solid #efefef
          .li
            font-size 14px
            line-height 14px
            padding-bottom 7px
            &:nth-child(1)
              display flex
              align-items center
              justify-content space-between
              .state
                &.active
                  color #ff0000
            &:nth-child(3)
              color #ff0000
            &:last-child
              display flex
              align-items center
              justify-content space-between
              padding-bottom 0

    .scroll-list-wrap
      position: absolute;
      left: 0;
      right 0
      width: 100%;
      height: calc(100vh - 130px);
      overflow: hidden;
      padding 0 20px
      background: #fff;
    /*.iosx & {
        padding-top: 88px;
    }
    .ios &{
        padding-top: 64px;
    }*/
    .search-order
      width 100%
      height 100vh
      position fixed
      top 0
      left 0
      right 0
      z-index 100
      background-color rgb(0,0,0)
      .search-main
        width 100%
        position absolute
        top 80px
        left 0
        right 0
        padding 0 20px
        display block
        .search-input
          width 100%
          height 40px
          line-height 40px
          background-color #fff
          margin-bottom 20px
          border-radius 6px
          text-align center
          input
            display block
            width 100%
            height 100%
            padding 0 10px
            text-align: center
            color #000
            &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
              color: #ccc;
            }
            &::-moz-placeholder { /* Firefox 19+ */
              color: #ccc;
            }
            &:-ms-input-placeholder { /* IE 10+ */
              color: #ccc;
            }
            &:-moz-placeholder { /* Firefox 18- */
              color: #000;
            }
      .btn-ok
        position: absolute
        bottom:150px
        left: 20px
        right: 20px
        height: 50px
        display: flex
        align-items center
        justify-content center
        color #fff
        font-size: 16px
        border-radius 6px
        background-color: #1962df
</style>

