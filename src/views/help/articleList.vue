<template>
  <div class="page-wrap">
    <div class="add">
      <h3 @click="$router.back()" style="cursor: pointer;"><b class="el-icon-arrow-left"></b>返回</h3>
      <el-button type="primary" @click="addArticle('cn')" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="menu-list">
      <table>
        <thead>
          <tr>
            <td>排序</td>
            <td>标题</td>
            <td>版本</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td>
              <input type="text" @blur="sortItem(item, $event)" :value="item.orderNo">
            </td>
            <td @click="editItem(item)">
              <span class="line">{{item.title}}</span>
            </td>
            <td>
              <div class="link">
                <p
                  v-for="(lang, j) in langList"
                  @click="editSubItem(j, item)"
                  :class="{diff: !item.languageList.includes(j)}"
                  :key="j">
                  {{lang}}<span v-if="!item.languageList.includes(j)">(未添加)</span>
                </p>
              </div>
            </td>
            <td>
              <i class="el-icon-delete" style="color: red; font-size: 18px;" @click="deleteItem(item.id)"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <el-dialog width="660px" :title="`编辑文章${(languages && languages !== 'cn') ? `(${langList[languages]})` : ''}`" class="editor-dialog" :visible.sync="showDialog" :close-on-click-modal="false">
        <editor
          @success="editSuccess"
          :menuId="menuId"
          :languages="languages"
          :beforeId="beforeId"
          :article="currentArticle">
        </editor>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Editor from './editor.vue'
export default {
  data () {
    return {
      list: [],
      menuId: this.$route.query.menuId,
      showDialog: false,
      currentArticle: null,
      beforeId: '',
      languages: '',
      langList: {
        en: '英文版',
        es: '西班牙版',
        ms: '马来版'
      }
    }
  },
  components: {
    Editor
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/system/article/queryArticleList', {
        menuId: this.menuId,
        status: 1,
        loading: true,
      }).then(res => {
        this.list = res.data.page.list || []
      })
    },
    editItem(item, languages) {
      this.languages = languages || 'cn'
      this.currentArticle = item
      this.showDialog = true
    },
    editSubItem (languages, item) {
      // 编辑
      if (item.languageList.includes(languages)) {
        this.languages = languages
        this.$fetch.post('/system/article/preUpdateArticle', {
          languages,
          articleCode: item.articleCode,
          loading: true
        }).then(res => {
          if (res.code === 0) {
            this.editItem(res.data.resultData, res.data.resultData.languages)
          }
        })
      } else {
        // 新建
        this.addArticle(languages, item.id)
      }
    },
    editSuccess () {
      this.showDialog = false
      this.currentArticle = {}
      this.getData()
    },
    deleteItem (id) {
      this.$confirm('确认删除').then(_ => {
        this.$fetch.post('/system/article/deleteArticle', {
          id,
          loading:  true
        }).then(res => {
          this.getData()
          this.$message.success('删除成功')
        })
      })
    },
    addArticle (languages, id) {
      this.languages = languages || ''
      this.beforeId = id || ''
      this.currentArticle = null;
      this.showDialog = true
    },
    sortItem (item, e) {
      let val = e.target.value
      if (!val || val == item.orderNo) return
      if (!parseInt(val)) {
        this.$message.error('只能输数字')
        return
      }
      this.$fetch.post('/system/article/updateOrderNo', {
        articleCode: item.articleCode,
        orderNo: val,
        loading: true
      }).then(res => {
        this.$message.success('修改成功')
        this.getData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
.item{
  padding: 0 15px;

  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  .f1{
    flex: 1;
  }
  i{
    font-size: 17px;
    margin-left: 10px;
  }
}
.link{
  p{
    cursor: pointer;
    text-decoration: underline;
    padding: 2px 0;
    &.diff{
      opacity: .5;
    }
  }
}
.line{
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;
}
table{
  input{
    width: 50px;
    border: 1px solid #ddd;
    height: 30px;
    text-align: center;
  }
  td{
    border: 1px solid #eee;
    padding: 10px;
  }
  td:nth-child(2){
    width: 50%;
  }
  thead tr{
    background: #eee;
    height: 40px;
  }
  tbody tr{
    border-bottom: 1px solid #eee;
  }
}
</style>

<style lang="less">
.editor-dialog{
  .el-dialog{
    padding-bottom: 30px;
  }
}
</style>
