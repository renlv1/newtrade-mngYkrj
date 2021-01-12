<template>
  <div class="c-page media-wrap mar-right"  @click.stop="quicklySendShow = false">
    <div class="wrap pc-wrap">
      <div class="main-content">
        <div class="search">
            <div class="search-box">
                <div class="label">ID</div>
                <div class="input-wrap"><input v-model.trim="id" type="text"></div>
            </div>
          <div class="search-box">
            <div class="label" >用户名</div>
            <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange"  @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{refStateText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in  statusEnum" :key="index">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">升级vip审核状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange"  @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{vipText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item,6)" v-for="(item,index) in  vipStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">等级</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange"  @visible-change="changeFn">
                                <span class="el-dropdown-link">
                                  {{roundRewardText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in levelEnum" :key="index">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">用户类型</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange"  @visible-change="changeFn">
                            <span class="el-dropdown-link">
                              {{userTypeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box btns">
            <div @click="resetFields" class="btn black">清空</div>
            <div class="btn" @click="search">查询</div>
            <div class="btn" v-show="itemActiveShow" @click="checkFn">查看</div>
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
                    prop="userName"
                    label="用户昵称">
            </el-table-column>
            <el-table-column
                    label="状态">
              <template slot-scope="scope"><div :class="{'no-s': scope.row.status === 1}">{{matchType(statusEnum,scope.row.status)}}</div></template>
            </el-table-column>
            <el-table-column
                    width="140"
                    label="升级vip审核状态">
              <template slot-scope="scope"><div :class="{'no-s': scope.row.vipStatus === 1}">{{matchType(vipStatusEnum, scope.row.vipStatus)}}</div></template>
            </el-table-column>
            <el-table-column
                    prop="userSystemCode"
                    label="用户地址">
            </el-table-column>
            <el-table-column
                    label="手机区号">
              <template slot-scope="scope">{{scope.row.phoneCode}} {{scope.row.mobile}}</template>
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="市商类型">
              <template slot-scope="scope">{{typeFn(scope.row.type)}}</template>
            </el-table-column>
            <el-table-column
                    label="等级">
              <template slot-scope="scope">{{matchType(levelEnum,scope.row.level)}}</template>
            </el-table-column>
            <el-table-column
                    width="110"
                    prop="bond"
                    label="剩余保证金（VBC）">
            </el-table-column>
            <el-table-column
                    prop="ordernum"
                    label="累计接单量">
            </el-table-column>
            <el-table-column
                    prop="successorder"
                    label="成单量">
            </el-table-column>
            <el-table-column
                    label="成单率">
              <template slot-scope="scope">{{rateFn(scope.row.rate)}}</template>
            </el-table-column>
          </el-table>
        </list-wrap>
        <div style="z-index: 9999" class="web-loading1" v-show="loadingShow2">
          <img src="~@img/loading2.gif" />
        </div>
      </div>
    </div>
    <v-dialog2
            ref="dialog"
            class="dialog-t"
            :title="dialogTitle"
            :type="dialogType"
            @okFn="okFn"
            :btnShow="btnShow"
            @cancelFn="cancelFn"
            :okText="okText">
      <div class="input-m input-m-one">
        <div class="search-box">
          <div class="label">账号</div>
          <div class="input-wrap"><input v-model.trim="newUsername" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">ID</div>
          <div class="input-wrap"><input v-model.trim="newId" type="number" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">地址</div>
          <div class="input-wrap"><input v-model.trim="newAddress" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">邮箱</div>
          <div class="input-wrap"><input v-model.trim="newEmail" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">手机</div>
          <div class="input-wrap"><input v-model.trim="newPhone" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">市商类型</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
                              <span class="el-dropdown-link">
                                {{newBusinessTypeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item,4)" v-show="index > 0" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="border"></div>
      </div>
      <div class="input-m">
        <div class="search-box">
          <div class="label">姓名</div>
          <div class="input-wrap"><input v-model.trim="newName" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">身份证</div>
          <div class="input-wrap"><input v-model.trim="newIdCard" type="text" placeholder="" disabled></div>
        </div>
        <div class="search-box">
          <div class="label">状态</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange">
                              <span class="el-dropdown-link">
                                {{userStatusText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item,5)" v-for="(item,index) in newStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="search-box address-input">
        <div class="label">住址</div>
        <div class="input-wrap "><input v-model.trim="newhomeAddress" type="text" placeholder="" disabled></div>
      </div>
      <ul class="ul-img">
        <viewer :images="imgData" class="list-img">
          <div class="img-box video-box" @click="videoShow" v-show="creationVideo">
            <div class="bg"></div>
            <video :src="imgFn(creationVideo)"></video>
          </div>
          <div v-for="(item, index) in imgData2" :key="index" class="img-box" :class="{'img-a': item.flag === true}">
            <div class="bg-a" :style="{backgroundImage: 'url( '+ item.url +')'}">
              <img  :src="item.url" @load="loadImg(index)" ref="imgLoad">
            </div>
          </div>
        </viewer>
      </ul>
      <div class="search-box address-input" :class="{'a-b': errA}" v-show="userStatus === 2">
        <div class="label">失败原因</div>
        <div class="input-wrap err-a">
          <input v-model.trim="auditDesc" type="text" placeholder="">
          <div class="err-t">{{errA}}</div>
        </div>
      </div>

    </v-dialog2>
<!--    video视频播放-->
    <v-dialog2
            :btnShow="false"
            ref="dialog2"
            class="dialog-t video-dialog">
      <div class="video-box">
        <video :src="imgFn(creationVideo)" loop ref="video" controls></video>
      </div>
    </v-dialog2>
  </div>
</template>

<script>
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				imgFlag: false,
				errA: '',
				auditDesc: '',
				vipText: '',
				vipId: '',
				btnShow: false,
				newStatusEnum: [],
				vipStatusEnum: [],
				userStatusText: '',
				userStatus: '',
				newBusinessTypeText: '',
				newBusinessType: '',
				newUsername: '',
				newId: '',
				newAddress: '',
				newEmail: '',
				newPhone: '',
				newName: '',
				newIdCard: '',
				newhomeAddress: '',
				imgData: [],
				imgData2: [],

				dialogType: 'alert',
				dialogTitle: '市商审核',
				okText: '保存',
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
				statusId: '',  //申诉来源
				contentType: '', // 申诉类型
				problemStatus: '', // 等级
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
				userTypeText: '',
				unfoldActive: 0,
				levelEnum: [],
				statusEnum: [],
				sendMessage: '',
				typeEnum: [],
				tradingData: {},
				listTotal: 0,
				msgArr: [],
				dataId: '',
				detailsObj: {},
				creationVideo: ''
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
			loadImg (index) {
               this.imgData2[index].flag = false
            },
			changeFn (flag) {
				if (flag === true && (this.statusEnum.length === 0 || this.statusEnum.vipStatusEnum === 0)) {
					this.getType()
            }
            },
			// //升级vip审核状态  1 待审核 2 通过审核 3 审核失败 4 支付待确认
			vipType (status) {
				if (status === 1) return '待审核'
				if (status === 2) return '通过审核'
				if (status === 3) return '审核失败'
				if (status === 4) return '支付待确认'
            },
			videoShow () {
				this.$refs.dialog2.show()
                setTimeout(() => {
	              this.$refs.video.play()
                }, 300)
            },
			// 市商类型
			typeFn (type) {
				if (type === 1) return '人民币市商'
                  return type+ '-'
            },
            // 成单率
			rateFn (rate) {
				if (rate) return rate * 100 + '%'
            return 0
            },
            cancelFn () {
        this.newUsername = ''
        this.newId = ''
        this.newAddress = ''
        this.newEmail = ''
        this.newPhone = ''
        this.newName = ''
        this.newIdCard = ''
        this.newhomeAddress = ''
        this.imgData = []
        this.imgData2 = []
        this.userStatusText = ''
        this.userStatus = ''
        this.newBusinessTypeText = ''
        this.newBusinessType = ''
        this.creationVideo = ''
      },
            // 修改
            okFn () {
        // /trade/businessman/auditBusinessInfo
				this.errA = ''
        if (this.userStatus === 2 && this.auditDesc === '') {
	        this.errA = '请输入失败原因'
          return
        }
        if (this.userStatus !== 2) {
	        this.auditDesc = ''
        }
				Dialog({
          title: '是否提交审核？',
          okFn: () => {
	          this.$fetch.post('/trade/businessman/auditBusinessInfo', {
		          id: this.newId,
		          auditDesc: this.auditDesc,
		          choose: this.userStatus
	          }).then(res => {
		          Dialog({
			          content: res.msg,
			          okFn: () =>{
				          this.pageIndex = 1
				          this.getData(1,10)
			          	this.hide()
				          this.cancelFn()
			          }
		          })
	          })
          }
        })
      },
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
				this.cancelFn()
                this.getDetails(item.id)
			},
            getDetails (id) {
				// /trade/businessman/preAuditBusinessInfo
	      this.$fetch.post(`/trade/businessman/preAuditBusinessInfo`,{
		      id
	      }).then(res =>{
		      let detailsObj  = res.data.resultData.userCertification
          this.detailsObj = res.data.resultData.userCertification
          let result = res.data.resultData
		      this.newUsername = result.userName
          this.newId = result.id
          this.newAddress = result.userSystemCode
          this.newEmail = result.email
          if (result.phoneCode) {
	          this.newPhone = '+' + result.phoneCode + ' ' + result.mobile
          } else {
	          this.newPhone = '+'  + result.mobile
          }
          this.newName = detailsObj.realName
          this.newIdCard = detailsObj.idCarNumber
          this.newhomeAddress = detailsObj.homeAddress

		      // 1  当status == 1 时 为 市商审核 传递参数时，choose只能为1或者2
		      // 2  当vipStatus == 1时 为VIP升级审核 传递参数时，choose只能是3或者4
          // 1审核成功 2审核失败 3vip升级审核成功 4vip升级审核失败
		      this.btnShow = false
          if (result.status === 1) {
          	this.btnShow = true
	          this.newStatusEnum = [
		          {id: 1, text: '审核成功'},
		          {id: 2, text: '审核失败'}]
          } else if (result.vipStatus === 1) {
	          this.btnShow = true
	          this.newStatusEnum = [
		          {id: 3, text: 'vip升级审核成功'},
		          {id: 4, text: 'vip升级审核失败'}]
          } else {
	          this.newStatusEnum = []
          }

          let imgData = [this.imgFn(detailsObj.idCarImageFront), this.imgFn(detailsObj.idCarImageBack), this.imgFn(detailsObj.idCarHandImage), this.imgFn(detailsObj.addressImage)]
          let arr = []
          imgData.forEach(item => {
          	if (item && typeof item !== null) {
          		arr.push(item)
            }
          })
          this.imgData = arr
		      this.imgData.forEach(item => {
			      let obj = {
			      	url: item,
              flag: true
            }
			      this.imgData2.push(obj)
		      })

		      this.creationVideo = detailsObj.creationVideo
		      this.userStatusText = this.matchType(this.statusEnum,result.status)
		      this.userStatus = result.status
		      this.newBusinessTypeText = this.matchType(this.typeEnum, result.type)
		      this.newBusinessType = result.type
	      })
      },
            imgFn (url) {
	      if (url && typeof url !== null) {
		      if (url.indexOf(';') > -1)  return  url.replace(';', '')
		      if (url.indexOf('\"') > -1)  return  url.replace('\"', '')
          if (url.indexOf('http') === -1) return  'https://rraystudio.blob.core.windows.net/' + url
          return url
	      }
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
			checkFn () {
				this.itemDetail(this.dataId)
                 this.$refs.dialog.show()
                document.body.style.overflow = 'hidden'
			},
			quicklySend () {
				this.quicklySendShow = !this.quicklySendShow
			},
			resetFields () {
			    this.id = ''
				this.userName = ''
				this.refStateText = ''
                this.statusId = ''
				this.roundRewardText = ''
                this.problemStatus = ''
				this.refStateId = ''
				this.userTypeText = ''
				this.contentType = ''
				this.vipText = ''
				this.vipId = ''
			},
			getType () {
				let url = '/public/enumValue?classPackage=trade.Businessman$TypeEnum;trade.Businessman$StatusEnum;trade.Businessman$VipStatusEnum;trade.Businessman$LevelEnum&flag=true&state=1'
				this.$fetch.post(`${url}`).then((res) => {
					if (res.code === 0) {
						this.statusEnum = res.data.data.StatusEnum //状态
						this.levelEnum = res.data.data.LevelEnum //用户类型
						this.typeEnum = res.data.data.TypeEnum //用户类型
                        this.vipStatusEnum = res.data.data.VipStatusEnum // vip审核状态
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
				this.total = 1
				this.getData(this.pageIndex,10)
			},
			getData (pageIndex,pageSize) {
				this.noDataShow = false
				this.loadShow = true
				let statusId = this.statusId > -2 ? this.statusId : ''
				let contentType = this.contentType > -2 ? this.contentType : ''
				let problemStatus = this.problemStatus > -2 ? this.problemStatus : ''
				this.loadingShow2 = true
				this.$fetch.post(`/trade/businessman/queryBusinessmanList`,{
				    id: this.id,
					userName: this.userName,
					vipStatus: this.vipId,
					status: statusId,
					type: contentType,
					level: problemStatus,
					pageIndex: pageIndex || this.pageIndex,
					pageSize: pageSize || this.pageSize,
				}).then(res => {
					this.loadShow = false
					this.loadingShow2 = false
					this.loadingMobile = false
					if (res.code === 0) {
						this.listTotal = res.data.page.list.length
						if (this.pageIndex === 1 && this.listTotal === 0) {
							this.noDataShow = true
						}
						this.list = res.data.page.list
						this.total = res.data.page.totalCount
					}
				})
			},
			commandChange (commend) {
				if (commend.index === 1) {
					this.refStateText = commend.item.text
					this.statusId = commend.item.id
				} else if (commend.index === 2) {
					this.roundRewardText = commend.item.text
					this.problemStatus = commend.item.id
				} else if (commend.index === 3) {
					this.userTypeText = commend.item.text
					this.contentType = commend.item.id
				} else if (commend.index === 4) {
					this.newBusinessTypeText = commend.item.text
					this.newBusinessType = commend.item.id
				} else if (commend.index === 5) {
					this.userStatusText = commend.item.text
					this.userStatus = commend.item.id
				} else if (commend.index === 6) {
					this.vipText = commend.item.text
					this.vipId = commend.item.id
				}
			}
		},
		components: {
			vDialog2: require('@/components/dialog2.vue').default,
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
  .err-a{
    position: relative
    .err-t{
      position: absolute
      top: 100%
      left: 0
      margin-top: 10px
      color #f00
    }
  }
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
    >>> .el-table__row
        cursor pointer
  .main-content
    width 100%;
    background-color #fff;
    padding 0 40px 0 24px;
    min-height calc(100vh - 147px);
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
        >>> .el-dropdown
          width 100%
          height 100%
          color #000
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
    height: 100px
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
  }
  .no-s{
    color #ff0000
    text-align: left
  }
  input{
    color #000
    font-size: 14px
  }
  .dialog-t{
    &.video-dialog{
      .video-box{
        max-height 500px
        max-width 800px
        display: flex
        align-items center
        justify-content center
        margin-top: 60px
      }
      video{
        max-height 500px
        max-width 800px
      }
    }
    .line{
      width: 100%
      border-top: 1px solid #e8e8e8
      position: relative
      margin: 30px 0
      .border{
        position: absolute
        left: 0
        top: -1px
        width: 20px
        border-top: 3px solid #1962df
      }
    }
    .input-m{
      display: flex
      justify-content space-between
      flex-wrap wrap
      &.input-m-one{
        margin-top: 15px
      }
      .search-box{
        display: flex
        align-items center
        margin-right: 30px
        &:nth-child(3n){
          margin-right: 0
        }
      }
      .input-wrap{
        margin-left: 10px
        input{
          width: 200px
          color #000
        }
      }
      .dropdown-wrap{
        width: 200px
        min-width: 200px !important;
        padding: 0 10px
        border: 1px solid #e8e8e8
      }
    }
    .address-input{
      align-items center
      &.a-b{
        margin-bottom: 60px
      }
      .input-wrap{
        flex 1
        width auto
        margin-left: 10px
        input{
          width: 100%
        }
      }
    }
    .ul-img{
      margin-bottom: 40px
      .list-img{
        display: flex
        align-items center
        .img-box{
          width: 180px
          height: 135px
          display: flex
          align-items center
          justify-content center
          cursor pointer
          margin-right: 27px
          &:last-child{
            margin-right: 0
          }
          &.img-a{
            background: url("../../assets/img/loading.gif") no-repeat center
            background-size: 30px
          }
          &.video-box{
            position: relative

            .bg{
              width: 100%
              height: 100%
              background-color: rgba(0,0,0,.4)
              position: absolute
              &::before{
                position: absolute
                left: 50%
                top: 50%
                transform translate(-50%,-50%)
                z-index: 10
                content ''
                display: block
                width: 40px
                height: 40px
                background: url("../../assets/img/play.svg") no-repeat center / cover
              }
            }
          }
          .bg-a{
            width: 100%
            height: 100%
            background-repeat:no-repeat
            background-size: cover
            background-position: center
            img{
              opacity: 0
            }
          }
          img, video{
            max-width 100%
            max-height 100%
          }
        }
      }
    }
  }
</style>
