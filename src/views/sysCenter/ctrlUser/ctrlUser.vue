<template>
  <div class="c-page mar-right transaction-list">
    <div class="page-wrap">
      <div class="search">
        <div class="label">用户名：</div>
        <div class="input-wrap input-t-a"><input type="text" v-model.trim="inputUsername" placeholder="请输入用户名、姓名"></div>
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
            prop="userId"
            label="用户ID">
            <template slot-scope="scope">{{ scope.row.userId }}</template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="登录用户名">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">{{ isEmptyText(scope.row.deptName) }}</template>
          </el-table-column>
          <el-table-column
            label="是否禁用">
            <template slot-scope="scope"><div :class="{'red': scope.row.status !== 1}"></div>{{ statusFn(scope.row.status) }}</template>
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
        <div class="search-box">
          <div class="label">登录用户名</div>
          <div class="input-wrap"><input v-model.trim="userName" type="text" placeholder="请输入登录用户名" ></div>
        </div>
        <div class="search-box">
          <div class="label">姓名</div>
          <div class="input-wrap"><input v-model.trim="name" type="text" placeholder="请输入姓名" ></div>
        </div>
        <div class="search-box">
          <div class="label">密码</div>
          <div class="input-wrap"><input v-model.trim="password" type="text" placeholder="请输入登录密码" ></div>
        </div>
        <div class="search-box" v-show="!currentId">
          <div class="label">确认密码</div>
          <div class="input-wrap"><input v-model.trim="password2" type="text" placeholder="请确认登录密码" ></div>
        </div>
        <div class="search-box">
          <div class="label">邮箱</div>
          <div class="input-wrap">
            <input placeholder="请输入邮箱" v-model.trim="email">
          </div>
        </div>
        <div class="search-box">
          <div class="label">手机号</div>
          <div class="input-wrap">
            <input placeholder="请输入手机号" v-model.trim="mobile">
          </div>
        </div>
        <div class="search-box">
          <div class="label">所属部门</div>
          <div class="input-wrap dept-input" @click="showTreeFn">
            <div class="input-t" :class="{'no-name': !parentId}">{{parentName || '请选择所属部门'}}</div>
          </div>
        </div>
        <div class="search-box">
          <div class="label">角色</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange" :placement="'bottom-start'">
                              <span class="el-dropdown-link">
                                {{roleText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item,2)" v-for="(item,index) in roleData" :key="index">{{item.roleName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">岗位</div>
          <div class="input-wrap dropdown-wrap ">
            <el-dropdown @command="commandChange" :placement="'bottom-start'">
              <span class="el-dropdown-link">
                {{postText}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu class="menu dropdown-menu3" slot="dropdown">
                <el-dropdown-item :command="composeValue(item,3)" v-for="(item,index) in postData" :key="index">{{item.postName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">是否禁用</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange" :placement="'bottom-start'">
                              <span class="el-dropdown-link">
                                {{disableText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                              </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="composeValue(item,1)" v-for="(item,index) in disableArr" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="msg-t">{{errMsg}}</div>
      </div>
    </v-dialog2>
<!--    部门-->
    <el-dialog class="tree-wrap" :visible.sync="showTree">
      <div class="tit">选择父级菜单</div>
      <div class="scroll-wrap">
        <el-tree
                :data="deptData"
                check-strictly
                ref="tree"
                highlight-current
                :default-expanded-keys="deptIdList"
                show-checkbox
                node-key="deptId"
                :props="{label: 'name', children: 'children'}"
                @check-change="handleClick"
                @node-click="checkChange">
        </el-tree>
      </div>
      <div class="btns">
        <div class="btn" @click="showTree = false">保存</div>
        <div class="btn black" @click="showTree = false">关闭</div>
      </div>
    </el-dialog>
    <v-dialog2
            @okFn="okFn2"
            ref="dialog2"
            :title="dialogTitle"
            class="dialog-t-a">
      <div class="b-a">
        <div class="search-box">
          <div class="label">登录用户名</div>
          <div class="input-wrap">{{userName}}</div>
        </div>
        <div class="search-box">
          <div class="label">用户描述</div>
          <div class="input-wrap">{{name}}</div>
        </div>
        <div class="search-t">
          <div class="label">角色</div>
          <div class="input-wrap">
            <div v-for="(item, index) in roleData" :key="index" class="list-check" @click="checkOne(item, index)">
              <div class="check-a" :class="{'checked': isChecked === item.roleId}"></div>
              <div>{{item.roleName}}</div>
            </div>
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
	      deptIdList: [],
	      roleIdArr: [],
	      isChecked: -1,
	      radio: [],
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
	      oldArr: []
      }
    },
    created () {
    	this.getRoleData()
      this.getPostData()
      this.getdeptData()
    },
    methods: {
	    checkOne (item, index) {
	    	this.isChecked = item.roleId
		    this.roleText = item.roleName
		    this.roleId = item.roleId
      },
    	// 赋角色
	    okFn2 () {
		    this.$fetch.postArr('/sys/user/update', {
			    createTime: this.$changeDate(new Date(), '-', 8),
			    userId: this.currentId,
			    deptId: this.checkItem.deptId,
			    deptName: this.checkItem.deptName,
			    email: this.checkItem.email,
			    mobile: this.checkItem.mobile,
			    name: this.checkItem.name,
			    postIdList: this.checkItem.postIdList,
			    roleIdList: [this.roleId],
			    status: this.checkItem.status,
			    username: this.checkItem.username
		    }).then(res => {
			    Dialog({
				    title: '操作成功',
				    okFn: () => {
					    this.okFlag = false
					    this.$refs.dialog2.hide()
					    this.getData()
				    }
			    })
		    })
      },
	    showTreeFn () {
		    this.showTree = true
		    setTimeout(() => {
			    this.$refs.tree.setCheckedKeys(this.deptIdList)
		    }, 200)
	    },
	    itemDetail (item) {
	    	this.checkItem = item
	    	this.currentId = item.userId
        this.deptIdList = [item.deptId]
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
      getDetails (id) {
	    	///sys/user/info/36
	      this.$fetch.get('/sys/user/info/' + id).then(res => {
		      this.roleIdArr = res.data.user.roleIdList
		      this.isChecked = res.data.user.roleIdList[0]
	      })
      },
	    handleClick(data, checked, node){
		    if(checked === true){
			    this.parentId = data.deptId;
			    this.parentName = data.name
			    this.$refs.tree.setCheckedNodes([data]);
		    }
	    },
	    checkChange (data) {
		    this.selected = data
		    this.$refs.tree.setCheckedNodes([data])
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
	    okFn () {
		    this.errMsg = ''
	    	if (this.userName === '') {
	    		this.errMsg = '请输入用户名'
          return
        }
		    if (this.name === '') {
			    this.errMsg = '请输入姓名'
			    return
		    }
		    if (this.password === '') {
			    this.errMsg = '请输入密码'
			    return
		    }

		    if (!this.currentId) {
			    if (this.password2 === '') {
				    this.errMsg = '请再次输入密码'
				    return
			    }
          if (this.password2 !== this.password) {
            this.errMsg = '两次输入的密码不一致'
            return
          }
		    }
		    if (this.email === '') {
			    this.errMsg = '请输入邮箱'
			    return
		    }
		    if (this.mobile === '') {
			    this.errMsg = '请输入手机号'
			    return
		    }
		    if (this.currentId) {
			    Dialog({
				    title: '是否修改这条记录',
				    okFn: () => {
					    this.$fetch.postArr('/sys/user/update', {
						    createTime: this.$changeDate(new Date(), '-', 8),
						    userId: this.currentId,
						    deptId: this.parentId,
						    deptName: this.parentName,
						    email: this.email,
						    mobile: this.mobile,
						    name: this.name,
						    password: this.password,
						    postIdList: [this.postId],
						    roleIdList: [this.roleId],
						    status: this.disableId,
						    username: this.userName
					    }).then(res => {
						    Dialog({
							    title: '操作成功',
							    okFn: () => {
								    this.okFlag = false
                    this.$refs.dialog.hide()
								    this.getData()
							    }
						    })
					    })
				    }
			    })
        } else {
			    Dialog({
				    title: '是否新增这条记录',
				    okFn: () => {
					    this.$fetch.postArr('/sys/user/save', {
						    deptId: this.parentId,
						    deptName: this.parentName,
						    email: this.email,
						    mobile: this.mobile,
						    name: this.name,
						    password: this.password2,
						    postIdList: [this.postId],
						    roleIdList: [this.roleId],
						    status: this.disableId,
						    username: this.userName
					    }).then(res => {
						    Dialog({
							    title: '操作成功',
							    okFn: () => {
								    this.okFlag = false
								    this.getData()
								    this.$refs.dialog.hide()
							    }
						    })
					    })
				    }
			    })
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
		    this.dialogTitle = '新增角色'
		    this.currentId = ''
		    this.userName = ''
		    this.name = ''
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
      // 修改
      modifyUser () {
        if (!this.currentId) {
          this.$message.error('只能选择一条记录')
          return
        }
        this.dialogTitle = '修改角色'
        this.$refs.dialog.show()
	      this.userName = this.checkItem.username
	      this.name = this.checkItem.name
	      this.password = this.checkItem.password
	      this.mobile = this.checkItem.mobile
	      this.email = this.checkItem.email
	      this.disableId = this.checkItem.status
	      this.disableArr.forEach(item => {
		      if (Number(item.id) === Number(this.checkItem.status)) {
			      this.disableText = item.text
		      }
	      })

        if (this.checkItem.roleIdList && this.checkItem.roleIdList.length) {
	        this.roleText = this.matchType(this.roleData, this.checkItem.roleIdList[0])
	        this.roleId = this.checkItem.roleIdList[0]
        }

        if (this.checkItem.postIdList && this.checkItem.postIdList.length) {
	        this.postText = this.matchType(this.postData, this.checkItem.postIdList[0])
	        this.postId = this.checkItem.postIdList[0]
        }

	      this.getDetails(this.currentId)
	      this.parentId = this.checkItem.deptId
	      this.oldArr.forEach(item => {
		      if (item.deptId === this.checkItem.deptId) {
			      this.parentName = item.name
		      }
	      })
        // /sys/user/info/31
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
      // 赋角色
	    modifyRole () {
        if (!this.currentId) {
          this.$message.error('请选择一条记录')
          return
        }
        this.dialogTitle = '赋角色'
	      this.userName = this.checkItem.username
	      this.name = this.checkItem.name
        if (this.checkItem.roleIdList && this.checkItem.roleIdList.length) {
	        this.roleId = this.checkItem.roleIdList[0]
        }
        this.getDetails(this.currentId)
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
        if (this.inputUsername === '') {
          this.getData()
          return
        }
        this.$store.commit('SET_LOADING', true)
        this.$fetch.post('/sys/user/list', {
          username: this.inputUsername
        }).then(res => {
          this.$store.commit('SET_LOADING', false)
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        }).catch(err => {
          this.$store.commit('SET_LOADING', false)
        })
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
        this.$fetch.post('/sys/user/list', {
          user: this.searchVal,
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
    >>> .g-dialog-wrap
      width: 700px
    .search-t
      display: flex
    .list-check
      height: 36px
      display: flex
      align-items center
      font-size: 14px
      color #000
      margin-bottom: 5px
      cursor pointer
      .check-a
        width: 20px
        height: 20px
        border: 1px solid #e5e8ed
        margin-right: 20px
        &.checked
          border none
          background: url("../../../assets/img/checked.svg") no-repeat center / cover
    .b-a
      margin-top: 30px
    .label
      width: 80px
      line-height: 36px
    .search-box
      height: 36px
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
    .v-box
      margin-top: 30px
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
