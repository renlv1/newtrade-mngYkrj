<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/helpCenter" class="title-m">帮助中心 </router-link>
        <span v-if="$route.query.title"> / 详情</span>
        <span v-else> / 新增帮助</span>
      </div>
      <div class="btn-right">
        <span class="pay-money" v-if="id" @click="btnChange()">{{status === 1 ? '标为无效' : '标为有效'}}</span>
        <div class="btn-save" @click="btnSave()">保存</div>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w ">
        <li class="li-item search">
          <div class="search-box">
            <div class="label">标题</div>
            <div class="input-wrap"><input v-model="titleValue"></div>
          </div>
        </li>
        
        <li class="li-item search">
          <div class="search-box">
            <div class="label">内容</div>
            <div class="input-wrap editor-wrap">
              <quillEditor v-model="content"
                           ref="myQuillEditor"
                           @change="onEditorChange($event)"
                           :options="editorOption">
              </quillEditor>
              <el-upload
                :action="`${$api}/upload/uploadImg`"
                :show-file-list="false"
                :data="paramsData"
                name="myfile"
                class="upload"
                :multiple="true"
                :accept="uploadTypeOption.accept"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
                ref="editerUpload"
                with-credentials>
                <i  class="el-icon-plus avatar-uploader-icon"></i>
                <!--                <div ref="editorUpload" class="el-upload__text">{{$t('edit.t4')}}</div>-->
              </el-upload>
              <div class="textNumber">{{textNum}} / 200</div>

            </div>
          </div>
        </li>
        
      </ul>
<!--      <div class="cont-w">-->
<!--        <div class="label">内容：</div>-->
<!--        <quill-editor v-model="content"-->
<!--                      ref="myQuillEditor"-->
<!--                      :options="editorOption">-->
<!--        </quill-editor>-->
<!--&lt;!&ndash;        <VueUeditorWrap></VueUeditorWrap>&ndash;&gt;-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  // import VueUeditorWrap from '../../../components/vueUeditor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  
  import {  quillEditor } from 'vue-quill-editor'
  import * as Quill from 'quill'
  
  import VideoBlot from '@/plugins/customVideo'
  import AudioBlot from '@/plugins/customAudio'
  // 自定义字体大小
  let Size = Quill.import('attributors/style/size')
  Size.whitelist = ['18px', '12px', '14px', '16px',  '20px', '24px', '36px']
  Quill.register(VideoBlot, true);
  Quill.register(AudioBlot, true);
  Quill.register(Size, true)
  
  var Parchment = Quill.import('parchment');
  // 定义
  let LineHeightClass = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1.5', '1.75', '2', '3', '4', '5']
  }
  let LineHeightStyle = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1.5', '1.75', '2', '3', '4', '5']
  }
  let LetterSpaceClass = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1', '0', '0.5', '2']
  }
  let LetterSpaceStyle = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1px', '0', '0.5px',  '2px']
  }
  var lineHtClass = new Parchment.Attributor.Class('line-height', 'ql-line-height', LineHeightClass);
  var lineHtStyle = new Parchment.Attributor.Style('line-height', 'line-height', LineHeightStyle);
  var LetterClass = new Parchment.Attributor.Class('letter-spacing', 'ql-letter-spacing', LetterSpaceClass);
  var LetterStyle = new Parchment.Attributor.Style('letter-spacing', 'letter-spacing', LetterSpaceStyle);
  Parchment.register(lineHtClass);
  Parchment.register(lineHtStyle);
  Parchment.register(LetterClass);
  Parchment.register(LetterStyle);
  
  Quill.register(Parchment, true)

  export default {
    name: "helpDetail",
    data() {
      return{
        uploadTypeOption: {
          accept: '.jpg,.JPG,.png,.PNG,.jpeg,.JPEG'
        },
        id: this.$route.query.id,
        status: Number(this.$route.query.status),
        content: this.$route.query.content ?  this.$route.query.content: '',//内容
        titleValue:  this.$route.query.title ?  this.$route.query.title: '',//标题
        uploadType: 1, // 1: 图片，2: 视频，3: 音频
        editorOption: {
          modules: {
            toolbar: {
              container: [
                [
                  // {'size': Size.whitelist},
                  {'color': [] },
                  // {'color': [] }, { 'background': []},
                  'bold',
                  'italic',
                  'underline',
                  { 'align': [] },
                  { 'list': 'ordered'},
                  { 'list': 'bullet' },
                  // {'line-height': LineHeightStyle.whitelist},
                  // {'letter-spacing': LetterSpaceStyle.whitelist},
                  // { 'indent': '-1'}, { 'indent': '+1' }
          
                ],
                ['image'],
                // ['image','video', 'link']    //上传图片、上传视频
              ],
              // handlers: {
              //   'image': () => {
              //     this.beforeUpload()
              //   },
              // }
            }
          },
          placeholder: '编辑内容..',
        },
        textNum: 0,
      }
    },
    computed: {
      paramsData() {
        let params = {
          sourceType: 2
        }
        return params
      }
    },
    created(){
      if(this.id){
        let reTag = /<img(?:.|版\s)*?>/g; // 过滤掉img标签
        let imgReg = /<img.*?(?:>|\/>)/gi;
        let arr = this.$route.query.content.match(imgReg);  // arr 为包含所有img标签的数组
        let cont = this.$route.query.content.replace(reTag,'') // 过滤掉img标签的剩余内容
        if(arr && arr.length > 0) {
          this.textNum = cont.length + arr.length // 字数
        } else {
          this.textNum = cont.length // 字数
        }
      }
    },
    methods: {
      // 监听输入事件
      onEditorChange(event){
        event.quill.deleteText(200, 4) // 编辑文字在100字以内
        if(this.content === ''){
          this.textNum = 0
        } else {
          this.textNum = event.quill.getLength() - 1 //检索返回编辑器的内容长度
        }
      },
      // 上传成功
      uploadSuccess(res) {
        // let random = 'c' + new Date().getTime()
        this.insertEmbed(res.data.resultList[0].fileUrl)
      },
      insertEmbed (url) {
        if (!url) return
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection(true).index
        quill.insertEmbed(length, 'image', url)
        quill.setSelection(length + 1)
      },
      // 上传前回调的函数
      beforeUpload(file){
        const isImg = file.type.includes('image') && !file.type.includes('gif')
        const size = file.size / 1024 / 1024
        const maxSize = 100
        let res = true
        if (!isImg) {
          this.$message.error('只能上传图片文件!')
          res = false
        }
        if (size > maxSize) {
          this.$message.error(`文件大小不能超过 ${maxSize}MB!`)
          res = false
        }
        return res
      },
      // 改变状态
      btnChange() {
        let content = ''
        if(this.status === 1) {
          content = '确定标为无效'
        } else if (this.status === 2) {
          content = '确定标为有效'
        }
        Dialog({
          title: '',
          content: content,
          okFn: () => {
            this.$fetch.post('/user/help/updateHelpCenter',{
              id: this.id,
              status: this.status === 1 ? 2: 1 //状态 1有效 2无效
            }).then(res => {
              if(res.msg === '修改成功') {
                this.status = this.status === 1 ? 2: 1
                Dialog({
                  title: '',
                  content: res.msg,
                })
              }
            })
          }
        })
      },
      //保存
      btnSave() {
        if(!this.titleValue) {
          this.$message.error('请输入标题')
          return
        }
        if(!this.content) {
          this.$message.error('请输入内容')
          return
        }
        let url = ''
        this.id ? url = '/user/help/updateHelpCenter' : url =  '/user/help/addHelpCenter'
        this.$fetch.post(url,{
          id: this.id,
          title: this.titleValue,//标题
          content: this.content//内容
        }).then(res => {
          if(res.code === 0) {
            Dialog({
              title: '',
              content: res.msg
            })
          }
        })
      },
    },
    components: {
      quillEditor,
      // VueUeditorWrap
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .editor-wrap{
    position relative
    width 80%
    height 450px
    .textNumber{
      position absolute
      right 12px
      bottom 40px
    }
    .upload{
      .el-upload{
        .el-icon-plus{
          opacity 0
          height 24px
          width 28px
          position absolute!important
          left 220px!important
          top 11px!important
        }
      }
    }
  }
  .quill-editor{
    height: calc(100% - 66px);
  }
  .zoom-enter-to{
    transition: none;
  }
  .label{
    white-space: nowrap;
    margin-right: 60px;
  }
  .search-box{
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }
.quill-editor{
  width: 100%;
}
</style>
