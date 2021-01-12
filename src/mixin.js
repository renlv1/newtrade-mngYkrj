export default {
  // type区分来源 1.为账户状态; 2.为用户来源
  methods: {
    $userStatus2Text(status, type) {
      let statusText = ''
      if (type == 1) {
        switch (status) {
          case 0:
            statusText = '注册冻结'
            break
          case 1:
            statusText = '正常'
            break
          case 2:
            statusText = '冻结中'
            break
        }
      } else if (type == 2) {
        switch (status) {
          case 1:
            statusText = '派钱包'
            break
          case 2:
            statusText = '派克帝国'
            break
          case 3:
            statusText = '秘密'
            break
        }
      } else if (type == 3) {
        switch (status) {
          case 1:
            statusText = '未设置'
            break
          case 2:
            statusText = '开启'
            break
          case 3:
            statusText = '关闭'
            break
        }
      } else if (type == 4) {
        switch (status) {
          case 0:
            statusText = '未上传'
            break
          case 1:
            statusText = '待审核'
            break
          case 2:
            statusText = '未投放（审核通过）'
            break
          case 3:
            statusText = '投放中'
            break
          case 4:
            statusText = '投放完成（过期）'
            break
          case 5:
            statusText = '审核不通过'
            break
        }
      }
      return statusText
    },
	  isEmptyText (str) {
		  if (str) return str
		  return '-'
	  },
    // 下拉筛选方法添加额外参数
    composeValue(item, index) {
      return {
        'item': item,
        'index': index
      }
    },
    // 所有list的每项
    isListNull (list) {
      //余额 === null || '' 余额===0: {{Number(item.beforeChangeFreezeBalance) || '0'}}
      list.forEach(item => {
        for(let i in item) {
          if (item[i] === null || item[i] === "") {
            item[i] = '-'
          }
        }
      })
      return list
    },
    // 用来筛选出对应的类型
    matchType(arr, target) {
      if (target === '-') {
        return '-'
      } else {
        let text
        arr.forEach((item) => {
          if (parseInt(item.id) === parseInt(target)) {
            text = item.text
          }
        })
        return text
      }
    },
	  timeStrDate (time) {
    	if (time === '-' || !time) {
    		return '-'
	    } else {
		    let str = time.split(' ')
		    return str[0] + '<br>' + str[1]
	    }
	  },
    // 时间过滤
    $changeDate(time, str = '-', type = 1) {
      if (!time) return ''

      function ifTime(value) { // 判断时间是否是个位数
        if (value < 10) {
          return '0' + value
        }
        return value
      }
      let newTime = new Date(time)
      let day = newTime.getDate()
      let month = newTime.getMonth() + 1
      let year = newTime.getFullYear()
      let hours = newTime.getHours()
      let min = newTime.getMinutes()
      let sec = newTime.getSeconds()
      switch (type) {
        case 1:
          return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
        case 2:
          return year + str + ifTime(month) + str + ifTime(day) + ' 00:00:00'
        case 3:
          return year + str + ifTime(month) + str + ifTime(day) + ' 23:59:59'
        case 4:
          return year + str + ifTime(month) + str + ifTime(day)
        case 5:
          return year + str + ifTime(month) + str + ifTime(day)
        case 6:
          return ifTime(hours) + ':' + ifTime(min)
        case 7:
          return ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
        case 8:
          return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
        case 9:
          return ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
        case 10:
          return year + str + ifTime(month) + str + ifTime(day) + '<br>' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
      }
    },
    $clientType(type) {
      let typeText = ''
      if(type === 1) {
        typeText = 'IOS商店版'
      } else if (type === 2) {
        typeText = 'Android设备'
      } else if(type === 3) {
        typeText = 'IOS企业版'
      }else {
        typeText = '-'
      }
      return typeText
    },
    $deviceFlag(flag) {
      let flagText = ''
      if(flag === 1) {
        flagText = '是'
      } else if(flag === 2) {
        flagText = '否'
      }else {
        flagText = '-'
      }
      return flagText
    },
    $transferState(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '创建 '
      } else if (state === 2) {
        stateText = '转账调用失败'
      } else if (state === 3) {
        stateText = '待确认'
      } else if (state === 4) {
        stateText = '转账成功'
      } else if (state === 5) {
        stateText = '转账失败'
      } else if (state === 6) {
        stateText = '转账完成'
      } else if (state === 7) {
        stateText = '需要转账手续费'
      } else if (state === 8) {
        stateText = '账户已变更'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $problemSources(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '充值 '
      } else if (state === 2) {
        stateText = '提现'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $contentType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '充值不到账 '
      } else if (state === 2) {
        stateText = '订单出错'
      } else if (state === 3) {
        stateText = '接单后不确认收款'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $problemStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待处理 '
      } else if (state === 1) {
        stateText = '处理中'
      } else if (state === 2) {
        stateText = '已解决'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $isAuthor(state){
      let stateText = ''
      if (state === 1) {
        stateText = '后台管理员回复 '
      } else if (state === 2) {
        stateText = '用户本身'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $isRead(state){
      let stateText = ''
      if (state === 0) {
        stateText = '未读 '
      } else if (state === 1) {
        stateText = '已读'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $status(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '生效 '
      } else if (state === 2) {
        stateText = '禁用'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $type(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '设置谷歌验证码的问题 '
      }else {
        stateText = '-'
      }
      return stateText
    },
    // 修改类型
    $modifyType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = 'value '
      } else if (state === 2) {
        stateText = '时间'
      } else if (state === 3) {
        stateText = 'value和时间'
      } else {
        stateText = '-'
      }
      return stateText
    },
    // 状态
    $stateType(state) {
      let stateText = ''
      if (state === -1) {
        stateText = '删除 '
      } else if (state === 0) {
        stateText = '创建订单'
      } else if (state === 1) {
        stateText = '处理中'
      } else if (state === 2) {
        stateText = '处理成功'
      } else if (state === 3) {
        stateText = '处理失败'
      }  else if (state === 4) {
        stateText = '撤单'
      }else {
        stateText = '-'
      }
      return stateText
    },
    // 支付类型
    $paymentType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '转账 '
      } else if (state === 2) {
        stateText = '收款'
      } else if (state === 3) {
        stateText = '转出(以太坊)'
      } else if (state === 4) {
        stateText = '以太坊转出审核失败退款'
      } else if (state === 5) {
        stateText = 'SDK转出(以太坊)'
      }  else if (state === 31) {
        stateText = '老板支付充值保证金'
      } else if (state === 32) {
        stateText = '系统收到老板保证金成功'
      } else if (state === 33) {
        stateText = '充值成功系统给用户打款'
      }else if (state === 34) {
        stateText = '充值成功用户收到钱'
      }else if (state === 35) {
        stateText = '充值失败系统给退款'
      }else if (state === 36) {
        stateText = '充值失败老板收到退款'
      } else if (state === 37) {
        stateText = '充值失败，用户仲裁收到退款'
      }else if (state === 38) {
        stateText = 'Boss收款失败'
      } else if (state === 40) {
        stateText = '购买SIE 支付美金'
      }else if (state === 41) {
        stateText = '购买SIE 转账给买家'
      }else if (state === 50) {
        stateText = '开通AI,51:普通商品订单'
      }else if (state === 52) {
        stateText = '续费AI'
      }else if (state === 53) {
        stateText = '购买sie支付优惠值'
      }else if (state === 54) {
        stateText = '后台转账'
      }else if (state === 55) {
        stateText = '训练师奖励发放'
      }else if (state === 56) {
        stateText = '克莱因瓶奖励发放'
      }else if (state === 60) {
        stateText = 'PK投注支付打款'
      }else if (state === 61) {
        stateText = 'sdk红包扣款'
      }else if (state === 62) {
        stateText = 'sdk红包打款'
      } else if (state === 63) {
        stateText = 'sdk红包退款'
      }else if (state === 64) {
        stateText = 'PK投注盈利打款'
      }else if (state === 65) {
        stateText = 'PK退款打款'
      }else if (state === 66) {
        stateText = 'PK退款'
      }else if (state === 67) {
        stateText = '提现支付'
      }else if (state === 68) {
        stateText = '提现给共享者钱'
      }else if (state === 69) {
        stateText = '提现共享者收钱'
      }else if (state === 71) {
        stateText = '克莱因瓶交易奖励发放'
      }else if (state === 72) {
        stateText = '克莱因瓶交易购入sie返还'
      }else if (state === 73) {
        stateText = '申请老板保证金打款'
      }else if (state === 74) {
        stateText = '申请老板保证金收款'
      }else if (state === 75) {
        stateText = '老板支付保证金打款'
      }else if (state === 76) {
        stateText = '老板支付保证金收款'
      }else if (state === 80) {
        stateText = '提现退款打款'
      }else if (state === 81) {
        stateText = '提现退款收款'
      }else if (state === 82) {
        stateText = '克莱因瓶交易买SIE'
      }else if (state === 83) {
        stateText = '克莱因瓶交易卖SIE'
      }else if (state === 84) {
        stateText = '克莱因瓶交易退还'
      }else if (state === 90) {
        stateText = 'PK投注支付收款'
      }else if (state === 91) {
        stateText = 'PK投注盈利收款'
      }else if (state === 101) {
        stateText = '充值申诉退款打款'
      }else if (state === 102) {
        stateText = '充值申诉退款收款'
      }else if (state === 103) {
        stateText = '提现申诉退款打款'
      }else if (state === 104) {
        stateText = '提现申诉退款收款'
      }else if (state === 105) {
        stateText = '提现审核失败退款打款'
      }else if (state === 106) {
        stateText = '提现审核失败退款收款'
      }else if (state === 107) {
        stateText = '不做老板退保证金打款'
      }else if (state === 108) {
        stateText = '不做老板退保证金收款'
      }else if (state === 109) {
        stateText = '以太坊转出手续费'
      }else if (state === 110) {
        stateText = 'APP币币兑换扣款'
      }else if (state === 111) {
        stateText = 'APP币币兑换扣款收款'
      }else if (state === 112) {
        stateText = 'APP币币兑换打款'
      }else if (state === 113) {
        stateText = 'APP币币兑换打款收款'
      }else if (state === 114) {
        stateText = 'APP币币兑换退款'
      }else if (state === 115) {
        stateText = 'APP币币兑换退款收款'
      }else if (state === 116) {
        stateText = '克莱因瓶新交易买SIE'
      }else if (state === 117) {
        stateText = '克莱因瓶新交易卖SIE'
      }else if (state === 118) {
        stateText = '克莱因瓶新交易退还'
      }else if (state === 119) {
        stateText = '购买基金'
      }else if (state === 120) {
        stateText = '群应用打款'
      }else if (state === 121) {
        stateText = '群应用收款'
      }else if (state === 122) {
        stateText = 'BTC转出到公网'
      }
      return stateText
    },
    // 订单类型
    $orderType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '充值 '
      } else if (state === 2) {
        stateText = 'TRADE'
      } else if (state === 3) {
        stateText = '购买SIE'
      } else if (state === 4) {
        stateText = '商品订单'
      } else if (state === 5) {
        stateText = '克莱因瓶奖励'
      }  else if (state === 6) {
        stateText = 'PK支付'
      } else if (state === 7) {
        stateText = 'SDK红包订单'
      } else if (state === 8) {
        stateText = '训练师奖励'
      } else if (state === 9) {
        stateText = 'PK投注'
      }else if (state === 10) {
        stateText = '内部转出'
      }else if (state === 11) {
        stateText = 'SDK以太坊转出'
      }else if (state === 12) {
        stateText = '提现'
      }else if (state === 13) {
        stateText = '克莱因克莱因瓶SIE交易奖励'
      }else if (state === 14) {
        stateText = '克莱因交易所'
      }else if (state === 15) {
        stateText = '老板管理'
      }else if (state === 16) {
        stateText = 'APP币币兑换'
      }else if (state === 17) {
        stateText = '克莱因新交易所'
      }else if (state === 18) {
        stateText = '基金'
      }else if (state === 19) {
        stateText = '群'
      }else if (state === 20) {
        stateText = '比特币转出到公网'
      }
      return stateText
    },
    // 回调状态
    $callbackState(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '等待回调 '
      } else if (state === 2) {
        stateText = '回调中'
      } else if (state === 3) {
        stateText = '回调成功'
      } else if (state === 4) {
        stateText = '回调失败'
      } else if (state === 5) {
        stateText = '停止回调'
      }else if (state === 6) {
        stateText = '不需要回调'
      }else {
        stateText = '-'
      }
      return stateText
    },
    // 解锁状态
    $unlockStatus(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '等待解锁 '
      } else if (state === 2) {
        stateText = '已解锁'
      } else if (state === 3) {
        stateText = '失效'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $userStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '注册冻结(需要校验) '
      } else if (state === 1) {
        stateText = '正常'
      } else if (state === 2) {
        stateText = '后台冻结'
      } else if (state === 3) {
        stateText = '市场要求冻结'
      }else if (state === 4) {
        stateText = '登陆密码错误次数超限冻结'
      }else if (state === 5) {
        stateText = '支付密码错误次数超限冻结'
      } else if (state === 6) {
        stateText = '注册冻结（未同步到SDK）'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $categoryType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '余额的优惠金额 '
      } else if (state === 2) {
        stateText = '开通达尔文获得的优惠金额'
      }else if (state === 3) {
        stateText = 'PK业绩'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $discountStatus(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '有效 '
      } else if (state === 2) {
        stateText = '无效'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $serverStatus(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '正常 '
      } else if (state === 2) {
        stateText = '删除'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $totalTyep(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '派别余额累计 '
      } else if (state === 2) {
        stateText = '奖励值累计'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $typeData(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '达尔文+购买SIE '
      } else if (state === 2) {
        stateText = 'PK投注'
      }else if (state === 3) {
        stateText = '基金业绩'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $sumType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '购买sie累计 '
      } else if (state === 2) {
        stateText = '购买达尔文累计'
      }else if (state === 3) {
        stateText = 'PK投注'
      } else if (state === 4) {
        stateText = '基金购买'
      } else {
        stateText = '-'
      }
      return stateText
    },
    //交易类型
    $changeType(state) {
      let stateText = ''
      if (Number(state) === 0) {
        stateText = ' '
      } else if (Number(state) === 1) {
        stateText = '转账'
      } else if (Number(state) === 2) {
        stateText = '收款'
      } else if (Number(state) === 3) {
        stateText = '传统交易所委托'
      } else if (Number(state) === 4) {
        stateText = '传统交易所成交处理买家'
      } else if (Number(state) === 5) {
        stateText = '传统交易所成交处理卖家'
      } else if (Number(state) === 6) {
        stateText = '传统交易所取消委托'
      } else if (Number(state) === 7) {
        stateText = '传统交易所委托退回'
      } else if (Number(state) === 8) {
        stateText = '克莱因交易所委托'
      } else if (Number(state) === 9) {
        stateText = '克莱因交易所成交处理买家'
      } else if (Number(state) === 10) {
        stateText = '克莱因交易所成交处理系统'
      } else if (Number(state) === 11) {
        stateText = '克莱因交易所成交处理卖家'
      } else if (Number(state) === 12) {
        stateText = '克莱因新交易所取消委托'
      } else if (Number(state) === 13) {
        stateText = '克莱因交易所委托退回'
      } else if (Number(state) === 14) {
        stateText = '内部转账'
      } else if (Number(state) === 15) {
        stateText = '第三方转账'
      } else if (Number(state) === 16) {
        stateText = '充值老板交保证金'
      } else if (Number(state) === 17) {
        stateText = '充值老板确认收款'
      } else if (Number(state) === 18) {
        stateText = '提现用户支付'
      } else if (Number(state) === 19) {
        stateText = '用户确认收款'
      } else if (Number(state) === 20) {
        stateText = '系统取消充值订单'
      } else if (Number(state) === 21) {
        stateText = '提现给共享者钱'
      } else if (Number(state) === 22) {
        stateText = '提现用户取消'
      }else if (Number(state) === 23) {
        stateText = '充值仲裁'
      } else if (Number(state) === 24) {
        stateText = '提现仲裁'
      } else if (Number(state) === 25) {
        stateText = '提现老板拒绝接单'
      } else if (Number(state) === 26) {
        stateText = 'BTC转出'
      } else if (Number(state) === 27) {
        stateText = '不做老板退保证金'
      } else if (Number(state) === 28) {
        stateText = '申请老板支付保证金'
      } else if (Number(state) === 29) {
        stateText = '提现审核失败退款'
      } else if (Number(state) === 30) {
        stateText = '以太坊转出审核失败退款'
      } else if (Number(state) === 31) {
        stateText = '转账手续费'
      } else if (Number(state) === 32) {
        stateText = '开通达尔文'
      } else if (Number(state) === 33) {
        stateText = '后台转账'
      } else if (Number(state) === 34) {
        stateText = '购买基金'
      } else if (Number(state) === 35) {
        stateText = '克莱因奖励发放'
      } else if (Number(state) === 36) {
        stateText = '克莱因参赛不成功返还sie'
      } else if (Number(state) === 37) {
        stateText = '克莱因参赛成功返还sie'
      } else if (Number(state) === 38) {
        stateText = '第三方转入未打款'
      } else if (Number(state) === 39) {
        stateText = 'BTC转入'
      } else if (Number(state) === 40) {
        stateText = 'ETH转入'
      } else if (Number(state) === 41) {
        stateText = 'SIE转入'
      } else {
        stateText = '-'
      }
      return stateText
    },
    // 交易确认状态
    $txConfirmStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待确认 '
      } else if (state === 1) {
        stateText = '确认成功'
      } else if (state === 2) {
        stateText = '确认失败'
      }  else {
        stateText = '-'
      }
      return stateText
    },
    //订单状态
    $orderStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待处理'
      } else if (state === 1) {
        stateText = '处理成功'
      } else if (state === 2) {
        stateText = '处理失败'
      } else if (state === 3) {
        stateText = '处理中'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $callbackStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待回调'
      } else if (state === 1) {
        stateText = '回调成功'
      } else if (state === 2) {
        stateText = '回调失败'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $tradeStatus(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待回调'
      } else if (state === 1) {
        stateText = '创建'
      } else if (state === 2) {
        stateText = '用户已确认转账'
      }  else if (state === 3) {
        stateText = '系统检查中'
      } else if (state === 4) {
        stateText = '系统检查失败'
      }  else if (state === 5) {
        stateText = '系统检查异常'
      } else if (state === 6) {
        stateText = '系统检查成功'
      }  else if (state === 7) {
        stateText = '转账成功'
      } else if (state === 8) {
        stateText = '转账失败'
      }  else if (state === 9) {
        stateText = '转账取消'
      } else if (state === 10) {
        stateText = '创建(转出)'
      }  else if (state === 11) {
        stateText = '以太坊处理中(请求以太坊)'
      } else if (state === 12) {
        stateText = '以太坊检查中'
      }  else if (state === 13) {
        stateText = '转出成功'
      } else if (state === 14) {
        stateText = '系统扣款失败'
      } else if (state === 15) {
        stateText = '以太坊转出失败'
      } else if (state === 16) {
        stateText = '交易成功'
      }  else if (state === 17) {
        stateText = '系统取消超时订单'
      } else if (state === 18) {
        stateText = '转出系统审核中'
      }  else if (state === 19) {
        stateText = '转出系统审核失败'
      } else if (state === 20) {
        stateText = '转出中间状态'
      }  else if (state === 21) {
        stateText = 'BTC转出创建'
      } else if (state === 22) {
        stateText = 'BTC转出异常'
      }  else if (state === 23) {
        stateText = 'BTC转出成功'
      } else if (state === 24) {
        stateText = '调用api转账接口失败'
      }  else {
        stateText = '-'
      }
      return stateText
    },
    $recordType(state) {
      let stateText = ''
      if (state === 0) {
        stateText = ''
      } else if (state === 1) {
        stateText = '转入'
      } else if (state === 2) {
        stateText = '转出'
      }  else if (state === 3) {
        stateText = '内部转入'
      } else if (state === 4) {
        stateText = '内部转出'
      }  else if (state === 5) {
        stateText = 'usd购买sie'
      } else if (state === 6) {
        stateText = '达尔文优惠值兑换sie'
      }  else if (state === 7) {
        stateText = '训练师奖励计划'
      } else if (state === 8) {
        stateText = '比特币转入'
      }  else if (state === 9) {
        stateText = '比特币转出'
      }  else {
        stateText = '-'
      }
      return stateText
    },
    $summaryStatus(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '未汇总'
      } else if (state === 2) {
        stateText = '已汇总'
      } else if (state === 3) {
        stateText = '不需汇总'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $isTotal(state) {
      let stateText = ''
      if (state === 0) {
        stateText = '待处理'
      } else if (state === 1) {
        stateText = '处理中'
      } else if (state === 2) {
        stateText = '处理成功'
      } else if (state === 3) {
        stateText = '没有上级无需累计'
      } else if (state === 4) {
        stateText = '处理失败'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $tradeType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '原价购买'
      } else if (state === 2) {
        stateText = '达尔文优惠券购买'
      } else if (state === 3) {
        stateText = '余额业绩优惠券购买'
      } else if (state === 4) {
        stateText = 'PK业绩优惠券购买'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $logStatus(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '充值'
      } else if (state === 2) {
        stateText = '提现'
      } else if (state === 3) {
        stateText = '转款'
      } else if (state === 4) {
        stateText = '收款'
      }else if (state === 5) {
        stateText = '第三方转入'
      }else if (state === 6) {
        stateText = 'PK投注'
      }else if (state === 7) {
        stateText = 'PK获利'
      }else if (state === 8) {
        stateText = 'PK投注系统钱包收钱'
      }else if (state === 9) {
        stateText = 'PK获利，系统钱包扣钱'
      }else if (state === 10) {
        stateText = '克莱因委托冻结'
      }else if (state === 11) {
        stateText = '莱因委托取消'
      }else if (state === 12) {
        stateText = '克莱因委托完成扣冻结余额'
      }else if (state === 13) {
        stateText = '委托完成加余额'
      } else if (state === 14) {
        stateText = '委托完成有多余冻结余额需要退回'
      }else {
        stateText = '-'
      }
      return stateText
    },
    $portType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '创建委托单'
      } else if (state === 2) {
        stateText = '取消委托单'
      } else if (state === 3) {
        stateText = '支付'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $payType(state) {
      let stateText = ''
      if (state === 1) {
        stateText = '转账'
      } else if (state === 2) {
        stateText = '收款'
      } else if (state === 3) {
        stateText = '转出(以太坊)'
      } else if (state === 4) {
        stateText = '以太坊转出审核失败退款'
      }else if (state === 5) {
        stateText = 'SDK转出(以太坊)'
      }else if (state === 31) {
        stateText = '老板支付充值保证金'
      }else if (state === 32) {
        stateText = '系统收到老板保证金成功'
      }else if (state === 33) {
        stateText = '充值成功系统给用户打款'
      }else if (state === 34) {
        stateText = '充值 \n' +
          '     成功用户收到钱'
      }else if (state === 35) {
        stateText = '充值失败系统给退款'
      }else if (state === 36) {
        stateText = '充值失败老板收到退款'
      }else if (state === 37) {
        stateText = '充值失败，用户冲裁收到退款'
      }else if (state === 38) {
        stateText = 'Boss收款失败'
      } else if (state === 40) {
        stateText = '购买SIE 支付美金'
      }else if (state === 41) {
        stateText = '购买SIE 转账给买家'
      }else if (state === 50) {
        stateText = '开通AI'
      }else if (state === 51) {
        stateText = '普通商品订单'
      }else if (state === 52) {
        stateText = '续费AI'
      } else if (state === 53) {
        stateText = '购买sie支付优惠值'
      } else if (state === 54) {
        stateText = '后台转账'
      }else if (state === 55) {
        stateText = '训练师奖励发放'
      }else if (state === 56) {
        stateText = '克莱因瓶奖励发放'
      }else if (state === 60) {
        stateText = 'PK投注支付打款'
      }else if (state === 61) {
        stateText = 'sdk红包扣款'
      } else if (state === 62) {
        stateText = 'sdk红包打款'
      } else if (state === 63) {
        stateText = 'sdk红包退款'
      }else if (state === 64) {
        stateText = 'PK投注盈利打款'
      }else if (state === 65) {
        stateText = 'PK退款打款'
      } else if (state === 66) {
        stateText = 'PK退款'
      } else if (state === 67) {
        stateText = '提现支付'
      }else if (state === 68) {
        stateText = '提现给共享者钱'
      }else if (state === 69) {
        stateText = '提现共享者收钱'
      }else if (state === 71) {
        stateText = '克莱因瓶交易奖励发放'
      }else if (state === 72) {
        stateText = '克莱因瓶交易购\n' +
          '    入sie返还'
      } else if (state === 73) {
        stateText = '申请老板保证金打款'
      } else if (state === 74) {
        stateText = '申请老板保证金收款'
      } else if (state === 75) {
        stateText = '老板支付保证金打款'
      } else if (state === 76) {
        stateText = '老板支付保证金收款'
      } else if (state === 80) {
        stateText = '提现退款打款'
      } else if (state === 81) {
        stateText = '提现退款收款'
      } else if (state === 82) {
        stateText = '克莱因瓶交易买SIE'
      }else if (state === 83) {
        stateText = '克莱因瓶交易卖SIE'
      }else if (state === 84) {
        stateText = '克莱因瓶交易退还'
      }else if (state === 90) {
        stateText = 'PK投注支付收款'
      }else if (state === 91) {
        stateText = 'PK投注盈利收款'
      } else if (state === 101) {
        stateText = '充值申 \n' +
          '    诉退款打款'
      } else if (state === 102) {
        stateText = '充值申诉退款收款'
      } else if (state === 103) {
        stateText = '提现申诉退款打款'
      } else if (state === 104) {
        stateText = '提现申诉退款收款'
      } else if (state === 105) {
        stateText = '提现审核失败退款打款'
      } else if (state === 106) {
        stateText = '提现审核失败退款收款'
      }else if (state === 107) {
        stateText = '不做老板退保证金打款'
      }else if (state === 108) {
        stateText = '不做老板退保证金收款'
      }else if (state === 109) {
        stateText = '以太坊转出手续费'
      }else if (state === 110) {
        stateText = 'APP币币兑换扣款'
      } else if (state === 111) {
        stateText = 'APP币币兑换扣款收款'
      }else if (state === 112) {
        stateText = 'APP币币兑换打款'
      } else if (state === 113) {
        stateText = 'APP币币兑换打款收款'
      }else if (state === 114) {
        stateText = 'APP币币兑换退款'
      }else if (state === 115) {
        stateText = 'APP币币兑换退款收款'
      }else if (state === 116) {
        stateText = '克莱因瓶新交易买SIE'
      }else if (state === 117) {
        stateText = '克莱因瓶新交易卖SIE'
      } else if (state === 118) {
        stateText = '克莱因瓶新交易退还'
      }else if (state === 119) {
        stateText = '购买基金'
      }else if (state === 120) {
        stateText = '群应用打款'
      }else if (state === 121) {
        stateText = '群应用收款'
      }else if (state === 122) {
        stateText = 'BTC转出到公网'
      } else {
        stateText = '-'
      }
      return stateText
    },
    $weekFn(date) {
      if(date) {
        let arr = date.split(',')
        let weekArr = []
        arr.forEach(item =>{
          if(item === '1') weekArr.push('周一')
          if(item === '2') weekArr.push('周二')
          if(item === '3') weekArr.push('周三')
          if(item === '4') weekArr.push('周四')
          if(item === '5') weekArr.push('周五')
          if(item === '6') weekArr.push('周六')
          if(item === '7') weekArr.push('周七')
        })
        return weekArr.join('、')
      }
    }
  },

  computed: {
    // 年月日转为时间戳
    getUnixTime(dateStr) {
      let newstr = dateStr.replace(/-/g, '/');
      let date = new Date(newstr);
      let time_str = date.getTime();
      return time_str
    }
  }
}
