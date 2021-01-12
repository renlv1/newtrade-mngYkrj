<template>
  <div>
    <div class="edit-wrap">
      <div class="row">
        <el-input class="title" v-model="title">
          <template slot="prepend">标题</template>
        </el-input>
      </div>
      <div class="row" v-if="languages === 'cn'">
        <span style="margin-right: 20px;">设为星标</span>
        <el-switch
          v-model="starFlag">
        </el-switch>
      </div>
      <quill-editor v-model="content"
        class="ql-wrap"
        ref="myQuillEditor"
        :options="editorOption">
      </quill-editor>

      <el-upload
        :action="`${$api}/upload/uploadImg`"
        name="myfile"
        accept="image/*"
        :on-success="uploadSuccess"
        style="display: none"
        :data="{
          sourceType: 2
        }"
        ref="editerUpload"
        with-credentials>
        <div ref="editorUpload" class="el-upload__text"></div>
      </el-upload>
      <div class="btn-wrap">
        <el-button type="primary" :disabled="!title" :loading="loading" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {  quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'

// 自定义字体大小
let Size = Quill.import('attributors/style/size')
Size.whitelist = ['16px', '12px', '14px', '18px',  '20px', '24px', '36px']
Quill.register(Size, true)
export default {
  data () {
    return {
      title: '',
      content: '',
      starFlag: false,
      loading: false,
      editorOption: {
        modules: {
          toolbar: {
            container: [
              [
                {'size': Size.whitelist},
                {'color': [] },
                'bold',
                'italic',
                'underline',
                { 'align': [] },
                { 'list': 'ordered'},
                { 'list': 'bullet' },
                'image', 'link'
              ],
            ],
            handlers: {
              'image': () => {
                this.showUploadHandle()
              },
            }
          }
        },
        placeholder: '',
      },
    }
  },
  props: {
    menuId: String,
    article: Object,
    languages: String,
    beforeId: [Number, String]
  },
  watch: {
    article: {
      handler: function (newVal) {
        if (newVal) {
          this.title = newVal.title
          this.content = newVal.content
          this.starFlag = newVal.starFlag === 1 ? true : false
        } else {
          this.title = ''
          this.content = ''
          this.starFlag = false
        }
      },
      immediate: true
    }
  },
  components: {
    quillEditor
  },
  methods: {
    showUploadHandle (type) {
      this.$refs.editerUpload.clearFiles()
      this.$refs.editorUpload.click()
    },
    uploadSuccess (res) {
      this.insertEmbed(res.data.resultList[0].fileUrl)
    },
    insertEmbed (url) {
      if (!url) return
      let quill = this.$refs.myQuillEditor.quill
      let length = quill.getSelection(true).index
      quill.insertEmbed(length, 'image', url)
      quill.setSelection(length + 1)
    },
    submit () {
      let url = '/system/article/addArticle'
      let params = {
        menuId: this.menuId,
        title: this.title,
        content: this.content,
        languages: this.languages,
        starFlag: this.starFlag ? 1 : 2,
        loading: true
      }
      if (this.article) {
        url = '/system/article/updateArticle'
        params.id = this.article.id
      } else {
        params.beforeId = this.beforeId
      }
      this.$fetch.post(url, params).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$emit('success')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.row{
  padding-top: 20px;
  justify-content: flex-start;
}
.btn-wrap{
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="less">
.quill-editor .ql-container .ql-editor p{
  display: block !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label,
.ql-snow .ql-picker.ql-size .ql-picker-item {
  &[data-value='12px']::before,
  &[data-value='12px']::before{
    content: '12px';
  }
  &[data-value='14px']::before,
  &[data-value='14px']::before{
    content: '14px';
  }
  &[data-value='16px']::before,
  &[data-value='16px']::before{
    content: '16px';
  }
  &[data-value='16px']::before,
  &[data-value='16px']::before{
    content: '16px';
  }
  &[data-value='18px']::before,
  &[data-value='18px']::before{
    content: '18px';
  }
  &[data-value='20px']::before,
  &[data-value='20px']::before{
    content: '20px';
  }
  &[data-value='24px']::before,
  &[data-value='24px']::before{
    content: '24px';
  }
  &[data-value='36px']::before,
  &[data-value='36px']::before{
    content: '36px';
  }
}
.ql-snow .ql-tooltip[data-mode=link]::before, .ql-snow .ql-tooltip::before{
  content: '链接地址'
}
.ql-snow .ql-tooltip a.ql-action::after{
  content: '编辑'
}
.ql-snow .ql-tooltip a.ql-remove::before{
  content: '清除'
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after{
  content: '保存'
}
.ql-container{
  height: 300px;
  font-size: 16px !important;
  color: #000;

}
.quill-editor{
  padding: 20px 0;

}
.edit-wrap{
  .quill-editor .ql-container .ql-editor{
    padding-right: 15px;
  }
  .quill-editor .ql-container .ql-editor p img{
    max-width: 100% !important;
  }
  em,i{
    font-style: italic;
  }
}
</style>
