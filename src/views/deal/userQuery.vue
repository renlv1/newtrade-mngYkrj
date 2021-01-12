<template>
  <div class="c-page media-wrap mar-right">
    <div class="wrap">
      <div class="main-content">
        <div class="search">
          <div class="search-box">
            <div class="label">用户名</div>
            <div class="input-wrap"><input v-model.trim="userName" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">用户编码</div>
            <div class="input-wrap"><input v-model.trim="userAddress" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">昵称</div>
            <div class="input-wrap"><input v-model.trim="refName" type="text"></div>
          </div>
          <div class="search-box">
            <div class="label">账户状态</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange1">
                            <span class="el-dropdown-link">
                              {{refStateText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in statusArr" :key="index">
                    {{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="search-box">
            <div class="label">用户类型</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange2">
                                <span class="el-dropdown-link">
                                  {{roundRewardText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item, 2)" v-for="(item,index) in userSourceArr"
                                    :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div class="search-box">
            <div class="label">验证方式</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange3">
                                <span class="el-dropdown-link">
                                  {{authentText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item, 3)" v-for="(item,index) in authenticationEnum"
                                    :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div class="search-box">
            <div class="label">是否市商</div>
            <div class="input-wrap dropdown-wrap">
              <el-dropdown @command="commandChange4">
                                <span class="el-dropdown-link">
                                  {{businessText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                <el-dropdown-menu class="menu" slot="dropdown">
                  <el-dropdown-item :command="composeValue(item, 4)" v-for="(item,index) in businessArr"
                                    :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="block">
            <span class="demonstration">注册时间</span>
            <el-date-picker
                    clear-icon="none"
                    clearable="clearable"
                    v-model="startDateStr"
                    :picker-options="pickerBeginDateBefore"
                    type="datetime"
                    placeholder="开始时间"
                    default-time="00:00:00">
            </el-date-picker>
            <span class="hr">-</span>
            <el-date-picker
                    clear-icon="none"
                    clearable="clearable"
                    v-model="endDateStr"
                    :picker-options="pickerBeginDateAfter"
                    type="datetime"
                    placeholder="结束时间"
                    default-time="23:59:59">
            </el-date-picker>
          </div>
          <div class="search-box btns">
            <div class="btn black" @click="resetFields">清空</div>
            <div class="btn" @click="search">查询</div>
          </div>
        </div>
        <el-table
                :data="list"
                border
                class="table-w-a"
                style="width: 100%">
          <el-table-column
                  prop="id"
                  width="45"
                  label="ID">
          </el-table-column>
          <el-table-column
                  prop="userName"
                  label="用户名">
          </el-table-column>
          <el-table-column
                  prop="userSystemCode"
                  label="用户编码">
          </el-table-column>

          <el-table-column
                  prop="nickName"
                  label="用户昵称">
          </el-table-column>
          <el-table-column
                  label="用户状态">
            <template slot-scope="scope">{{statusFn(scope.row.status)}}</template>
          </el-table-column>
          <el-table-column
                  label="是否市商">
            <template slot-scope="scope">{{businessFn(scope.row.isbusinessman)}}</template>
          </el-table-column>
          <el-table-column
                  label="验证方式">
            <template slot-scope="scope">{{verifyFn(scope.row.authentication)}}</template>
          </el-table-column>
          <el-table-column
                  label="用户来源">
            <template slot-scope="scope">{{userSourceFn(scope.row.userSource)}}</template>
          </el-table-column>
          <el-table-column
                  label="用户类型">
            <template slot-scope="scope">{{userTypeFn(scope.row.userType)}}</template>
          </el-table-column>
          <el-table-column
                  prop="createAtStr"
                  label="创建时间">
          </el-table-column>
          <el-table-column
                  prop="updateAtStr"
                  label="更新时间">
          </el-table-column>
          <el-table-column
                  label="备注">
            <template slot-scope="scope">{{isEmptyText(scope.row.remark)}}</template>
          </el-table-column>
          <el-table-column
                  label="登录token">
            <template slot-scope="scope">{{isEmptyText(scope.row.loginToken)}}</template>
          </el-table-column>
          <el-table-column
                  label="短时token">
            <template slot-scope="scope">{{isEmptyText(scope.row.accessToken)}}</template>
          </el-table-column>
          <el-table-column
                  label="登录成功token">
            <template slot-scope="scope">{{isEmptyText(scope.row.nettyToken)}}</template>
          </el-table-column>
        </el-table>
        <table-pagination
                :list="list"
                :total="total"
                :pageSize="pageSize"
                @change="getData"
        ></table-pagination>
        <!--
        <list-wrap :list="isListNull(list)" :total="total" @change="getData" :pageSize="pageSize">
          <div class="web-table">
            <div class="center">
              <div class="thead item-list">
                <div class="li">ID</div>
                <div class="li">用户名</div>
                <div class="li">用户编码</div>
                <div class="li">用户昵称</div>
                <div class="li">用户状态</div>
                <div class="li">是否市商</div>
                <div class="li">验证方式</div>
                <div class="li">用户来源</div>
                <div class="li">用户类型</div>
                <div class="li">创建时间</div>
                <div class="li">更新时间</div>
                <div class="li">备注</div>
                <div class="li">登录token</div>
                <div class="li">短时token</div>
                <div class="li">登录成功token</div>
              </div>
              <div class="item-list table-list" v-for="(item, index) in list" :key="index">
                <div class="flex-item">
                  <div class="li">{{item.id}}</div>
                  <div class="li">{{item.userName}}</div>
                  <div class="li">{{isEmptyText(item.userSystemCode)}}</div>
                  <div class="li">{{item.nickName}}</div>
                  <div class="li">{{statusFn(item.status)}}</div>
                  <div class="li">{{businessFn(item.isbusinessman)}}</div>
                  <div class="li">{{verifyFn(item.authentication)}}</div>
                  <div class="li">{{userSourceFn(item.userSource)}}</div>
                  <div class="li">{{userTypeFn(item.userType)}}</div>
                  <div class="li">{{item.createAtStr}}</div>
                  <div class="li">{{item.updateAtStr}}</div>
                  <div class="li">{{isEmptyText(item.remark)}}</div>
                  <div class="li empty-li">{{isEmptyText(item.loginToken)}}</div>
                  <div class="li">{{isEmptyText(item.accessToken)}}</div>
                  <div class="li">{{isEmptyText(item.nettyToken)}}</div>
                </div>
              </div>
              <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                <img src="~@img/loading.gif"/>
              </div>
            </div>
          </div>
        </list-wrap>
      -->
      </div>
    </div>
  </div>
</template>

<script>
	/*import Dialog from '@/components/dialog/dialog'*/
	export default {
		data() {
			return {
				authentId: '',
				authentText: '',
				businessId: '',
				businessText: '',
				businessArr: [
					{id: "selected", text: "全部"},
					{id: "1", text: "不是"},
					{id: "2", text: "是"},
					{id: "3", text: "审核中"},
        ],
				registerDate: '',
				id: '',
				userName: '',
				userAddress: '',
				refName: '',
				refAddress: '',
				list: [],
				total: 0,
				pageIndex: 1,
				pageSize: 20,
				loadShow: false,
				itemShow: false,
				refStateText: '',
				refStateId: '',
				roundRewardText: '',
				roundRewardId: '',
				unfoldActive: 0,
				userSourceArr: [],
				statusArr: [],
				startDateStr: '',
				endDateStr: '',
				authenticationEnum: [],
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.endDateStr
						if (beginDateVal) {
							return time.getTime() > beginDateVal
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.startDateStr
						if (beginDateVal) {
							return time.getTime() < beginDateVal
						}
					}
				},
			}
		},
		created() {
			this.getType()
      if (window.innerWidth < 1200) {
	      this.total = 1
	      this.getData(1, 10)
      }
		},
		methods: {
			statusFn (item) {
				if (item > -1 && this.statusArr.length > 0) {
					return this.statusArr[item].text
        }
				return '-'
      },
			businessFn (item) { // 1：不是市商  2：是市商 3:市商审核中
				if (item === 1) return '不是'
				if (item === 2) return '是'
				if (item === 3) return '审核中'
        return  '-'
      },
			verifyFn (item) { //验证方式 1：未设置 2：谷歌验证 3：短信验证
				if (item === 1) return '未设置'
				if (item === 2) return '谷歌验证'
				if (item === 3) return '短信验证'
				return  '-'
      },
			userSourceFn (item) {
				if (item === 1) return '本地用户'
        return '-'
      },
			userTypeFn (item) {
				if (item > -1 && this.userSourceArr.length > 0) {
					return this.userSourceArr[item].text
        }
				return '-'
      },
			resetFields() {
				this.userName = ''
				this.userAddress = ''
				this.refName = ''
				this.refAddress = ''
				this.refStateText = ''
				this.roundRewardText = ''
				this.roundRewardId = ''
				this.refStateId = ''
                this.startDateStr = ''
				this.endDateStr = ''
                this.authentText = ''
				this.authentId = ''
                this.businessText = ''
                this.businessId = ''
			},
			unfold(index) {
				this.unfoldActive = index
				this.itemShow = !this.itemShow
				if (this.unfoldActive !== index && this.itemShow === false) {
					this.itemShow = true
				}
				if (this.unfoldActive === index && this.itemShow === false) {
					this.itemShow = true
				}
				if (this.unfoldActive === index + '2' && this.itemShow === true) {
					this.itemShow = false
				}
			},
			getType() {
				let url = '/public/enumValue?classPackage=user.User$UserSourceEnum;user.User$StatusEnum;user.User$AuthenticationEnum; user.User$UserTypeEnum;user.User$IsbusinessmanEnum&flag=true&state=1'
				this.$fetch.post(`${url}`).then((res) => {
					if (res.code === 0) {
						this.statusArr = res.data.data.StatusEnum
						this.userSourceArr = res.data.data.UserSourceEnum
                        this.authenticationEnum = res.data.data.AuthenticationEnum
					}
				})
			},
			search() {
				this.total = 1
				this.getData(1, this.pageSize)
			},
			getData(pageIndex, pageSize) {
				this.loadShow = true
				let roundRewardId = this.roundRewardId > -1 ? this.roundRewardId : ''
				let refStateId = this.refStateId > -1 ? this.refStateId : ''
				let authentId = this.authentId > -1 ? this.authentId : ''
				let businessId = this.businessId > -1 ? this.businessId : ''
				if (this.total !== 0) {
					this.$fetch.post(`/user/userAction/queryUserList`, {
						id: this.id,
						userName: this.userName,
						userSystemCode: this.userAddress,
						nickName: this.refName,
						status: refStateId,
						userType: roundRewardId,
						authentication: authentId,
						isbusinessman: businessId,
						startAtStr:  this.$changeDate(this.startDateStr, '-', 8),
						endAtStr:  this.$changeDate(this.endDateStr, '-', 8),
						pageIndex: pageIndex || this.pageIndex,
						pageSize: pageSize || this.pageSize,
					}).then(res => {
						this.loadShow = false
						if (res.code === 0) {
							this.list = res.data.page.list
							this.total = res.data.page.totalCount
						}
					})
				}
			},
			commandChange1 (commend) {
				this.refStateText = commend.item.text
				this.refStateId = commend.item.id
      },
			commandChange2 (commend) {
				this.roundRewardText = commend.item.text
				this.roundRewardId = commend.item.id
			},
			commandChange3 (commend) {
				this.authentText = commend.item.text
				this.authentId = commend.item.id
			},
			commandChange4 (commend) {
				this.businessText = commend.item.text
				this.businessId = commend.item.id
			}
		},
		components: {
			tablePagination: require('@/components/tablePagination').default
    }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap
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

            .on-the-details
              min-height 0
              opacity 0
              overflow hidden

              .info-box
                width 100%
                height 100%

                .item-flex-item
                  display flex
                  align-items center
                  flex-wrap wrap
                  justify-content flex-start
                  text-align center
                  padding 0 22px

                  .li
                    width auto
                    height auto
                    padding 14px 0
                    text-align left
                    flex none
                    margin-right 100px
                    @media screen and (max-width 1200px) {
                      margin-right 30px
                    }

                    &:nth-child(1)
                      padding-left 0

          &:nth-child(odd)
            background-color #F8F8FA

          .li
            flex 1
            line-height 15px
            width auto
            text-align center

          &:first-child
            background-color #edeff2;

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
          .empty-li
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:3;
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
      &.btns
        margin-left: 50px
      .el-date-editor
        width: 100% !important
        >>> .el-input__inner
          width: 100% !important
          margin-right: 0

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
        border: 1px solid #DCDFE6;
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
    .search-box
      width auto
    .btns
      justify-content flex-start

      .btn
        cursor pointer
        background-color: #2176ff
        &.btn-lg
          width: 120px
</style>

