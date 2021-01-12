<template>
  <div class="c-page">
    <div class="search">
      <div class="label">菜单ID：</div>
      <div class="input-wrap input-t-a"><input type="text" v-model.trim="inputUsername" placeholder="请输入菜单ID"></div>
      <div class="btns">
        <div class="btn" @click="searchInput">查询</div>
        <div class="btn black" @click="clearInput">清空</div>
      </div>
      <div class="f1"></div>
      <div class="btns">
        <div class="btn" @click="addFn">新增</div>
        <div class="btn" @click="modifyUser">修改</div>
      </div>
    </div>
    <el-table
            border
            class="table-a"
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            :highlight-current-row="true"
            style="width: 100%"
            @row-click="itemDetail"
            @select="handleRow">
        <el-table-column
                prop="menuId"
                width="70"
                label="菜单ID" >
        </el-table-column>
        <el-table-column
                prop="name"
                label="菜单名称" >
        </el-table-column>
        <el-table-column
                prop="parentName"
                label="父级菜单" >
        </el-table-column>
        <el-table-column
                prop="type"
                label="类型" >
          <template slot-scope="status"><span class="type"
                                              :class="typeCls(status.row.type)">{{orderFn(status.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="parentId"
                label="排序编号" >
        </el-table-column>
        <el-table-column
                prop="url"
                label="菜单链接" >
        </el-table-column>
        <el-table-column
                prop="perms"
                width="240"
                label="授权编码" >
        </el-table-column>

    </el-table>
    <v-dialog2
            @okFn="okFn2"
            @cancelFn="cancelFn"
            ref="dialog"
            :title="dialogTitle"
            class="dialog-t-a">
      <div class="v-box">
        <div class="search-box">
          <div class="label">类型</div>
          <div class="input-wrap check-w">
            <div v-for="(item, index) in radioArr" :key="index" class="list-check" @click="checkOne(item, index)">
              <div class="check-a" :class="{'checked': radio === index}"></div>
              <div>{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="search-box">
          <div class="label">菜单名称</div>
          <div class="input-wrap"><input v-model.trim="name" type="text" placeholder="请输入菜单名称" ></div>
        </div>
        <div class="search-box">
          <div class="label">父级菜单</div>
          <div class="input-wrap select-input-a" @click="showTreeFn">
            <span>{{parentName}}</span>
            <div class="el-icon-caret-bottom el-icon--right"></div>
          </div>
        </div>
        <div class="search-box" v-show="radio === 1">
          <div class="label">跳转url</div>
          <div class="input-wrap"><input v-model.trim="route" type="text" placeholder="请输入跳转url" ></div>
        </div>
        <div class="search-box"  v-show="radio === 1 || radio === 2">
          <div class="label">授权编码</div>
          <div class="input-wrap"><input v-model.trim="perms" type="text" placeholder="请输入授权编码" ></div>
        </div>
        <div class="search-box" v-show="radio === 1 || radio === 0">
          <div class="label">排序编号</div>
          <div class="input-wrap"><input v-model.trim="orderNum" type="number" placeholder="请输入排序编号" ></div>
        </div>

        <div class="search-box"  v-show="radio === 1">
          <div class="label">菜单路由</div>
          <div class="input-wrap"><input v-model.trim="url" type="text" placeholder="请输入资源名称" ></div>
        </div>
        <div class="error-red">{{errMsg}}</div>
      </div>
    </v-dialog2>

    <el-dialog class="tree-wrap" :visible.sync="showTree">
      <div class="tit">选择菜单</div>
      <div class="scroll-wrap">
        <el-tree
                :data="deptData"
                check-strictly
                ref="tree"
                highlight-current
                :default-expanded-keys="deptIdList"
                show-checkbox
                node-key="menuId"
                :props="{label: 'name', children: 'children'}"
                @check-change="handleClick"
                @node-click="checkChange">
        </el-tree>
      </div>
      <div class="btns">
        <div class="btn black" @click="showTree = false">关闭</div>
        <div class="btn" @click="showTree = false">保存</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	/* eslint-disable */
	import Dialog from '@/components/dialog/dialog'

	export default {
		data() {
			return {
				oldList: [],
				deptIdList: [],
				menuId: '',
				addFlag: false,
				errMsg: '',
				deptData: [],
				oldArr: [],
				showTree: false,
				parentName: '一级菜单',
				orderNum: '',
				sysCode: '',
				name: '',
				url: '',
				perms: '',
				route: '',
				radioArr: [
					{
						name: '目录',
						label: 0
					},
					{
						name: '菜单',
						label: 1
					},
					{
						name: '按钮',
						label: 2
					},
				],
				radio: 1,
				dialogTitle: '新增资源',
				menuName: '',
				checkItem: '',
				inputUsername: '',
				list: [{}],
				total: -1,
				searchVal: '',
				parentId: 0,
				multipleSelection: [],
				pageIndex: 1,
			}
		},
		mounted() {
			// this.getData()
      this.getdeptData()
		},
		methods: {
			// 利用对象是引用类型地址
			sortArr(arr) {
				var copy = JSON.parse(JSON.stringify(arr));
				var obj = {};
				copy.forEach((item, index) => {
					obj[item.menuId] = item;
				});
				var res = [];
				copy.forEach(item => {
					if (item.parentId === -1) {
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
			getdeptData () {
				this.$fetch.post('/sys/menu/select').then(res => {
					this.oldArr = res.data.menuList
					this.deptData = this.sortArr(res.data.menuList)
					this.parentId = 0
					this.parentName = this.deptData[0].name
				})
			},
			handleClick(data, checked, node){
				if(checked === true){
					this.parentId = data.menuId;
					this.parentName = data.name
					this.$refs.tree.setCheckedNodes([data]);
				}
			},
			checkChange (data) {
				this.$refs.tree.setCheckedNodes([data])
				this.parentId = data.menuId
				this.parentName = data.name
      },
			checkOne (item, index) {
				this.radio = index
				this.orderNum = ''
				this.sysCode = ''
				this.name = ''
				this.url = ''
				this.perms = ''
				this.route = ''
      },
			verify () {
				if (this.name === '') {
					this.errMsg = '请输入菜单名称'
					return false
				}
				if (this.parentName === '') {
					this.errMsg = '请选择父级菜单'
					return false
				}
				if (this.radio === '1') {
					if (this.route === '') {
						this.errMsg = '请输入菜单路由'
						return false
					}
					if (this.url === '') {
						this.errMsg = '请输入菜单跳转url'
						return false
					}
					if (this.perms === '') {
						this.errMsg = '请输入授权编码'
						return false
					}
				}
				if (this.orderNum === '' && (this.radio === '1' || this.radio === '0')) {
					this.errMsg = '请输入排序编号'
					return false
				}
				return true
			},
			okFn2 () {
				this.errMsg = ''
				if (this.verify()) {
					if (this.addFlag === true) {
						this.$fetch.postArr2('/sys/menu/save', {
							parentName: this.parentName,
							parentId: this.parentId,
							type: this.radio,
							orderNum: this.orderNum,
							sysCode: "system_center",
							name: this.name,
							url: this.url,
							perms: this.perms,
							route: this.route
						}).then(res => {
							this.$store.commit('SET_LOADING', false)
							Dialog({
								title: '新增成功',
                okFn: () => {
	                this.getData()
                }
							})
						}).catch(err => {
							this.$store.commit('SET_LOADING', false)
						})
					} else {
						this.$fetch.postArr2('/sys/menu/update', {
							menuId: this.menuId,
							parentName: this.parentName,
							parentId: this.parentId,
							type: this.radio,
							orderNum: this.orderNum,
							sysCode: "system_center",
							name: this.name,
							url: this.url,
							perms: this.perms,
							route: this.route
						}).then(res => {
							this.$store.commit('SET_LOADING', false)
							this.$store.dispatch('getNavList')
							Dialog({
								title: '修改成功',
								okFn: () => {
									this.getData()
								}
							})
						}).catch(err => {
							this.$store.commit('SET_LOADING', false)
						})
					}
        }
      },
			cancelFn () {
				this.orderNum = ''
				this.name = ''
				this.url = ''
				this.perms = ''
				this.route = ''
      },
			searchInput () {
				this.getData()
      },
			clearInput () {
				this.inputUsername = ''
      },

			addFn () {
				this.cancelFn()
				this.addFlag = true
        this.radio = 1
        this.dialogTitle = '新增菜单'
				this.parentName = '一级菜单'
				this.parentId = 0
				this.menuId = ''
        this.$refs.dialog.show()
      },
			modifyUser ()  {
				this.addFlag = false
				this.radio = this.checkItem.type
				this.dialogTitle = '修改菜单'
				this.$refs.dialog.show()
				this.orderNum = this.checkItem.orderNum
				this.name = this.checkItem.name
				this.url = this.checkItem.url
				this.perms = this.checkItem.perms === '-' ? '' : this.checkItem.perms
				this.route = this.checkItem.route
				this.parentName = this.checkItem.parentName === '-' ? '一级菜单' : this.checkItem.parentName
				this.parentId = this.checkItem.parentId
				this.menuId = this.checkItem.menuId
      },

			orderFn(type) {
				if (type === 0) return '目录'
				if (type === 1) return '菜单'
				if (type === 2) return '按钮'
			},
			typeCls(type) {
				if (type === 0) return 'list-a'
				if (type === 1) return 'menu-a'
				if (type === 2) return 'button-a'
			},
			getData() {
				if (this.inputUsername && this.oldList.length > 0) {
					let list = this.oldList
					list.forEach(item => {
						if (item.menuId === Number(this.inputUsername)) {
							this.list = [item]
            }
          })
          return
        }
				if (!this.inputUsername && this.oldList.length > 0) {
					this.list = this.oldList
					return
        }
				this.$store.commit('SET_LOADING', true)
				this.$fetch.get('/sys/menu/list', {
					sysCode: 'system_center'
				}).then(res => {
					this.$store.commit('SET_LOADING', false)
					this.list = res
          this.oldList = res
					if (this.inputUsername) {
						let list = this.oldList
						list.forEach(item => {
							if (item.menuId === Number(this.inputUsername)) {
								this.list = [item]
							}
						})
					}
					this.list.forEach(item => {
						if (!item.parentName) {
							item.parentName = '-'
						}
						if (!item.url) {
							item.url = '-'
						}
						if (!item.perms) {
							item.perms = '-'
						}
					})
					this.total = res.length
				})
			},
			// 多选框
			handleSelectionChange(val) {
				this.multipleSelection = val
			},
			itemDetail (item) {
				this.checkItem = item
                this.deptIdList = [item.parentId]
            },
			showTreeFn () {
              this.showTree = true
              setTimeout(() => {
	          this.$refs.tree.setCheckedKeys(this.deptIdList)
            }, 200)
      },
      handleRow (selection, row) {
        if(selection.length > 1) {
          selection.shift()
        }
        this.multipleSelection = selection
        // 先清除所有选中的
        this.$refs.multipleTable.clearSelection();
        // 当前的点击实现勾选
        this.$refs.multipleTable.toggleRowSelection(row);
      },
		},
		components: {
			vDialog2: require('@/components/dialog2.vue').default,
		},
	};
</script>

<style scoped lang="stylus">
  .c-page
    padding: 0 20px 0 20px
    .table-a
      border-bottom 1px solid #EBEEF5
      &::before
        display: none
      >>> .el-table__body-wrapper
            height calc(100vh - 280px)
            overflow-y auto
      &.el-table>>> td
            &:last-child
              padding-right: 30px
  .search
    padding-top: 30px
  .input-t-a
    width: 200px
    margin-right: 20px
    input
      width: 100%
  .dialog-t-a
    .v-box
      .error-red
        color #f00
    .check-w,.search-t
      display: flex
      align-items center
    .list-check
      height: 36px
      display: flex
      align-items center
      font-size: 14px
      color #000
      margin-right: 60px
      cursor pointer
      .check-a
        width: 20px
        height: 20px
        border: 1px solid #e5e8ed
        border-radius 4px
        margin-right: 10px
        &.checked
          border none
          background: url("../../../assets/img/checked.svg") no-repeat center / cover
    .search-box
      height: 36px
      .select-input-a
        border: 1px solid #e5e8ed
        cursor pointer
        display: flex
        align-items center
        justify-content space-between
        padding: 0 10px
      .label
        width: 80px
        line-height: 36px
      .input-wrap
        flex 1
        line-height: 36px
        input
          padding: 0 10px
          width: 100%
  .tree-wrap
    >>> .el-dialog
      max-height 600px
      overflow auto
    .tit
      font-weight: bold
      margin-bottom: 30px
    .scroll-wrap
      min-height 300px
      padding-bottom: 30px
    .btns
      padding-bottom: 40px
      align-items center
      justify-content center
      .btn:nth-child(2)
        background-color: #144eb1
</style>
