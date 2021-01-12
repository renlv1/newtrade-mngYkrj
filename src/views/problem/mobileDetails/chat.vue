<template>
  <div   class="" @click.stop  @touchmove.prevent="">
    <transition name="dialog">
      <div class="dialog"  @click="hide($event)"  v-if="merchantShow" @touchmove.prevent=""></div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" :class="{'android-dialog': isAndroid}" v-if="merchantShow" @touchmove.prevent="" @click="quicklySendShow = false">
        <div class="message-box">
          <div class="border-a">
            <div class="border-t"></div>
          </div>
          <div class="content-t">
            <div class="title-a">回复反馈</div>
            <div class="textarea-t">
              <textarea class="textarea" v-model="textContent" placeholder="输入回复内容..."  @input="textareaVal" @focus="focusFn"  @blur="blurFn"></textarea>
              <div class="warm-num">
                <div>
                  <span class="text-count">{{descNum}}</span>/<span>{{maxNum}}</span>
                </div>
                <div class="a-w" @click.stop>
                  <div class="send-lang" @click="quicklySendShow = !quicklySendShow">
                    <img src="@img/PC/send-icon.svg" alt="">
                  </div>
                  <div class="quickly-content"  v-if="quicklySendShow">
                    <cube-scroll :data="languageList">
                      <li class="item" v-for="(item,index) in languageList" :key="index" @click="langFn(item)">{{item.content}}</li>
                    </cube-scroll>
                  </div>
                </div>
              </div>
            </div>
            <!--          图片上传-->
            <ul class="flex-uls">
<!--              <li v-for="(img, m) in imglist" :key="m"  class="list-a">-->
<!--                <div class="delete" @click="deleteImg(m)">-->
<!--                  <img src="@img/PC/delete_img.svg" alt="">-->
<!--                </div>-->
<!--                <div  :style="{backgroundImage: 'url( '+ img +')'}" class="img-t" @click="bigImgFn(img)"></div>-->
<!--              </li>-->
              <viewer :images="imglist" v-show="imglist.length > 0"  class="uls-a">
                <div v-for="(src, m) in imglist" :key="src" class="list-a" >
                  <div class="delete" @click="deleteImg(m)"></div>
                  <img :src="src" class="img-t">
                </div>
              </viewer>
              <div class="loading-a" v-show="loadingShow">
                <img src="@img/loading2.gif" alt />
              </div>
              <div class="add-img" v-show="imglist.length < 4">
                <input type="file" class="file-a" @change="uploadImg" ref="uploadFile"  accept="image/jpeg,image/png,image/gif,image/jpg">
                <img src="@img/PC/add_img.svg" alt="">
              </div>
            </ul>
          </div>
        </div>
        <div class="send-box" @click="sendFn()" :class="{'disable-t': disableBtn}">
          <img src="@img/loading.gif" alt="" v-show="disableBtn">
          <span>提交</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
	import {compress, dataURItoBlob} from '@/assets/js/upload'
  export default {
    data() {
      return {
	      isAndroid: false,
	      descNum: 0,
	      maxNum: 200,
	      quicklySendShow: false,
	      disableBtn: false,
	      imglist: [],
	      imglist2: [],
	      sendMessage:'',
        avtiveIndex: 0,
	      msgArr: [],
	      textContent: '',
	      loadingShow: false,
      }
    },
    props: {
      merchantShow: Boolean, // 显示隐藏
	    tabId: Number,
	    languageList: Array
    },
    mounted () {
    },
    watch: {
	    merchantShow: function (newval) {
        if (newval === true) {

	        window.addEventListener('touchmove',function(e){
		        let target = e.target
		        if(target && target.tagName === 'TEXTAREA'){
			        e.stopPropagation();
		        }
	        },true)
        }
	    }
    },
    methods: {
	    focusFn () {
		    var u = navigator.userAgent, app = navigator.appVersion;
		    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // Android
      },
      blurFn () {
		    this.isAndroid = false
      },
	    langFn (item) {
		    this.textContent = this.textContent + item.content
		    this.descNum = this.textContent.length
		    if (this.textContent.length > this.maxNum) {
			    this.descNum = this.maxNum
			    this.textContent = this.textContent.substring(0, this.maxNum)
		    }
		    this.quicklySendShow = false
      },
	    deleteImg (index) {
		    this.imglist.splice(index, 1)
		    this.imglist2.splice(index, 1)
	    },
	    // 输入文字控制
	    textareaVal () {
		    this.descNum = this.textContent.length
		    if (this.textContent.length > this.maxNum) {
			    this.descNum = this.maxNum
			    this.textContent = this.textContent.substring(0, this.maxNum)
		    }
	    },
	    async uploadImg () {
		    let input = document.querySelector('.file-a')
		    let file
		    let imgVal = this.$refs.uploadFile
		    file = imgVal.files[0]
		    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
			    imgVal.value = ''
			    this.$Message.error('图片仅支持png、jpeg、jpg、gif')
			    return
		    }
		    if (this.imglist.length > 3) {
			    this.$Message.error('最多上传4张')
			    return
		    }
		    if (file.size / 1048576 <= 50) {
			    this.$nextTick(() => {
				    this.finishFn(file)
				    // this.option.img = URL.createObjectURL(file)
				    // this.$refs.myPopup.show()
			    })
			    input.value = ''
			    //  上传视频
		    }
	    },
	    finishFn (f) {
		    // 小于500k直接上传
		    this.loadingShow = true
		    if(f.size <= 1024 * 500){
			    this.postImg(f);
			    return
		    }
		    let self = this;
		    //去获取拍照时的信息，解决拍出来的照片旋转问题
		    // 看支持不支持FileReader
		    // if (!f || !window.FileReader) return;

		    // 创建一个reader
		    let reader = new FileReader();
		    // 将图片2将转成 base64 格式
		    reader.readAsDataURL(f);
		    // 读取成功后的回调
		    reader.onloadend = function () {
			    let result = this.result;
			    let img = new Image();
			    img.src = result;
			    //判断图片是否大于100K,是就直接上传，反之压缩图片
			    img.onload = function () {
				    let data = compress(img);
				    let fileCompress = dataURItoBlob(data);
				    self.postImg(fileCompress);
			    }
		    }
	    },
	    postImg (f) {
		    let formData = new FormData()
		    formData.append('myfile', f)
		    formData.append('sourceType', '2')
		    this.$fetch.postFormdata(`${this.$api}/upload/uploadImg`, formData).then((res) => {
			    this.loadingShow = false
			    if (res.code === 0) {
				    this.imglist.push(res.data.resultList[0].fileUrl);
				    this.imglist2.push(res.data.resultList[0].fileName);
			    }
		    }).catch(err => {
		    })
	    },
	    // 提交反馈
	    sendFn() {
		    //   /system/feedBack/replyProblem
		    if (this.textContent === '') {
			    this.$Message.error('请输入内容')
			    return
		    }
		    let dataObj = {
			    plainText: this.textContent, //	String	文本内容
			    imgUrls: this.imglist2.join(','), //	String	回复图片(多个用，分割)
			    problemId: this.tabId
		    }
		    this.disableBtn = true
		    this.$fetch.post(`/system/feedBack/replyProblem`, dataObj).then((res) => {
			    this.disableBtn = false
			    if (res.code === 0) {
				    this.quicklySendShow = false
				    this.textContent = ''
				    this.descNum = 0
				    this.imglist2 = []
				    this.imglist = []
				    this.$emit('hideDialog', 'ok')
			    }
		    })
	    },
      hide () {
	    	this.quicklySendShow = false
	      this.$emit('hideDialog')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog,.wrap-t
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 1000
    background-color: rgba(0,0,0, .4)
    &.wrap-t
      z-index: 1500
    &.no-click
      pointer-events none
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1
  .dialog-w
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    padding: 0 20px 30px 20px
    overflow: auto
    z-index: 1200
    transform translate3d(0,0,0)
    background-color: #fff
    border-radius .6rem .6rem 0 0
    display: flex
    flex-direction column
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0,100%,0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0,0,0)
    &.android-dialog
      bottom: -100px
    .uls
      .list
        cursor pointer
        width: 100%
        height: 1.2rem
        display: flex
        align-items center
        justify-content center
        color #000
        font-size: .32rem
        border-bottom: 1px solid #e6e6e6
        &.active-list
          color #ff004e
  .message-box
    padding: 40px 0 0 0
    flex 1
    display: flex
    flex-direction column
    .content-t
      .title-a
        font-size: 16px
        color #000
      .textarea-t
        width: 100%
        height: 200px
        border: 1px solid #a8a8a8
        margin: 12px 0 15px
        .warm-num{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px
        }
        .a-w{
          position: relative;
          .send-lang{
            cursor: pointer;
          }
          .quickly-content{
            position: absolute;
            right: -30px
            top: -200px;
            width 360px
            height: 200px
            max-height: 200px
            z-index: 100
            overflow: hidden;
            border: 1px solid #e7effc;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,.3);
            padding: 10px 0
            >>> .cube-scroll-list-wrapper{
              min-height 200px !important
            }
            >>> .cube-scroll-wrapper{
              z-index: 200
            }
            .ul-t{
              padding: 10px 0
            }
            .item{
              font-size: 14px;
              line-height: 1.5;
              padding: 10px 10px;
              margin-bottom: 5px;
              cursor: pointer;
              border-bottom: 1px solid #eee
              &:hover{
                color: #1962df;
                background-color: rgba(0,0,0,.03);
              }
            }
          }
        }
        .textarea
          width: 100%
          height: 160px
          padding: 10px
          resize none
          outline none
          border: none
          box-sizing border-box
          font-size: 14px
          line-height: 1.5
    .add-img{
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
      .file-a{
        position: absolute;
        left: 0;
        width: 60px;
        height: 60px;
        opacity: 0;
        font-size: 80px;
      }
      img{
        width: 60px;
      }
    }
    .flex-uls{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 20px;
      margin-bottom: 10px
    }
    .loading-a{
      width: 60px;
      height: 60px;
      margin-right: 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.loading-m{
        margin-right: 0;
      }
      img{
        width: 60px;
        display: block;
      }
    }
    .uls-a{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .list-a{
        width: 60px;
        height: 60px;
        margin-right: 20px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .img-t{
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .delete{
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
          background: url("../../../assets/img/PC/delete_img.svg") no-repeat center / cover
          width: 20px
          height: 20px
          &::after{
            content: "";
            position: absolute;
            left: -5px;
            top: -5px;
            right: -5px;
            bottom: -5px;
          }
        }
        .img-a{
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
    .border-a
      position: fixed
      left: 0
      top: 0
      width: 100%
      padding: 10px 0 20px
      .border-t
        margin: 0 auto
        width: 60px
        height: 5px
        background-color: #4d4d4d
        border-radius 4px
  .send-box
    width 100%
    height: 50px
    display flex
    align-items center
    justify-content center
    z-index 100
    cursor pointer
    color #fff
    font-size: 16px
    background-color: #1962ff
    &.disable-t
      background-color: #a8a8a8
      color #000
    img
      width: 30px
      display: block
      margin-right: 10px
</style>
