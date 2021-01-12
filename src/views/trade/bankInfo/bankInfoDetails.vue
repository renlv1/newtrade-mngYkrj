<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/trade/bankInfo" class="title-m">银行卡信息 </router-link>
        <span> / 银行卡详情</span>
      </div>
      <div class="btn-right">
        <span class="btn-save btn-blue" @click="saveBank">保存</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w ul-input-w">
        <li class="li-item li-item-text">
          <div class="li-left">银行卡ID</div>
          <div class="li-right">{{data.id}}</div>
        </li>
        <li class="li-item li-item-text">
          <div class="li-left">用户名</div>
          <div class="li-right">{{userName}}</div>
        </li>
        <li class="li-item li-item-text">
          <div class="li-left">用户地址</div>
          <div class="li-right">{{userSystemCode}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">类型</div>
          <div class="li-right">
            <el-dropdown  @command="changeBank1" class="el-dropdown-2">
              <span class="el-dropdown-link">
                {{bankType}}<i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu-details" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in bankArr" :key="index" v-show="index > 0">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">银行名称</div>
          <div class="li-right">
            <input type="text" v-model="bankName">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">开户支行名称</div>
          <div class="li-right">
            <input type="text" v-model="subBankName">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">银行卡户名</div>
          <div class="li-right">
            <input type="text" v-model="realName">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">银行卡号</div>
          <div class="li-right">
            <input type="number" v-model="bankNumber" >
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">国家</div>
          <div class="li-right">
            <input type="text" v-model="country">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">SWIFT</div>
          <div class="li-right">
            <input type="text" v-model="swift">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">IBAN</div>
          <div class="li-right">
            <input type="text" v-model="iban">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">银行地址</div>
          <div class="li-right">
            <input type="text" v-model="bankAddress">
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">状态</div>
          <div class="li-right">
            <el-dropdown  @command="changeBank2" class="el-dropdown-2">
              <span class="el-dropdown-link">
                {{stateText}}<i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu-details" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in stateArr"  v-show="index > 0" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">币种</div>
          <div class="li-right">
            <el-dropdown  @command="changeBank3" class="el-dropdown-2">
              <span class="el-dropdown-link">
                {{currency}}<i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu-details" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in currencyOptins" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">创建时间</div>
          <div class="li-right">{{startDate}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">更新时间</div>
          <div class="li-right">{{endDate}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">充值</div>
          <div class="li-right">
            <el-dropdown  @command="changeBank4" class="el-dropdown-2">
              <span class="el-dropdown-link">
                {{depositText}}<i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu-details" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in options1" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="li-item">
          <div class="li-left">提现</div>
          <div class="li-right">
            <el-dropdown  @command="changeBank5" class="el-dropdown-2">
              <span class="el-dropdown-link">
                {{drawText}}<i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu class="dropdown-menu-details" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in options1" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog width="30%" :visible.sync="showDialog">
      <div class="problem-box-a">
        <img src="../../../assets/img/warning.png"><label>确认保存已修改的内容？</label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="paySure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return{
	      bankAddress: '',
	      country: '',
	      bankNumber: '',
	      iban: '',
	      swift: '',
	      realName: '',
	      subBankName: '',
          userSystemCode: '',
	      stateText: '',
	      stateId: '',
	      currency: '',
	      endDate: '',
	      startDate: '',
	      //        日期控件
	      pickerBeginDateBefore: {
		      disabledDate: (time) => {
			      let beginDateVal = this.endDate
			      if (beginDateVal) {
				      return time.getTime() > beginDateVal
			      }
		      }
	      },
	      pickerBeginDateAfter: {
		      disabledDate: (time) => {
			      let beginDateVal = this.startDate
			      if (beginDateVal) {
				      return time.getTime() < beginDateVal
			      }
		      }
	      },
	      bankType: '',
	      bankId: '',
	      bankName: '',
	      depositText: '',
	      depositId: '',
	      drawText: '',
        drawId: '',
	      bankArr: [],
	      stateArr: [],
	      options1: [
		      {id: 0, text: '不支持'},
		      {id: 1, text: '支持'},
        ],
        currencyOptins: [
	        {id: 1, text: 'CNY'},
	        {id: 2, text: 'USD'},
        ],
        userName: '',
        errTip: '',
        paymentArr: [
          {text: '给用户打钱',id: 1},
          {text: '给老板打钱',id: 2},
        ],
        showDialog: false,
        id: this.$route.query.id,
        data: '',
        payText: '',
        payType: '',
      }
    },
    created() {
      this.getStatus()
      this.getData()
    },
    methods: {
      getStatus() {
        this.$fetch.get(`/public/enumValue?classPackage=trade.BankInfo$BankTypeEnum;trade.BankInfo$BankStatusEnum;trade.BankInfo$SupportDepositEnum &flag=true&state=1`).then(res => {
          if (res.code === 0) {
            this.bankArr = res.data.data.BankTypeEnum
            this.stateArr = res.data.data.BankStatusEnum
          }
        })
      },
	    saveBank () {
		    // if (this.bankName === '') {
		    //   Dialog({
		    //     content: '请输入银行名称'
		    //   })
		    //   return
		    // }
		    // if (this.subBankName === '') {
			  //   Dialog({
				//     content: '请输入开户支行名称'
			  //   })
			  //   return
		    // }
		    // if (this.realName === '') {
			  //   Dialog({
				//     content: '请输入银行卡户名'
			  //   })
			  //   return
		    // }
		    if (this.bankNumber === '') {
			    Dialog({
				    content: '请输入银行卡号'
			    })
			    return
		    }
		    this.showDialog = true
      },
	    changeBank1 (v) {
	    	this.bankType = v.text
        this.bankId = v.id
      },
	    changeBank2 (v) {
		    this.stateText = v.text
        this.stateId = v.id
	    },
	    changeBank3 (v) {
		    this.currency = v.text
	    },
	    changeBank4 (v) {
		    this.depositText = v.text
        this.depositId = v.id
	    },
	    changeBank5 (v) {
		    this.drawText = v.text
        this.drawId = v.id
	    },
      // 打钱
      handleCommand5(command) {
        this.errTip = ''
        this.payText = command.text
        this.payType = command.id
      },
      paySure() {
	      let obj = {
		      id: this.id,
              userName: this.userName,
              userSystemCode: this.userSystemCode
	      }
	      if (this.bankId) obj.bankType = this.bankId
	      if (this.bankName) obj.bankName = this.bankName
	      if (this.subBankName) obj.subBankName = this.subBankName
	      if (this.realName) obj.realName = this.realName
	      if (this.bankNumber) obj.bankNumber = this.bankNumber
	      if (this.country) obj.country = this.country
	      if (this.swift) obj.swift = this.swift
	      if (this.iban) obj.iban = this.iban
	      if (this.bankAddress) obj.bankAddress = this.bankAddress
	      if (this.stateId) obj.status = this.stateId
	      // if (this.startDate) obj.createAt = this.startDate
	      // if (this.endDate) obj.updateAt = this.endDate
	      if (this.depositId) obj.supportDeposit = this.depositId
	      if (this.drawId || this.drawId === 0) obj.supportDraw = this.drawId
	      this.$fetch.post('/trade/bankInfo/updateBankInfo', obj).then(res => {
		      if (res.code === 0) {
		        this.showDialog = false
			      Dialog({
				      content: '保存成功',
				      okFn: () => {
					      this.$router.push('/trade/bankInfo/bankInfo')
				      }
			      })
		      }
	      })
      },
      payMoney() {
        this.errTip = ''
        this.payType = ''
        this.payText = ''
        this.showDialog  = true
      },
      getData() {
        this.$fetch.post(`/trade/bankInfo/preUpdateBankInfo`,{
        	id: this.id
        }).then(res => {
          if(res.code === 0) {
            this.data = res.data.resultData
            let obj = res.data.resultData
            this.userName = obj.userName
            this.userSystemCode = this.isEmptyText(obj.userSystemCode)
            this.bankName = this.isEmptyText(obj.bankName)
            this.subBankName = this.isEmptyText(obj.subBankName)
            this.realName = this.isEmptyText(obj.realName)
            this.bankNumber = obj.bankNumber
            this.country = this.isEmptyText(obj.country)
            this.swift = this.isEmptyText(obj.swift)
            this.iban = this.isEmptyText(obj.iban)
            this.bankAddress = this.isEmptyText(obj.bankAddress)
            this.currency = obj.currency
            if(this.bankArr) {
              this.bankType = this.bankArr[obj.bankType].text
            }
            this.bankId = obj.bankType
            if(this.stateArr) {
              this.stateText = this.stateArr[obj.status].text
            }
            this.stateId = obj.status
            this.startDate = obj.createAt
            this.endDate = obj.updateAt
            this.depositText = this.options1[obj.supportDeposit].text
            this.depositId = obj.supportDeposit
            this.drawText = this.options1[obj.supportDraw].text
            this.drawId = obj.supportDraw
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog-input{
    width 240px!important
  }
  .problem-box-a{
    display flex
    align-items center
    img{
      margin-right: 10px
    }
  }
  .problem-box{
    display flex
    justify-content space-between
    align-items center
    .dropdown-wrap {
      cursor pointer
      text-align center
      line-height 40px
      width: 250px;
      margin-right: 20px;
      background-color #fff
      border: 1px solid #DCDFE6;
      border-radius: 6px;
      padding: 0 10px;
      font-size 15px
      height: 40px;
      >>>.el-dropdown-link{
        display flex
        justify-content space-between
        align-items center
      }
    }
    >>>.el-dropdown-menu{
      width 240px!important
    }
  }
  >>>.el-dialog__body{
    padding 30px 20px!important
  }

  .zoom-enter-to{
    transition: none;
  }
</style>
