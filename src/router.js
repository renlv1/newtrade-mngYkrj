import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/*eslint-disable*/
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error)
}

const router = new VueRouter({
	linkActiveClass: 'active',
	routes: [
		{
			path: '*',
			redirect: '/login'
		},
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/blank',
			component: require('./views/common/blank').default
		},
		{
			// 登录
			path: '/login',
			component: require('./views/common/login').default
		},
		/*
		// 产品管理
		{
			path: '/product',
			redirect: '/product/robot',
			component: require('./views/product/index.vue').default,
			children: [
				{
					path: '/product/robot', // 机器人设置
					component: require('./views/product/robot').default
				},
				{
					path: '/product/robot/productInformation', // 机器人设置/产品信息
					component: require('./views/product/productInformation').default
				},
				{
					path: '/product/order', // 查询订单
					component: require('./views/product/order').default
				},
				{
					path: '/product/product', // 查询产品
					component: require('./views/product/product').default
				},
				{
					path: '/product/product/addProduct', // 新增产品
					component: require('./views/product/addProduct').default
				},
				{
					path: '/product/product/productDetails', // 产品详情
					component: require('./views/product/productDetails').default
				},
				{
					path: '/product/trainer', // 训练师记录
					component: require('./views/product/trainer').default
				},
				{
					path: '/product/drill', // 训练记录
					component: require('./views/product/drill').default
				},
			]
		},
		// PK管理
		{
			path: '/pk',
			redirect: '/pk/fdinfo',
			component: require('./views/pk/index.vue').default,
			children: [
				{
					path: '/pk/fdinfo',  // 基金信息
					component: require('./views/pk/fdinfo').default
				},
				{
					path: '/pk/redemptionFund',  // 基金赎回
					component: require('./views/pk/redemptionFund').default
				}
			]
		},
		// 克莱因管理
		{
			path: '/klein',
			redirect: '/klein/entrustTheCurrency',
			component: require('./views/klein/index.vue').default,
			children: [
				{
					path: '/klein/entrustTheCurrency', // 新币种委托
					component: require('./views/klein/entrustTheCurrency').default,
				},
				{
					path: '/klein/currencyTrading', // 新币种成交记录
					component: require('./views/klein/currencyTrading').default,
				},
				{
					path: '/klein/quotation', // 新币种行情
					component: require('./views/klein/quotation').default //
				},
				{
					path: '/klein/exchangeCommission', // 交易所委托
					component: require('./views/klein/exchangeCommission').default
				},
				{
					path: '/klein/rewards', // 克莱因瓶奖励参与
					component: require('./views/klein/rewards').default
				},
				{
					path: '/klein/kleinreWardsRecord', // 克莱因瓶奖励记录
					component: require('./views/klein/kleinreWardsRecord').default
				},
				{
					path: '/klein/activity', // 克莱因瓶活动
					component: require('./views/klein/activity').default
				},
				{
					path: '/klein/award', // 克莱因奖励列队
					component: require('./views/klein/award').default
				},
				{  // 乐透
					path: '/klein/task', // 乐透分红奖励任务
					component: require('./views/klein/task').default
				},
				{
					path: '/klein/rewardLog', // 乐透分红奖励日志
					component: require('./views/klein/rewardLog').default
				},
				{
					path: '/klein/bonus', // 乐透额外分红记录
					component: require('./views/klein/bonus').default
				},
				{
					path: '/klein/resultsThelog', //  乐透业绩累积日志
					component: require('./views/klein/resultsThelog').default
				},
				{
					path: '/klein/wingPerformance', // 乐透派别业绩累计
					component: require('./views/klein/wingPerformance').default
				},
				{
					path: '/klein/theCompetingQuery', // 乐透业参赛查询
					component: require('./views/klein/theCompetingQuery').default
				},
				{
					path: '/klein/rewardsRecord', // 乐透业奖励记录
					component: require('./views/klein/rewardsRecord').default
				},
				{
					path: '/klein/lotteryActivity', // 乐透活动记录
					component: require('./views/klein/lotteryActivity').default
				},
				{
					path: '/klein/transactionRecords', // 交易所成交记录
					component: require('./views/klein/transactionRecords').default
				},
				{
					path: '/klein/weChatAuthor', // 微信授权重要信息
					component: require('./views/klein/weChatAuthor').default
				},
				{
					path: '/klein/wechatFriends', // 微信好友信息
					component: require('./views/klein/wechatFriends').default
				},
				{
					path: '/klein/weChatInformation', // 微信信息查询
					component: require('./views/klein/weChatInformation').default
				},
			]
		},
		{
			// 系统管理
			path: '/system',
			redirect: '/system/accountInteraction',
			component: require('./views/system/index.vue').default,
			children: [
				{
					path: '/system/accountInteraction', // 与APP账号交互日志
					component: require('./views/system/accountInteraction').default
				},
				{
					path: '/system/pkPush', // PK推送信息
					component: require('./views/system/pkPush').default
				},
				{
					path: '/system/errorLog', // 错误日志
					component: require('./views/system/errorLog').default
				},
        {
          path: '/system/sendChatMessage', // app发送信息
          component: require('./views/system/sendChatMessage').default
        },
				{
					path: '/system/notice', // 公告
					component: require('./views/system/notice').default,
				},
				{
					path: '/system/notice/noticeDetails', // 公告详情
					component: require('./views/system/noticeDetails').default,
				},
				{
					path: '/system/notice/noticeAdd',// 新增公告
					component: require('./views/system/noticeAdd.vue').default
				},
				{
					path: '/system/verNote', // 版本更新记录
					component: require('./views/system/verNote').default
				},
				{
					path: '/system/verNote/verNoyeDetails',//版本更新记录详情
					component: require('./views/system/verNoyeDetails.vue').default
				},
				{
					path: '/system/verNote/addNewVersion', // 新增版本
					component: require('./views/system/addNewVersion').default
				},
			]
		},
		{
			// 用户管理
			path: '/user',
			component: require('./views/user/index').default,
			children: [
				{
					path: '/user/clientManagement', // 客户端管理
					component: require('./views/user/clientManagement').default
				},
				{
					path: '/user/emailCode', // 邮箱验证码
					component: require('./views/user/emailCode').default
				},
				{
					path: '/user/helpCenter', // 帮助中心
					component: require('./views/user/helpCenter').default
				},
				{
					path: '/user/helpCenter/helpDetail', // 帮助详情
					component: require('./views/user/help/helpDetail').default
				},
				{
					path: '/user/helpCenter/addHelp', // 新增帮助
					component: require('./views/user/help/addHelp').default
				},
				{
					path: '/user/backTransferLog', // 后台转账日志
					component: require('./views/user/backTransfer/backTransferLog').default
				},
				{
					path: '/user/backTransferLog/transferLogDetail',// 日志详情
					component: require('./views/user/backTransfer/transferLogDetail').default
				},
				{
					path: '/user/userFeedProblem',// 用户反馈问题
					component: require('./views/user/userFeedback/userFeedProblem').default
				},
				{
					path: '/user/userFeedProblem/feedProblemDetail',// 反馈问题详情
					component: require('./views/user/userFeedback/feedProblemDetail').default
				},
				{
					path: '/user/userFeedProblem/answerQuestion',// 回复问题
					component: require('./views/user/userFeedback/answerQuestion').default
				},
				{
					path: '/user/replyAnswer', // 问题回复
					component: require('./views/user/replyAnswer').default
				},
				{
					path: '/user/checkSafeProblem', // 查询安全问题
					component: require('./views/user/checkSafeProblem').default
				},
				{
					path: '/user/redisKey', // redis
					component: require('./views/user/redis/redisKey').default
				},
				{
					path: '/user/redisKey/redisDetail', // redis详情
					component: require('./views/user/redis/redisDetail').default
				},
				{
					path: '/user/tradeRecord/insideTransfer', // 内部转账
					component: require('./views/user/tradeRecord/insideTransfer').default
				},
				{
					path: '/user/userAccountCheck', // 用户账户查询
					component: require('./views/user/userAccountCheck').default
				},
				{
					path: '/user/userAccountCopy', // 用户账户复制
					component: require('./views/user/userAccountCopy').default
				},
				{
					path: '/trade/unlockBill', // 用户解锁记录
					component: require('./views/user/userUnlockRecord').default
				},
				{
					path: '/user/userCheck', // 用户查询
					component: require('./views/user/userCheck/userCheck').default
				},
				{
					path: '/user/userCheck/userCheckDetail', // 用户查询详情
					component: require('./views/user/userCheck/userCheckDetail').default
				},
				{
					path: '/user/userCheck/checkUserAsset', // 查看用户资产
					component: require('./views/user/userCheck/checkUserAsset').default
				},
				{
					path: '/user/userCheck/addUser', // 新增用户
					component: require('./views/user/userCheck/addUser').default
				},
				{
					path: '/user/userDiscount', // 用户折扣
					component: require('./views/user/userDiscount').default
				},
				{
					path: '/user/userOnLine', // 用户是否在线
					component: require('./views/user/userOnLine').default
				},
				{
					path: '/user/verifyCode', // 验证码查询
					component: require('./views/user/verifyCode').default
				},
				{
					path: '/user/mergerList',
					component: require('./views/user/mergerList').default
				},
				{
					path: '/user/commissionList',
					component: require('./views/user/commissionList').default
				},
				{
					path: '/user/optimizList',
					component: require('./views/user/optimizList').default
				},
			]
		},
		{
			// 交易管理
			path: '/trade',
			redirect: '/trade/queryTransactionListPre',
			component: require('./views/trade/index').default,
			children: [
				{
					// 银行卡信息 1
					path: '/trade/bankInfo',
					component: require('./views/trade/bankInfo/bankInfo').default,
				},
				{
					// 银行卡信息 1 --- 银行卡详情
					path: '/trade/bankInfo/bankInfoDetails',
					component: require('./views/trade/bankInfo/bankInfoDetails').default,
				},
				{
					// 老板信息 2
					path: '/trade/bossInfo',
					component: require('./views/trade/bossInfo/bossInfo').default,
				},
				{
					// 老板信息 2 --- 老板详情
					path: '/trade/bossInfo/bossInfoDetails',
					component: require('./views/trade/bossInfo/bossInfoDetails').default,
				},
				{
					// 老板信息 2 --- 新增老板
					path: '/trade/bossInfo/addBoss',
					component: require('./views/trade/bossInfo/addBoss').default,
				},
				{
					// 老板币种支持 3
					path: '/trade/bossSupport',
					component: require('./views/trade/bossSupport/bossSupport').default,
				},
				{
					// 老板币种支持 3 --- 老板币种支持详情
					path: '/trade/bossSupport/bossSupportDetails',
					component: require('./views/trade/bossSupport/bossSupportDetails').default,
				},
				{
					// '充值订单', // 4
					path: '/trade/deposit',
					component: require('./views/trade/deposit/deposit').default,
				},
				{
					// '充值订单', // 充值订单详情
					path: '/trade/deposit/depositDetail',
					component: require('./views/trade/deposit/depositDetail').default,
				},
				{
					// '提现订单', // 5
					path: '/trade/draw',
					component: require('./views/trade/draw/draw').default,
				},
				{
					// '提现订单', // 5
					path: '/trade/draw/drawDetail',
					component: require('./views/trade/draw/drawDetail').default,
				},
				{
					// '审核', // 5
					path: '/trade/draw/audit',
					component: require('./views/trade/draw/audit').default,
				},
				{
					// '服务共享者', // 6
					path: '/trade/upServerBoss',
					component: require('./views/trade/upServerBoss').default,
				},
				{
					// '服务共享者详情', // 6
					path: '/trade/upServerBoss/upServerBossDetail',
					component: require('./views/trade/upServerBoss/upServerBossDetail').default,
				},
				{
					//  持有量统计', // 7
					path: '/trade/balanceTotal',
					component: require('./views/trade/balanceTotal').default,
				},
				{
					// '持有量统计记录', // 8
					path: '/trade/balanceTotalLog',
					component: require('./views/trade/balanceTotalLog').default,
				},
				{
					// '社区业绩累计', // 9
					path: '/trade/groupTotal',
					component: require('./views/trade/groupTotal').default,
				},
				{
					// '社区业绩累计统计', // 10
					path: '/trade/groupTotalLog',
					component: require('./views/trade/groupTotalLog').default,
				},
				{
					// '交易统计', // 11
					path: '/trade/statistics',
					component: require('./views/trade/statistics').default,
				},
				{
					// '秘密转账记录', // 12
					path: '/trade/transfer',
					component: require('./views/trade/transfer').default,
				},
				{
					// '转账记录', // 13
					path: '/trade/transferRecord',
					component: require('./views/trade/transferRecord').default,
				},
				{
					// '转账记录详情', // 13
					path: '/trade/transferRecord/transferRecordDetail',
					component: require('./views/trade/transferRecord/transferRecordDetail').default,
				},
				{
					// '转账记录审核', // 13
					path: '/trade/transferRecord/transferAudit',
					component: require('./views/trade/transferRecord/transferAudit').default,
				},
				{
					// '转入审核', // 13
					path: '/trade/transferRecord/intoAudit',
					component: require('./views/trade/transferRecord/intoAudit').default,
				},
        {
          // '查看总账', // 13
          path: '/trade/transferRecord/generalLedger',
          component: require('./views/trade/transferRecord/generalLedger').default,
        },
				{
					//  '流水信息查询', // 14
					path: '/trade/userAccountLog',
					component: require('./views/trade/userAccountLog').default,
				},
				{
					//  '账单解锁记录', // 15
					path: '/trade/unlockBill',
					component: require('./views/trade/userAccountLog').default,
				},
			]
		},
		{
			// APP管理
			path: '/appManagement',
			redirect: '/appManagement/appManagementList',
			component: require('./views/appManagement/index').default,
			children: [
				{
					// APP信息
					path: '/appManagement/APPInfo',
					component: require('./views/appManagement/APPInfo').default,
				},
				{
					// 接口调用记录
					path: '/appManagement/portRecord',
					component: require('./views/appManagement/portRecord').default,
				},
			]
		},
		{
			// 藏宝管理
			path: '/treasureManage',
			redirect: '/treasureManage/treasureManageList',
			component: require('./views/appManagement/index').default,
			children: [
				{
					// 基金记录
					path: '/treasureManage/fundRecord',
					component: require('./views/treasureManage/fundRecord').default,
				},
				{
					// 基金合计
					path: '/treasureManage/fundAggregate',
					component: require('./views/treasureManage/fundAggregate').default,
				},
				{
					// 基金合计详情
					path: '/treasureManage/fundTotalDetail',
					component: require('./views/treasureManage/fundTotalDetail').default,
				},
				{
					// 加速分析记录
					path: '/treasureManage/acceleratedAnalysisRecord',
					component: require('./views/treasureManage/acceleratedAnalysisRecord').default,
				},
				{
					// 加速赏金单记录
					path: '/treasureManage/speedBountyRecord',
					component: require('./views/treasureManage/speedBountyRecord').default,
				},
				{
					// 加速每日统计
					path: '/treasureManage/speedDailyStatistics',
					component: require('./views/treasureManage/speedDailyStatistics').default,
				},
				{
					// 赏金单分配记录
					path: '/treasureManage/recordBountyDistribution',
					component: require('./views/treasureManage/recordBountyDistribution').default,
				},
				{
					// 宝图换图记录
					path: '/treasureManage/treasureChangeRecord',
					component: require('./views/treasureManage/treasureChangeRecord').default,
				},
				{
					// 赏金单合并记录
					path: '/treasureManage/combinedBountyRecords',
					component: require('./views/treasureManage/combinedBountyRecords').default,
				},
				{
					// 藏宝数据记录
					path: '/treasureManage/dataRecordTreasure',
					component: require('./views/treasureManage/dataRecordTreasure').default,
				},
				{
					// 赏金任务单
					path: '/treasureManage/bountyTask',
					component: require('./views/treasureManage/bountyTask').default,
				},
				{
					// 赏金任务单
					path: '/treasureManage/bountyTask/bountyTaskDetail',
					component: require('./views/treasureManage/bountyTask/bountyTaskDetail').default,
				},
				{
					// 全网数据
					path: '/treasureManage/networkData',
					component: require('./views/treasureManage/networkData').default,
				},
				{
					// 系统藏宝数据记录
					path: '/treasureManage/systemTreasureDataRecord',
					component: require('./views/treasureManage/systemTreasureDataRecord').default,
				},
				{
					// 任务指导
					path: '/treasureManage/taskGuide',
					component: require('./views/treasureManage/taskGuide').default,
				},
				{
					// 用户确认定位
					path: '/treasureManage/userConfirmLocation',
					component: require('./views/treasureManage/userConfirmLocation').default,
				},
				{
					// 用户累计信息
					path: '/treasureManage/userCumulativeInfo',
					component: require('./views/treasureManage/userCumulativeInfo').default,
				},
				{
					// 赏金支付记录
					path: '/treasureManage/bountyPay',
					component: require('./views/treasureManage/bountyPay').default,
				},
				{
					// 赏金支付记录详情
					path: '/treasureManage/bountyPay/bountyPayRecordetails',
					component: require('./views/treasureManage/bountyPayRecordetails').default,
				},
				{
					// 评估用户
					path: '/treasureManage/assessUser',
					component: require('./views/treasureManage/assessUser').default,
				},
			]
		},
		*/
    //OTC
    {
      // 用户管理
      path: '/users',
      component: require('./views/user/index').default,
      children: [
        {
          path: '/users/user', // 客户端管理
          component: require('./views/users/user').default
        },
	      { // 常用语言设置
		      path: '/users/langSettings',
		      component: require('./views/users/langSettings').default
	      },
	      { // 订单详情
		      path: '/users/orderDetail',
		      component: require('./views/users/mobile/orderDetail').default
	      },
        { // 登录日志
          path: '/users/logging',
          component: require('./views/users/logging').default
        },
        { // 查询常用语言
          path: '/users/queryLang',
          component: require('./views/users/queryLang').default
        },
        { // 用户账户查询
          path: '/users/accountQuery',
          component: require('./views/users/accountQuery').default
        },
        {
          //  '用户认证查询',
          path: '/users/authenticationQuery',
          component: require('./views/users/authenticationQuery').default,
        },
        {
          //  '用户账户记录',
          path: '/trade/userAccountLog',
          component: require('./views/trade/userAccountLog').default,
        },
        {
          path: '/users/verifyCode', // 验证码查询
          component: require('./views/users/verifyCode').default
        },
        {
          path: '/user/userCheck', // 用户查询
          component: require('./views/user/userCheck/userCheck').default
        },
      ]
    },
    {
      // 用户查詢
      path: '/deal',
      component: require('./views/deal/index').default,
      children: [
        {
          path: '/deal/userQuery', // 客户端管理
          component: require('./views/deal/userQuery').default
        },
		  {
			  path: '/user/redisKey', // redis
			  component: require('./views/user/redis/redisKey').default
		  },
		  {
			  path: '/user/redisKey/redisDetail', // redis详情
			  component: require('./views/user/redis/redisDetail').default
		  },
      ]
    },
		{
			// 问题管理
			path: '/problem',
			component: require('./views/problem/index').default,
			children: [
				{
					path: '/problem/problem', // 问题反馈
					component: require('./views/problem/problem').default
				},
				{
					path: '/problem/details', // 问题反馈---详情
					component: require('./views/problem/mobileDetails/details').default
				},
			]
		},
		{
			// 交易管理
			path: '/business',
			component: require('./views/business/index').default,
			children: [
				{
					path: '/business/business', // 市商管理
					component: require('./views/business/business').default
				},
				{
					path: '/business/orderAudit', // 订单审核
					component: require('./views/business/orderAudit').default
				},
				{
					path: '/business/orderAudit/orderAuditDetails', // 订单审核
					component: require('./views/business/orderAuditDetails').default
				},
				{
					// 银行卡信息 1
					path: '/trade/bankInfo/bankInfo',
					component: require('./views/trade/bankInfo/bankInfo').default,
				},
				{
					// 银行卡信息 1 --- 银行卡详情
					path: '/trade/bankInfo/bankInfoDetails',
					component: require('./views/trade/bankInfo/bankInfoDetails').default,
				},
				{
					// 市商服务
					path: '/business/serviceOrder',
					component: require('./views/business/serviceOrder').default,
				},
        // 交易记录
        {
          path: '/user/tradeRecord',
          component: require('./views/user/tradeRecord/tradeRecord').default
        },
        { // 交易记录详情
          path: '/user/tradeRecord/tradeDetail',
          component: require('./views/user/tradeRecord/tradeDetail').default
        },
        { // 统计金额
          path: '/business/statisticalAmount',
          component: require('./views/business/statisticalAmount').default
        }
			]
		},
		{
			// 新交易所管理
			path: '/coin',
			component: require('./views/coin/index').default,
			children: [
				{
					path: '/coin/coinDepositAndDrawLimit', // 虚拟币充提配额度
					component: require('./views/coin/coinDepositAndDrawLimit').default
				},
				{
					path: '/coin/drawCoinAccount', // 虚拟币充提配额度
					component: require('./views/coin/drawCoinAccount').default
				},
				{
					path: '/coin/manTransLog', // 币币充值汇总任务
					component: require('./views/coin/manTransLog').default
				},
				{
					path: '/coin/tcAccount', // 虚拟币账户
					component: require('./views/coin/tcAccount').default
				},
				{
					path: '/coin/tcOrder', // 虚拟币充提记录
					component: require('./views/coin/tcOrder').default
				},
				{
					path: '/coin/ccPair', // 币种货币对
					component: require('./views/coin/ccPair').default
				},
				{
					path: '/coin/coinentrust', // 币种委托
					component: require('./views/coin/coinentrust').default
				},
				{
					path: '/coin/cointrade', // 币种成交记录
					component: require('./views/coin/cointrade').default
				},
				{
					path: '/coin/coinVolume', // 币种行情记录
					component: require('./views/coin/coinVolume').default
				},
			]
		},
		{
			// 系统管理
			path: '/system',
			component: require('./views/system/index').default,
			children: [
				{
					path: '/system/errorLog', // 错误日志
					component: require('./views/system/errorLog').default
				},
				{
					path: '/system/messageList', // 消息记录查询
					component: require('./views/system/messageList').default
				},
				{
					path: '/system/notice', // 公告查询
					component: require('./views/system/notice').default
				},
				{
					path: '/system/notice/noticeDetails', // 公告详情
					component: require('./views/system/noticeDetails').default,
				},
				{
					path: '/system/notice/noticeAdd',// 新增公告
					component: require('./views/system/noticeAdd.vue').default
				},
        {
          path: '/user/redisKey', // redis
          component: require('./views/user/redis/redisKey').default
        },
			]
		},
		{
			// 权限管理
			path: '/sysCenter',
			component: require('./views/sysCenter/index').default,
			children: [
				{
					path: '/sysCenter/ctrlUser', // 管理员信息
					component: require('./views/sysCenter/ctrlUser/ctrlUser').default
				},
				{
					path: '/sysCenter/role', // 角色列表
					component: require('./views/sysCenter/role/role').default
				},
				{
					path: '/sysCenter/menuList', // 资源信息
					component: require('./views/sysCenter/menuList/menuList').default
				},
			]
		},
		{
			// 帮助中心
			path: '/helpCenter',
			component: require('./views/help/index').default,
			redirect: '/helpCenter/helpCenter',
			children: [
				{
					path: 'helpCenter', // 菜单列表
					component: require('./views/help/helpCenter').default
				},
				{
					path: 'articleList', // 文章列表
					component: require('./views/help/articleList').default
				},
			]
		},
		{
			// 帮助中心
			path: '/helpCenter/articleList',
			component: require('./views/help/articleList').default,
			// children: [
			// 	{
			// 		path: 'firstMenu', // 管理员信息
			// 		component: require('./views/help/firstMenu').default
			// 	},
			// 	{
			// 		path: 'articleList', // 管理员信息
			// 		component: require('./views/help/articleList').default
			// 	},
			// ]
		}
	]
})

router.afterEach(() => {
	window.scrollTo(0, 0)
})

export default router
