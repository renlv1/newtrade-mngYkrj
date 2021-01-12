<template>
  <div class="c-page mar-right transaction-list">
    <div class="crumb detail-page">
      <div class="title-left">
        <router-link to="/user/userFeedProblem" class="title-m">后台转账日志 </router-link>
        <span> / 回复问题</span>
      </div>
      <div class="btn-right">
        <span class="btn-save" @click="replyBtn()">回复</span>
      </div>
    </div>
    <div class="page-wrap detail-cont">
      <ul class="ul-w">
        <div class="ul-title">问题信息</div>
        <li class="li-item">
          <div class="li-left">订单ID</div>
          <div class="li-right">{{item.orderId}}</div>
        </li>
        <li class="li-item">
          <div class="li-left">问题</div>
          <div class="li-right">{{$contentType(item.contentType)}}</div>
        </li>
        <li class="li-item li-cont">
          <div class="li-left">历史回复</div>
          <ul class="ul-answer">
            <ul class="user-answer">
              <li class="li-answer first-answer" >
                <div class="user-box bottom-t">
                  <div class="li-user">{{userData.userName}}</div>
                  <div class="li-time">{{userData.createTime | time}}</div>
                </div>
                <div class="user-cont bottom-t"  v-html="userData.content"></div>
                <ul class="img-wrap">
                  <li class="li-img" v-for="(img,index) in userData.imageUrl" :key="index">
                    <img :src="img.imageUrl">
                  </li>
                </ul>
              </li>
            </ul>
            <ul class="reply-ul">
             <li class="li-answer"  v-for="(item,index) in problemFeedBack" :key="index">
               <div class="user-box bottom-t">
                 <div class="li-user">{{item.userName}}</div>
                 <div class="li-time">{{item.createTime | time}}</div>
               </div>
               <div class="user-cont bottom-t" v-html="item.content">
               </div>
<!--               <ul class="img-wrap">-->
<!--                 <li class="li-img" v-for="(img,index) in item.imageUrl" :key="index">-->
<!--                   <img :src="img">-->
<!--                 </li>-->
<!--               </ul>-->
             </li>
           </ul>
          </ul>
        </li>
        <div class="ul-title">回复内容</div>
        <div class="answer-wrap">
          <div class="answer-title">内容</div>
          <div class="editer-wrap">
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
      </ul>
    </div>
  </div>
</template>

<script>
  import {  quillEditor } from 'vue-quill-editor'
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
    name: "transferLogDetail",
    data() {
      return{
        uploadTypeOption: {
          accept: '.jpg,.JPG,.png,.PNG,.jpeg,.JPEG'
        },
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
        content:'',// 回复内容
        item: JSON.parse(this.$route.query.item),
        userData: '',
        problemFeedBack: [],
        textNum: 0,
      }
    },
    computed: {
      paramsData: function () {
        let params = {
          sourceType: 2
        }
        return params
      }
    },
    created() {
      this.getData()
    },
    watch: {
      // content() {
      //   // 富文本内容长度
      //   this.textNum = this.$refs.myQuillEditor.quill.getLength() - 1
      //   let numWrapper = document.querySelector('.quill-count')
      //   if(this.textNum > 200) {
      //     numWrapper.style.color = 'red'
      //   } else {
      //     numWrapper.style.color = '#666'
      //   }
      // }
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
      uploadSuccess(res) {
        this.insertEmbed(res.data.resultList[0].fileUrl)
      },
      insertEmbed (url) {
        if (!url) return
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection(true).index
        quill.insertEmbed(length, 'image', url)
        quill.setSelection(length + 1)
      },
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
      // 回复问题
      replyBtn() {
        let contentText = this.content.replace(/<\/?p[^>]*>/gi,'')
        // contentText = contentText.replace(/<[^>]+>/g, ""); //去掉所有的html标记
        this.$fetch.post('/user/problem/replyProblem',{
          problemId: this.item.id, // 问题id
          contentText: contentText, // 纯文本内容
          plainText: this.content, // 回复内容
          userName: this.item.userName,//用户名
          userAddress: this.item.userAddress,//用户地址
        }).then(res => {
          if(res.code === 0) {
            Dialog({
              title: '',
              content: res.msg
            })
          }
        })
      },
      getData() {
        this.$fetch.post(`/user/problem/queryProblemReply?id=${this.item.id}`).then(res => {
          if(res.code === 0) {
            this.userData = res.data.problem
            this.problemFeedBack = res.data.problemFeedBack
          }
        })
      }
    },
    components: {
      quillEditor,
      // VueUeditorWrap
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-upload-list{
    display none!important
  }
  .ql-toolbar{
    position relative
  }
  .editer-wrap{
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
  .dialog-input{
    width 240px!important
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
