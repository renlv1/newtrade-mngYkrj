<template>
  <div class="orderDetail-w">
    <div class="content-a">
      <div class="flex-item bold-item">
        <span class="">申诉订单：</span>
        <span>{{detailObj.orderId}}（{{matchType(problemResourceIdEnum,detailObj.resourceId)}}）</span>
      </div>
      <!--      申诉方-->
      <div>
        <div class="flex-item">
          <span class="bold">申诉方：</span>
          <span>{{detailObj.userName}}（{{detailObj.businessType === 1 ? "市商": "用户"}}）</span>
        </div>
        <div class="flex-item">
          <span class="bold">申诉原因：</span>
          <span>{{matchType(problemContentTypeEnum,detailObj.contentType)}}</span>
        </div>
        <div class="flex-item">
          <span class="bold">详细描述：</span>
          <span v-if="ifImg(detailObj.content)">
            <viewer :images="[detailObj.content]" class="img-list">
              <img   :src="detailObj.content" >
            </viewer>
          </span>
          <span v-else>{{detailObj.content}}</span>
        </div>
        <div class="flex-item">
          <span class="bold">图片附件：</span>
          <div class="con" v-if="contentimg && contentimg.length > 0">
            <viewer :images="contentimg" class="img-list">
              <img v-for="src in contentimg" :src="src" :key="src">
            </viewer>
<!--            <div class="li-img" v-for="(imgUrl,index) in contentimg" :key="index">-->
<!--              <div class="bg-img" :style="{backgroundImage: 'url( '+ imgUrl +')'}" @click="bigFn(imgUrl)"></div>-->
<!--            </div>-->
          </div>
          <div class="con" v-else>-</div>
        </div>
      </div>
      <!--      被申诉方-->
      <div class="border-a">
        <div class="flex-item ">
          <span class="bold">被申诉方：</span>
          <div>{{isEmptyText(detailObj.replyName)}} ({{detailObj.businessType === 2 ? "市商": "用户"}})</div>
        </div>
        <div class="flex-item">
          <span class="bold">详细描述：</span>
          <span v-if="ifImg(detailObj.replycontent)">
            <viewer :images="[detailObj.replycontent]" class="img-list">
              <img :src="detailObj.replycontent">
            </viewer>
          </span>
          <span v-else>{{isEmptyText(detailObj.replycontent)}}</span>
        </div>
        <div class="flex-item">
          <span class="bold">图片附件：</span>
          <div class="con" v-if="replyimg && replyimg.length > 0">
            <viewer :images="replyimg" class="img-list">
              <img v-for="src in replyimg" :src="src" :key="src">
            </viewer>
<!--            <div class="li-img" v-for="(imgUrl,index) in replyimg" :key="index">-->
<!--              <div class="bg-img" :style="{backgroundImage: 'url( '+ imgUrl +')'}" v-if="imgUrl && imgUrl !== '-'" @click="bigFn(imgUrl)"></div>-->
<!--            </div>-->
          </div>
          <div class="con" v-else>-</div>
        </div>
      </div>
      <div class="flex-item between-item">
        <span class="bold">订单信息：{{detailObj.orderId}}</span>
        <div class="btn-search" @click="searchFn">查询</div>
      </div>
      <!--      订单信息-->
      <div class="web-loading2" v-show="loadShow">
        <img src="~@img/loading2.gif" />
      </div>
      <div v-show="loadShow2">
        <div class="flex-item">
          <span class="bold">实际收款金额：</span>
          <div class="">{{tradingData.transferAmount}} {{tradingData.currency}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">单价：</span>
          <div class="">{{tradingData.rate}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">数量：</span>
          <div class="">{{tradingData.total}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">订单状态：</span>
          <div class="">{{statusFn(tradingData.problemStatus)}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">放款ID：</span>
          <div class="">{{tradingData.transactionId}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">下单时间：</span>
          <div class="">{{tradingData.createTime}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">用户信息：</span>
          <div class="">{{tradingData.giveBankName}} / {{tradingData.giveRealName}} / {{tradingData.giveAccount}}</div>
        </div>
        <div class="flex-item">
          <span class="bold">市商信息：</span>
          <div class="">{{sellBankAccount.bankName}} / {{sellBankAccount.realName}} / {{sellBankAccount.bankNumber}}</div>
        </div>
      </div>
    </div>
    <div class="btn-w" :class="iphoneHeight" v-show="detailObj.problemStatus > -2">
      <div class="btn" @click="chatFn" :class="{'a-btn': detailObj.problemStatus !== 0 && detailObj.problemStatus !== 1}">会话</div>
      <div class="btn" @click="winFn(1)"
           :class="{'is-blue': detailObj.problemStatus !== 0, 'win-t':detailObj.backup2 && detailObj.backup2 === detailObj.userSystemCode}"
           v-show="((detailObj.backup2 === detailObj.userSystemCode) || !detailObj.backup2) && detailObj.problemStatus !== -1"
            >申诉方胜</div>
      <div class="btn" @click="winFn(2)"
           :class="{'is-blue': detailObj.problemStatus !== 0,'win-t': detailObj.backup2 && detailObj.backup2 === detailObj.replySystemCode}"
           v-show="((detailObj.backup2 && detailObj.backup2 === detailObj.replySystemCode) || !detailObj.backup2) && detailObj.problemStatus !== -1"
            >被申诉方胜</div>
    </div>
    <v-chat
            :languageList="languageList"
            :merchantShow="merchantShow"
            @hideDialog="hideDialog"
            :tradingData="tradingData"></v-chat>
  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				merchantShow: false,
				problemContentTypeEnum: [],
				problemStatusEnum: [],
				problemResourceIdEnum: [],
				detailObj: {},
				replyimg: [],
				contentimg: [],
				tradingData: {},
				sellBankAccount: {},
				iphoneHeight: '',
				languageList: [],
				loadShow: false,
				loadShow2: false,
      }
		},
    created () {
			this.getType()
			this.getDetails()
    },
    mounted() {
	    if (/iphone/gi.test(navigator.userAgent)) {
		    if (screen.height >= 812) {
		    	this.iphoneHeight = 'iosx'
		    } else {
			    this.iphoneHeight = 'ios'
		    }
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
	    ifImg (url) {
		    if (url && url.indexOf('http') > -1 && (url.indexOf('png') > -1 || url.indexOf('jpg') > -1 || url.indexOf('gif') > -1)) {
			    return true
		    }
		    return  false
	    },
	    searchFn () {
	    	if (this.loadShow2 === false){
			    this.loadShow = true
			    setTimeout(() => {
				    this.loadShow = false
				    this.loadShow2 = true
			    }, 1000)
        }
      },
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
								    this.$fetch.post(`/user/problem/preCheckProblem`, {
									    id: this.$route.query.id
								    }).then(res => {
									    if (res.code === 0) {
										    this.detailObj = res.data.resultData
									    }
								    })
							    }
						    })
					    }
				    })
			    }
		    })
	    },
	    hideDialog () {
	    	this.merchantShow = false
      },
	    chatFn () {
		    this.getLanguage()
	    	this.merchantShow = true
      },
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
			getDetails () {
				this.$fetch.post(`/user/problem/preCheckProblem`, {
					id: this.$route.query.id
				}).then(res => {
					if (res.code === 0) {
						this.detailObj = res.data.resultData
						this.replyimg = this.detailObj.replyImgList
						this.contentimg = this.detailObj.contentImgList
						this.checkData()
					}
				}).catch(err => {
					console.log(err)
				})
      }
    },
		components: {
			vChat: require('./chat').default,
    }
	}
</script>

<style scoped lang="less">
.orderDetail-w{
  .web-loading2{
    text-align: center;
    img{
      width: 60px;
    }
  }
  .content-a{
    padding: 20px 20px 150px 20px;
    .flex-item{
      display: flex;
      margin-bottom: 14px;
      font-size: 16px;
      line-height: 2;
      .bold{
        font-size: 14px;
        font-weight: bold;
        white-space: nowrap;
      }
    }
    .border-a{
      border-top: 1px solid #efefef;
      padding-top: 10px;
    }
    .bold-item{
      margin-bottom: 20px;
      span{
        font-size: 16px;
        font-weight: bold;
      }
    }
    .con{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      flex: 1;
      .img-list{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        img{
          max-width: 70px;
          max-height: 70px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .li-img{
        width: 70px;
        height: 70px;
        margin-right: 10px;
        margin-bottom: 10px;
        .bg-img{
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }

    .between-item{
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid #efefef;
      .btn-search{
        width: 80px;
        height: 30px;
        font-size: 12px;
        color: #fff;
        border-radius: 4px;
        background-color: #1962df;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .btn-w{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    &.iosx {
      height: 80px;
    }
    .btn{
      color: #fff;
      font-size: 16px;
      height: 100%;
      line-height: 60px;
      text-align: center;
      &.is-blue{
        pointer-events: none;
        cursor: not-allowed;
        background-color: #eee;
        color: #000000;
      }
      &.win-t{
        pointer-events: none;
        color: #fff;
        flex: 1 !important;
        background-color: #2176ff;
      }
      &:nth-child(1){
        flex: .2;
        background-color: #8f8f8f;
      }
      &.a-btn{
        flex: 1;
        background-color: #1962df;
      }
      &:nth-child(2){
        flex: .4;
        background-color: #1962df;
      }
      &:nth-child(3){
        flex: .4;
        background-color: #000414;
      }
    }
  }
}
</style>
