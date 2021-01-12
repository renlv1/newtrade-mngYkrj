<template>
  <div class="c-page mar-right transaction-list">
    <div class="page-wrap">
      <div class="search">
        <div class="label">角色名称：</div>
        <div class="input-wrap input-t-a"><input type="text" v-model.trim="inputUsername" placeholder="请输入角色名称"></div>
        <div class="btns">
          <div class="btn" @click="searchInput">查询</div>
          <div class="btn black" @click="clearInput">清空</div>
        </div>
        <div class="f1"></div>
        <div class="btns">
          <div class="btn" @click="addFn">新增</div>
          <div class="btn" @click="modifyRole">赋角色</div>
          <div class="btn" @click="modifyUser">修改</div>
        </div>
      </div>
      <list-wrap :list="list" :total="total" @change="getData">
        <el-table
                class="table-a"
                ref="multipleTable"
                :highlight-current-row="true"
                :data="list"
                tooltip-effect="dark"
                @row-click="itemDetail"
                style="width: 100%">
          <el-table-column
                  prop="roleId"
                  label="角色ID">
          </el-table-column>
          <el-table-column
                  prop="roleName"
                  label="角色名称">
          </el-table-column>
          <el-table-column
                  prop="sysName"
                  label="所属系统">
          </el-table-column>
          <el-table-column
                  prop="remark"
                  label="备注">
          </el-table-column>
          <el-table-column
                  prop="createTime"
                  label="创建时间">
          </el-table-column>
        </el-table>
      </list-wrap>
    </div>
    <!--    新增角色-->
    <v-dialog2
            @okFn="okFn"
            :okFlag="okFlag"
            @cancelFn="cancelFn"
            ref="dialog"
            :title="dialogTitle"
            class="dialog-t">
      <div class="v-box">
        <div class="search-box" v-show="roleFlag">
          <div class="label">角色名称</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text" placeholder="请输入角色名称" ></div>
        </div>
        <div class="search-box" v-show="roleFlag">
          <div class="label">备注</div>
          <div class="input-wrap"><input v-model.trim="name" type="text" placeholder="请输入备注" ></div>
        </div>
        <div class="error-red">{{errMsg}}</div>
        <div class="tree-m-a">
          <div class="scroll-wrap">
            <div class="tree-title">资源与操作权限</div>
            <el-tree
                    :data="menuData"
                    ref="menuTree"
                    highlight-current
                    show-checkbox
                    check-on-click-node
                    :default-expanded-keys="menuIdList"
                    :expand-on-click-node="true"
                    auto-expand-parent
                    node-key="menuId"
                    :props="{label: 'name', children: 'children'}"
                    @check="checkChange"
                    @node-click="checkChange">
            </el-tree>
          </div>
          <div class="scroll-wrap">
            <div class="tree-title">数据权限</div>
            <el-tree
                    :data="deptData"
                    ref="deptTree"
                    highlight-current
                    show-checkbox
                    check-on-click-node
                    :default-expanded-keys="deptIdList"
                    :expand-on-click-node="true"
                    node-key="deptId"
                    :props="{label: 'name', children: 'children'}"
                    @check="checkChange2"
                    @node-click="checkChange2">
            </el-tree>
          </div>
        </div>
      </div>
    </v-dialog2>
  </div>
</template>

<script>
	/*eslint-disable*/
	import Dialog from '@/components/dialog/dialog'
	export default {
		data () {
			return {
				roleFlag: true,
				menuArr: [],
				menuData: [],
				okFlag: false,
				showTree: false,
				roleText: '',
				roleId: '',
				postText: '',
				postId: '',
				userName: '',
				name: '',
				password: '',
				password2: '',
				remark: '',
				dialogTitle: '新增角色',
				list: [],
				total: -1,
				searchVal: '',
				pageIndex: 1,
				multipleSelection: [],
				errMsg: '',
				inputUsername: '',
				disableId: 1,
				disableText: '否',
				disableArr: [
					{text: '否', id: 1},
					{text: '是', id: 2}
				],
				email: '',
				mobile: '',
				roleData: [],
				postData: [],
				deptData: [],
				selected: '',
				parentId: '',
				parentName: '',
				currentId: '',
				checkItem: '',
				menuIdList: [],
				deptIdList: [],
				oldArr: []
			}
		},
		created () {
			this.getPostData()
			this.getdeptData()
      this.getMenuData()
		},
		methods: {
			checkChange2 () {
				this.deptIdList = this.$refs.deptTree.getCheckedKeys()
      },
			// 删除用户
			itemDetail (item) {
				this.checkItem = item
				this.currentId = item.roleId
				this.roleId = item.roleId
			},
			// 利用对象是引用类型地址
			sortArr(arr) {
				var copy = JSON.parse(JSON.stringify(arr));
				var obj = {};
				copy.forEach((item, index) => {
					obj[item.deptId] = item;
				});
				var res = [];
				copy.forEach(item => {
					if (!item.parentName) {
						res.push(item);
					}
					for (var key in obj) {
						if (item.name === obj[key].parentName) {
							if (item.children) {
								item.children.push(obj[key]);
							} else {
								item.children = [obj[key]];
							}
						}
					}
				});
				return res;
			},
			sortArr2(arr) {
				var copy = JSON.parse(JSON.stringify(arr));
				var obj = {};
				copy.forEach((item, index) => {
					obj[item.menuId] = item;
				});
				var res = [];
				copy.forEach(item => {
					if (!item.parentName) {
						res.push(item);
					}
					for (var key in obj) {
						if (item.menuId === obj[key].parentId) {
							if (item.children) {
								item.children.push(obj[key]);
							} else {
								item.children = [obj[key]];
							}
						}
					}
				});
				return res;
			},
			checkChange (data) {
				let selected = this.selected.menuId
				if (selected && data.menuId !== selected) {
					this.$refs.menuTree.setChecked(this.selected, false)
				}
				this.selected = data

        this.menuIdList = this.$refs.menuTree.getCheckedKeys()
				this.parentId = this.selected.deptId
				this.parentName = this.selected.name
			},
			// 部门 /sys/dept/list
			getdeptData () {
				this.$fetch.post('/sys/dept/list').then(res => {
					this.oldArr = res
					this.deptData = this.sortArr(res)
				})
			},
      // 菜单
      getMenuData () {
	      this.$fetch.post('/sys/menu/list', {
		      sysCode: 'system_center'
        }).then(res => {
		      this.menuArr = res
		      this.menuData = this.sortArr2(res)
	      })
      },
			// 角色列表 /sys/role/select
			getRoleData () {
				this.$fetch.post('/sys/role/select').then(res => {
					this.roleData = res.data.list
					this.roleText = this.roleData[0].roleName
					this.roleId = this.roleData[0].roleId
				})
			},
			// 岗位列表
			getPostData () {
				this.$fetch.post('/sys/post/select').then(res => {
					this.postData = res.data.list
					this.postText = this.postData[0].postName
					this.postId = this.postData[0].postId
				})
			},
			verify () {
				this.errMsg = ''
				if (this.userName === '') {
					this.errMsg = '请输入菜单名称'
					return false
				}
				if (this.name === '') {
					this.errMsg = '请输入菜单名称'
					return false
				}
				return true
      },
			okFn() {
				if (this.verify()) {
					this.$store.commit('SET_LOADING', true)
					if (this.currentId) { // 修改
						this.$fetch.postArr2('/sys/role/update', {
							roleId: this.roleId,
							roleName: this.userName,
							remark: this.name,
							createTime: this.$changeDate(new Date(), '-', 8),
							sysCode: "system_center",
							deptIdList: this.deptIdList,
							menuIdList: this.menuIdList,
							sysName: "otc管理平台"
						}).then(res => {
							this.$store.commit('SET_LOADING', false)
							Dialog({
								title: '操作成功',
								okFn: () => {
									this.$refs.dialog.hide()
									this.getData()
								}
							})
						}).catch(err => {
							this.$store.commit('SET_LOADING', false)
						})
					} else { // 新增
						this.$fetch.postArr2('/sys/role/save', {
							roleName: this.userName,
							remark: this.name,
							deptIdList: this.deptIdList,
							menuIdList: this.menuIdList,
							sysCode: "system_center"
						}).then(res => {
							this.$store.commit('SET_LOADING', false)
							Dialog({
								title: '操作成功',
								okFn: () => {
									this.$refs.dialog.hide()
									this.getData()
								}
							})
						}).catch(err => {
							this.$store.commit('SET_LOADING', false)
							Dialog({
								title: '404'
							})
						})
					}
				}
			},
			cancelFn () {
				this.userName = ''
				this.name = ''
				this.password = ''
				this.password2 = ''
				this.disableId = 1
				this.disableText = '否'
				this.mobile = ''
				this.email = ''
				this.roleText = ''
				this.roleId = ''
				this.postText = ''
				this.postId = ''
			},
			addFn () {
				this.roleFlag = true
				this.dialogTitle = '新增角色'
				this.currentId = ''
				this.userName = ''
				this.name = ''
				this.menuIdList = []
				this.deptIdList = []
				this.$refs.dialog.show()
			},
			commandChange (commend) {
				if (commend.index === 1) {
					this.disableText = commend.item.text
					this.disableId = commend.item.id
				} else if (commend.index === 2) {
					this.roleText = commend.item.roleName
					this.roleId = commend.item.roleId
				} else if (commend.index === 3) {
					this.postText = commend.item.postName
					this.postId = commend.item.postId
				}
			},
			modifyRole () {
				if (!this.currentId) {
					this.$message.error('请选择一条记录')
					return
				}
				this.roleFlag = false
        this.dialogTitle = '所有权限'
				this.$refs.dialog.show()
				this.getRoleDetails(this.checkItem.roleId)
      },
			// 修改
			modifyUser () {
				this.roleFlag = true
				if (!this.currentId) {
					this.$message.error('请选择一条记录')
					return
				}
				this.dialogTitle = '修改角色'
				this.$refs.dialog.show()
        this.getRoleDetails(this.checkItem.roleId)
			},
      // 获取角色信息
      getRoleDetails (id) {
	      this.$fetch.get('/sys/role/info/' + id).then(res => {
		      this.userName = this.checkItem.roleName
		      this.name = this.checkItem.remark
		      this.menuIdList = res.data.role.menuIdList
		      this.deptIdList = res.data.role.deptIdList
		      this.$refs.deptTree.setCheckedKeys(this.deptIdList)
		      this.$refs.menuTree.setCheckedKeys(this.menuIdList)
	      }).catch(err => {
	      })
      },
			findB (arr, id) {
				arr.forEach(item => {
					if (Number(item.id) === Number(id)) {
						return item.text
					}
				})
			},
			findA (arr, id) {
				arr.forEach(item => {
					if (item.deptId === id) {

						return item.name
					}
				})
			},
			// 删除
			deleteUser () {
				if (!this.currentId) {
					this.$message.error('请选择一条记录')
					return
				}
				this.dialogTitle = '是否确认删除以下角色？'
				this.userName = this.checkItem.username
				this.name = this.checkItem.name
				this.$refs.dialog2.show()
			},
			idArrFn () {
				let idArr = []
				this.multipleSelection.forEach(item => {
					idArr.push(item.userId)
				})
				return idArr
			},
			// 重置
			resetUser () {
				if (this.multipleSelection.length === 0) {
					this.$message.error('请选择一条记录')
					return
				}
				this.$fetch.postArr2('/sys/user/psd/reset', this.idArrFn()).then(res => {
					Dialog({
						title: '操作成功'
					})
				})
			},
			// 搜索
			searchInput () {
				this.getData()
			},
			clearInput () {
				this.inputUsername = ''
			},
			// 多选框
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 用户状态
			statusFn (type) {
				if (type === 1) return '正常'
				return '禁用'
			},
			// 列表数据
			getData (pageIndex, pageSize) {
				this.$store.commit('SET_LOADING', true)
				this.$fetch.get('/sys/role/list', {
					search: this.inputUsername,
					page: pageIndex || this.pageIndex,
					limit: pageSize || 10
				}).then(res => {
					this.$store.commit('SET_LOADING', false)
					this.list = res.data.page.list
					this.total = res.data.page.totalCount
				}).catch(err => {
					this.$store.commit('SET_LOADING', false)
				})
			}
		},
		components: {
			vDialog2: require('@/components/dialog2.vue').default,
		},
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .error-red
     color #f00
  .input-t-a
    width: 200px
    margin-right: 20px
    input
      width: 100%
  .wrap
    background-color: @white;
  .search
    padding-top 20px
    flex-wrap wrap
    justify-content space-between
  .table-a
    .red
      color #f00
  .tree-wrap{
    /deep/ .el-dialog{
      width: 500px;
    }
    .tit{
      text-align: center;
      font-size: 18px;
      padding-bottom: 20px;
      margin-bottom: 10px;
    }
    .btns{
      padding: 20px 0
      display: flex
      align-items center
      justify-content center
    }
  }
  .dialog-t-a
    >>> .g-dialog-ok
      border: 1px solid #ff0000
      background-color: #ff0000
    >>> .g-dialog-wrap
      width: 700px
    .b-a
      margin-top: 30px
    .search-box
      height: 36px
      .label
        width: 80px
        line-height: 36px
      .input-wrap
        flex 1
        background-color: #f7f7f7
        line-height: 36px
        padding: 0 10px
  .dropdown-menu3
    width: 300px !important
    height: 500px !important
    overflow-x hidden !important
    >>> .el-dropdown-menu__item
      width: 100%
  .dialog-t
    >>> .g-dialog-wrap
      max-height 700px
      overflow auto
    >>> .g-dialog-btn-wrap
      padding-bottom: 40px
    .tree-m-a
      display: flex
      .scroll-wrap
        width: 50%
        .tree-title
          font-weight: bold
          margin: 10px 0 20px
    .msg-t
      color #f00
      margin: 10px 0 10px 80px
    .search-box
      .label
        line-height: 36px
        width: 80px
      .input-wrap
        flex 1
        &.dept-input
          background-color: #eee
          border: 1px solid #e5e8ed
          border-radius 4px
          cursor pointer
          line-height 36px
          padding: 0 10px
          .no-name
            color #b3b3b3
        input
          width: 100%
        textarea
          width: 100%
          height: 80px
          border: 1px solid #e5e8ed
          border-radius 4px
          padding: 10px
      .dropdown-wrap
        border-radius 4px
        border: 1px solid #e5e8ed
        padding: 0 10px
</style>
