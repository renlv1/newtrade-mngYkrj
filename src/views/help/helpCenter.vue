<template>
  <div class="page-wrap help-center-wrap">
    <div class="add">
      <h3>帮助中心</h3>
      <el-button type="primary" @click="addMenu()" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="menu-list">
      <div class="item-wrap" v-for="(item, index) in list" :key="index">
        <div class="item">
          <b class="f1" style="font-size: 16px;">{{item.menuName}}</b>
          <i class="el-icon-edit-outline cblue" @click="editMenu(item)"></i>
          <i class="el-icon-delete" style="color: red;" @click="deleteMenu(item.id)"></i>
          <template v-if="list.length > 1">
            <i class="el-icon-top" v-if="index !== 0" @click="moveMenu(item, list[index - 1])"></i>
            <i class="el-icon-bottom" v-if="index !== list.length - 1"  @click="moveMenu(item, list[index + 1])"></i>
          </template>
        </div>
        <div class="child">
          <template v-if="item.child">
            <div class="item sub-item" v-for="(subItem, index) in item.child" :key="index">
              <span class="f1" @click="$router.push(`/helpCenter/articleList?menuId=${subItem.id}`)">{{subItem.menuName}}</span>
              <i class="el-icon-edit-outline cblue" @click="editMenu(subItem)"></i>
              <i class="el-icon-delete" style="color: red;" @click="deleteMenu(subItem.id)"></i>
              <template v-if="item.child.length > 1">
                <i class="el-icon-top" v-if="index !== 0" @click="moveMenu(subItem, item.child[index - 1])"></i>
                <i class="el-icon-bottom" v-if="index !== item.child.length - 1"  @click="moveMenu(subItem, item.child[index + 1])"></i>
              </template>
            </div>
          </template>
          <el-button class="add-btn" size="mini" @click="addMenu(item.id)" icon="el-icon-plus">新增子菜单</el-button>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <el-dialog width="400px" :visible.sync="showDialog" :close-on-click-modal="false" title="编辑菜单">
      <el-input v-model="cn" class="input" placeholder="中文"></el-input>
      <el-input v-model="en" class="input" placeholder="英文"></el-input>
      <el-input v-model="ml" class="input" placeholder="马来文"></el-input>
      <el-input v-model="es" class="input" placeholder="西班牙文"></el-input>
       <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cn: '',
      en: '',
      es: '',
      ml: '',
      showDialog: false,
      activeItem: null,
      parentId: '',
      orderNo: ''
    }
  },

  mounted () {
    this.$store.dispatch('getHelpMenu')
  },
  computed: {
    list () {
      return this.$store.state.helpMenu
    }
  },
  watch: {
    showDialog (newVal) {
      if (!newVal) {
        this.cn = ''
        this.en = ''
        this.es = ''
        this.ml = ''
        this.activeItem = null
        this.parentId = ''
      }
    }
  },
  methods: {
    submit () {
      let url = '/system/menu/addHelpMenu'
      let params = {
        menuName: this.cn,
        englishName: this.en || '--',
        malayName: this.ml || '--',
        spainName: this.es || '--',
        loading: true
      }
      if (this.activeItem) {
        url = '/system/menu/updateHelpMenu'
        params.id = this.activeItem.id
      } else {
        params.parentId = this.parentId || 0
      }
      this.$fetch.post(url, params).then(res => {
        this.$store.dispatch('getHelpMenu')
        this.$message.success('操作成功')
        this.showDialog = false
      })
    },
    moveMenu (item, moveItem) {
      const p1 = this.$fetch.post('/system/menu/updateHelpMenu', {
        id: item.id,
        orderNo: moveItem.orderNo || moveItem.id,
        loading: true
      })
      const p2 = this.$fetch.post('/system/menu/updateHelpMenu', {
        id: moveItem.id,
        orderNo: item.orderNo || item.id
      })
      Promise.all([p1, p2]).then(() => {
        this.$store.dispatch('getHelpMenu')
      })
    },
    addMenu (parentId) {
      if (parentId) {
        this.parentId = parentId
      }
      this.showDialog = true
    },
    editMenu (item) {
      this.cn = item.menuName
      this.en = item.englishName
      this.es = item.spainName
      this.ml = item.malayName
      this.showDialog = true
      this.activeItem = item
    },
    deleteMenu (id) {
      this.$confirm('确认删除').then(_ => {
        this.$fetch.post('/system/menu/deleteMenu', {
          id,
          loading:  true
        }).then(res => {
          this.$store.dispatch('getHelpMenu')
          this.$message.success('删除成功')
        })
      })
    }
  }
}
</script>

<style lang="less">
.help-center-wrap{
  .add{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    h3{
      font-size: 20px;
      font-weight: bold;
    }
  }
  .input{
    margin: 10px 0 10px;
  }
  .item-wrap{
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  .menu-list{
    padding: 0 15px;
    .item{
      cursor: pointer;
      display: flex;
      align-items: center;
      .f1{
        flex: 1;
      }
      &:hover{
        i{
          display: block;
        }
      }
      i{
        display: none;
        font-size: 17px;
        margin-left: 10px;
      }
    }
  }
  .child{
    padding: 10px 20px 15px;
    // background: #f0f0f0;

  }
  .sub-item{
    padding: 2px 0;
    &:hover{
      background: #f9f9f9;
    }
  }
  .add-btn{
    margin-top: 10px;
  }
}
</style>
