<template>
    <div class="c-page mar-right">
        <div class="wrap">
            <div class="crumb">
                <span> <span class="back" @click="$router.push('/system/notice')">公告</span> / <span class="tit">新增</span></span>
                <div class="preserve" @click="newAdd">保存</div>
            </div>
            <div class="main-content">
                <div class="search-box">
                    <div class="label">标题</div>
                    <div class="input-wrap"><input v-model.trim="title" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">小标题</div>
                    <div class="input-wrap"><input v-model.trim="smalltitle" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">状态</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleStats">
                            <span class="el-dropdown-link">
                              {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="item" v-for="(item,index) in activeEnum" :key="index">{{item.text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">类型</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleType">
                            <span class="el-dropdown-link">
                              {{typeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="item" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">备注</div>
                    <div class="input-wrap"><input v-model.trim="remark" type="text"></div>
                </div>
                <div class="quill-editor">
                    <div class="label">内容</div>
                    <div class="editor">
                        <quillEditor v-model="content"
                                     ref="myQuillEditor"
                                     @change="onEditorChange($event)"
                                     :options="editorOption">
                        </quillEditor>
                        <div class="textNumber">{{textNum}} / 200</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  // import {  quillEditor } from '../../../components/quillEditor'
  import Dialog from '@/components/dialog/dialog'
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
    data() {
      return {
        title: '',
        activeEnum: [],
        typeEnum: [],
        statusText: '',
        giveStatus: '',
          typeText: '',
          typeId: '',
          smalltitle: '',
          remark: '',
        content: '',
        textNum: '0',
        editorOption: {
          modules: {
            toolbar: {
              container: [
                [
                  {'color': [] },
                  'bold',
                  'italic',
                  'underline',
                  { 'align': [] },
                  { 'list': 'ordered'},
                  { 'list': 'bullet' }
                ],
              ],
            }
          },
          placeholder: '编辑内容..',
        },
      }
    },
    computed: {
      paramsData () {
        let params = {
          sourceType: 2
        }
        return params
      }
    },
    created() {
      this.getType()
    },
    mounted() {
    },
    methods: {
      // 初始化时，已经绑定了 quill 的 editor-change 方法
      // quill.on('editor-change', this.onEditorChange)，实时监听富文本内容即可。
      // 所以，quill 的内容变动，都会调用这个方法
      onEditorChange(event){
        event.quill.deleteText(200, 4)// 编辑文字在100字以内
        if(this.content === ''){
          this.textNum = 0
        } else {
          this.textNum = event.quill.getLength() - 1//检索返回编辑器的内容长度
        }
      },
      handleStats (command) {
        this.statusText = command.text
        this.giveStatus = command.id
      },
        handleType(command) {
            this.typeText = command.text
            this.typeId = command.id
        },
      getType () {
        this.$fetch.get(`public/enumValue?classPackage=system.Notice$TypeEnum;system.Notice$ActiveEnum&flag=true&state=1`).then((res) => {
          if (res.code === 0) {
            this.typeEnum = res.data.data.TypeEnum
            this.activeEnum = res.data.data.ActiveEnum

              this.typeEnum.forEach((item) => {
                  if (parseInt(this.createdType) === parseInt(item.id)) {
                      this.typeText = item.text
                  }
              })
            this.activeEnum.forEach((item) => {
              if (parseInt(this.createdStatus) === parseInt(item.id)) {
                this.statusText = item.text
              }
            })
          }
        })
      },
      newAdd () {
        let contentText = this.content.replace(/<\/?p[^>]*>/gi,'')
        let active = parseInt(this.giveStatus, 10) >= 0 ? parseInt(this.giveStatus, 10) : ''
        let typeId = parseInt(this.typeId, 10) >= 0 ? parseInt(this.typeId, 10) : ''
        this.$fetch.post(`/system/notice/addNotice`,{
          title: this.title,
          smalltitle: this.smalltitle,
          remark: this.remark,
          active: active,
          type: typeId,
          content: contentText,
        }).then(res => {
           if (res.code === 0) {
             Dialog({
               title: res.msg,
               okFn: () => {
                 this.$router.push('/system/notice')
               }
             })
           }
        })
      }
    },
    components: {
      quillEditor
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/css/var.less";
.main-container {
   //padding: 34px 20px 0;
    .wrap {
        .crumb{
            display: flex;
            align-items: center;
            justify-content: space-between;
            right: 0;
            left: 0;
            padding: 20px;
            color: #b7b9c1;
            .tit{
                color: @text;
            }
            .preserve{
                width: 90px;
                height: 34px;
                line-height: 34px;
                color: @white;
                text-align: center;
                background-color: #2176ff;
                border-radius: 2px;
                cursor: pointer;
            }
            .back{
                cursor: pointer;
                &:hover{
                    color: @text;
                }
            }
        }
        .main-content{
          background-color: @white;
          min-height: calc(100vh - 174px);
          padding: 24px 40px 0 24px;
          .search-box{
            height: 34px;
            line-height: 34px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 14px;
            color: @text;
            &:nth-child(1){
                margin-top: 0;
            }
            &:nth-child(-n+4){
               .input-wrap{
                   border: none;
               }
            }
            .label{
                width: 58px;
            }
            .input-wrap{
                margin-left: 40px;
                width: 300px;
                height: 34px;
                line-height: 34px;
                border-radius: 2px;
                border: 1px solid @border !important;
                padding: 0 10px;
                input{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    border: none;
                    padding: 0;
                    border-radius: 0;
                    font-size: 14px;
                }
            }
            .dropdown-wrap{
              display: inline-block;
              width: 300px !important;
              height: 100% !important;
                .el-dropdown{
                    width: 100%;
                    height: 100%;
                    line-height: 34px;
                    span{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                }
            }
          }
          .quill-editor{
              height: auto;
              position: relative;
              .label{
                  width: 58px;
              }
              .editor{
                  position: absolute;
                  left: 98px;
                  top: 0;
                  width: 800px;
                  @media screen and (max-width: 1200px) {
                      width: 600px;
                      .quill-editor{
                          height: 250px;
                      }
                  }
                  .quill-editor{
                      height: 250px;
                  }
                  .ql-container{
                    height: calc(100% - 66px) !important;
                  }
                  /deep/ .upload{
                      /deep/ .el-upload{
                          /deep/ .el-icon-plus{
                              opacity: 0 !important;
                              height: 24px;
                              width: 28px;
                              position: absolute!important;
                              left: 220px!important;
                              top: 11px!important
                          }
                      }
                  }
              }
          }
        }
    }
}
</style>
