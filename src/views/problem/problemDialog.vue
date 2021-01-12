<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible" @click="quicklySendShow = false">
      <div class="g-dialog-mask"></div>
      <div class="g-dialog-wrap content-wrap" :class="{'height-a': isShow}">
        <i class="g-dialog-close el-icon-close" @click="cancelCallback"></i>
        <div class="g-dialog-title" ><i class="el-icon" v-show="warningShow"></i> <span  v-show="isShow">问题反馈（{{tabId}}）</span></div>
        <div class="g-dialog-content">
          <div v-show="isShow" class="content-p  first-cont">
            <div v-for="(item, index) in problemFeedBack" :key="index" class="list-bold">
              <div class="p-content">
                <div class="name" :class="{'author': item.isAuthor === 2}">{{userNameFn(item)}}</div>
                <span class="time-a">{{item.createTime}}</span>
              </div>
              <div>
                <pre>{{item.content}}</pre>
              </div>
              <ul class="img-uls" v-if="item.imageUrl && item.imageUrl.length > 0">
                <viewer :images="proImgA(item.imageUrl)" class="img-list">
                  <div class="bg-a" v-for="(src, index) in proImgB(item.imageUrl)" :key="index"
                       :style="{backgroundImage: 'url( '+ src.url +')'}" >
                    <img  :src="src.url" @load="loadImg(index, proImgB(item.imageUrl))" ref="imgLoad">
                  </div>
                </viewer>
              </ul>
            </div>
            <div class="list-bold">
              <div class="p-content">
                <div class="name">{{problem.userName}}</div>
                <span class="time-a">{{problem.createTime}}</span>
              </div>
              <div>
                <pre>{{problem.content}}</pre>
              </div>
              <ul class="img-uls" v-if="problem.imageUrl && problem.imageUrl.length > 0">
                <viewer :images="problemImg" class="img-list">
                  <div class="bg-a" v-for="(src, index) in problemImg" :key="index"
                       :class="{'loading-m-a': src.flag}"
                       :style="{backgroundImage: 'url( '+ src.url +')'}" >
                    <img  :src="src.url" @load="loadImgA(index)" ref="imgLoad2">
                  </div>
                </viewer>
              </ul>
            </div>
          </div>
        </div>
<!--        -->
        <div class="ctrl-box">
          <div class="textarea"  :class="{'textarea-a': !isShow}">
            <textarea v-model="textContent"  @input="textareaVal"></textarea>
            <div class="warm-num">
              <div>
                <span class="text-count">{{descNum}}</span>/<span>{{maxNum}}</span>
              </div>
              <div class="a-w" @click.stop>
                <div class="send-lang" @click="quicklySendShow = !quicklySendShow">
                  <img src="@img/PC/send-icon.svg" alt="">
                </div>
                <ul class="quickly-content" v-show="quicklySendShow">
                  <li class="item" v-for="(item,index) in languageList" :key="index" @click="sendFn(item)">{{item.content}}</li>
                </ul>
              </div>

            </div>
          </div>
<!--          图片上传-->
          <ul class="uls-a">
            <li v-for="(img, m) in imglist" :key="m"  class="list-a">
              <div class="delete" @click="deleteImg(m)">
                <img src="@img/PC/delete_img.svg" alt="">
              </div>
              <div  :style="{backgroundImage: 'url( '+ img +')'}" class="img-t" @click="bigImgFn(img)"></div>
            </li>
            <div class="loading-a" v-show="loadingShow">
              <img src="@img/loading2.gif" alt />
            </div>
            <div class="add-img" v-show="imglist.length < 4">
              <input type="file" class="file-a" @change="uploadImg" ref="uploadFile"   accept="image/jpeg,image/png,image/gif,image/jpg">
              <img src="@img/PC/add_img.svg" alt="">
            </div>
          </ul>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="okCallback" :class="{'disable': disableBtn}">回复</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
	import {compress, dataURItoBlob} from '@/assets/js/upload'
	import Dialog from '@/components/dialog/dialog'
	import { Message } from 'element-ui'
  export default {
    data() {
      return {
	      problemImg: [],
	      disableBtn: false,
	      bigImg: '',
	      quicklySendShow: false,
	      srcList: [this.bigImg, this.bigImg],
	      bigImgShow: false,
	      imglist2: [],
	      imglist: [],
	      loadingShow: false,
	      problem: {},
	      problemFeedBack: [],
	      textContent: '',
        visible: false,
	      descNum: 0,
	      languageList: [],
	      maxNum: 200
      }
    },
    props: {
	    idArr: Array, // 批量操作id
	    isShow: Boolean, // 是否批量操作
    	tabId: Number,
      type: String,
      title: String,
      content: String,
      okFn: Function,
      okText: String,
      cancelFn: Function,
      cancelText: String,
      align: String,
      warningShow: Boolean,
    },
    watch: {
	    visible: function (newval) {
	    	if (newval === true && this.isShow === true) {
			    document.body.style.overflow = 'hidden'
			    this.imglist2 = []
			    this.imglist = []
			    this.textContent = ''
          this.descNum = 0
          this.problem = {}
			    this.problemFeedBack = []
			    this.getA()
          this.getLanguage()
        }
	    }
    },
    methods: {
	    loadImgA (index) {
		    this.problemImg[index].flag = false
      },
	    loadImg (index, imgArr) {
		    imgArr[index].flag = false
	    },
	    clickFN (e) {
	    	//console.log(e)
      },
	    hideF () {
      },
	    sendFn (item) {
		    this.textContent = this.textContent + item.content
        this.descNum = this.textContent.length
		    if (this.textContent.length > this.maxNum) {
			    this.descNum = this.maxNum
			    this.textContent = this.textContent.substring(0, this.maxNum)
		    }
        this.quicklySendShow = false
      },
	    getLanguage () {
		    this.$fetch.post(`/user/problem/queryLanguageList`,{
			    pageIndex: 1,
			    pageSize: 20
		    }).then(res =>{
			    if (res.code === 0) {
				    this.languageList  = res.data.page.list
			    }
		    })
	    },
	    bigImgFn (img) {
		    this.bigImg = img
        this.bigImgShow = true
      },
	    userNameFn (item) {
	    	if (item.isAuthor === 2) {
	    		return  '系统回复'
        } else {
	    		return item.userName
        }
      },
	    maxstringload(str) {
		    var obj={};
		    for(var i=0;i<str.length;i++){
			    var key=str[i];//key中存储的是每一个字符串
			    if(obj[key]){//判断这个键值对中有没有这个键
				    obj[key]++;
			    }else{
				    obj[key]=1;//obj[w]=1
			    }
		    }

		    var maxCount=0;//假设是出现次数最多的次数
		    var maxString="https://rraystudio.blob.core.windows.net/";//假设这个字符串是次数出现最多的字符串
		    for(var key in obj){
			    if(maxCount<obj[key]){
				    maxCount=obj[key];//保存最大的次数
				    maxString=key;
			    }
		    }
		    return maxCount
	    },
    	deleteImg (index) {
		    this.imglist.splice(index, 1)
		    this.imglist2.splice(index, 1)
      },
	    async uploadImg () {
		    let input = document.querySelector('.file-a')
		    let file
		    let imgVal = this.$refs.uploadFile
		    file = imgVal.files[0]
		    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
			    imgVal.value = ''
			    Message.error('图片仅支持png、jpeg、jpg、gif')
			    return
		    }
		    if (this.imglist.length > 3) {
			    Message.error('最多上传4张')
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
	    // 输入文字控制
	    textareaVal () {
		    this.descNum = this.textContent.length
		    if (this.textContent.length > this.maxNum) {
			    this.descNum = this.maxNum
			    this.textContent = this.textContent.substring(0, this.maxNum)
		    }
	    },
    	show () {
    		this.visible = true
		    document.body.style.overflow = 'hidden'
        // this.getA()
      },
      proImgA (imgArr) {
	    	if (imgArr.length > 0) {
          let arr = []
          imgArr.forEach((item) => {
            let str = item.replace('https://rraystudio.blob.core.windows.net/', '')
            if (str.indexOf('http') > -1){
            	arr.push(str)
            } else {
	            arr.push('https://rraystudio.blob.core.windows.net/' + str)
            }
          })
          return arr
	    	}
      },
	    proImgB (imgArr) {
		    if (imgArr.length > 0) {
			    let arr = []
			    imgArr.forEach((item) => {
				    let str = item.replace('https://rraystudio.blob.core.windows.net/', '')
				    if (str.indexOf('http') > -1){
					    arr.push({
                flag: true,
                url: str
              })
				    } else {
					    arr.push({
						    flag: true,
						    url: 'https://rraystudio.blob.core.windows.net/' + str
					    })
				    }
			    })
			    return arr
		    }
      },
    	getA () {
        this.$fetch.post(`/system/feedBack/queryProblemReply`, {
	        id: this.tabId
        }).then((res) => {
          if (res.code === 0) {
          	this.problem = res.data.problem
            this.problemImg = this.proImgB(res.data.problem.imageUrl)
            this.problemFeedBack = res.data.problemFeedBack.reverse()
          }
        })

      },
      okCallback() {
	    	//   /system/feedBack/replyProblem
	      if (this.textContent === '') {
		      Message.error('请输入内容')
		      return
	      }
	      let dataObj = {
		      plainText: this.textContent, //	String	文本内容
		      imgUrls: this.imglist2.join(','), //	String	回复图片(多个用，分割)
        }
	      if (this.isShow === true) { // //	String	回复反馈id(批量回复用，隔开)
	      	dataObj.problemId = this.tabId
        } else {
		      dataObj.problemId = this.idArr.join(',')
        }
	      this.disableBtn = true
	      this.$fetch.post(`/system/feedBack/replyProblem`, dataObj).then((res) => {
		      this.disableBtn = false
		      if (res.code === 0) {
			      Dialog({
				      content: res.msg,
              okFn: () => {
	              this.cancelCallback()
	              this.okFn && this.okFn()
                this.$emit('okDialog')
              }
			      })
		      }
	      })
      },
      cancelCallback() {
        this.visible = false
        document.body.style.overflow = ''
	      this.imglist2 = []
	      this.imglist = []
	      this.textContent = ''
        this.problemFeedBack = []
	      this.problem = {}
	      this.descNum = 0
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @btnColor: #1962df;
  @btnCancel: #ddd;
  .demo-image__preview{
    /deep/ img{
      width: 80%;
    }
  }
  .g-dialog-btn{
    &.disable{
      pointer-events: none;
    }
  }
  .a-w{
    position: relative;
    .send-lang{
      cursor: pointer;
    }
    .quickly-content{
      position: absolute;
      left: -400px;
      top: -300px;
      width: 400px;
      height: 300px;
      overflow: auto;
      border: 1px solid #e7effc;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
      .item{
        font-size: 16px;
        line-height: 1.5;
        padding: 0 10px;
        margin-bottom: 10px;
        cursor: pointer;
        &:hover{
          color: #1962df;
          background-color: rgba(0,0,0,.03);
        }
      }
    }
  }
  .g-dialog {
    .g-dialog-wrap {
      text-align: left;
      width: 1000px;
      height: 440px;
      &.height-a{
        height: 700px;
      }
      .ctrl-box{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0 40px 20px 40px;
        background-color: #fff;
      }
      .g-dialog-content{
        padding: 0;
        max-height: none;
        overflow-x: initial;
        .content-p{
          height: 350px;
          overflow: auto;
        }
        .p-content{
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          pre{
            flex: 1;
          }
          .time-a{
            color: #999;
            margin: 0 20px;
          }
        }
        .img-uls{
          display: flex;
          align-items: center;
          margin: 20px 0 30px;
          img{
          }
          .img-list{
            width: 100%;
            margin-right: 20px;
            display: flex;
            align-items: center;
            .bg-a{
              width: 100px;
              height: 100px;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              margin-right: 20px;
              &.loading-m-a{
                background-image: url("../../assets/img/loading.gif");
                background-size: 30px;
              }
              img{
                opacity: 0;
              }
            }
            img{
              height: 100px;
              cursor: pointer;
              width: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20px;
            }
            /deep/ .el-image{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              &:focus, div:focus{
                outline: none;
                border: none;
              }
              img{
                height: auto;
              }
              .el-icon-circle-close{
                color: #fff;
              }
              .el-image-viewer__canvas{
                cursor: move;
              }
            }
          }
        }
        .reply-text{
          color: #1962df;
          font-size: 14px;
          padding: 30px 0 10px;
        }
        .list-bold{
          border-top: 1px solid #e7effc;
          padding-right: 20px;
          &.first-cont{
            border-top: none;
          }
          pre{
            padding-bottom: 10px;
          }
        }
        .name{
          font-size: 18px;
          font-weight: bold;
          &.author{
            font-weight: bold;
            color: #1962df;
          }
        }
        pre{
          white-space: pre-wrap;
        }
        .line{
          border-top: 1px solid #e7effc;
          position: relative;
          &.line-t{
            margin-top: 30px;
          }
          .left-line{
            position: absolute;
            top: -1px;
            left: 0;
            width: 20px;
            height: 3px;
            background-color: #1962df;
          }
        }
      }
      .textarea{
        width: 100%;
        height: 100px;
        padding: 10px 20px 10px 20px;
        border: 1px solid rgba(0,0,0,.1);
        box-shadow: 0 0 4px rgba(0,0,0,.1);
        margin: 20px auto 0;
        &.textarea-a{
          height: 200px;
          textarea{
            height: 150px;
          }
        }
        textarea{
          display: block;
          width: 100%;
          height: 50px;
          margin-right: 8px;
          font-size: 14px;
          border: none;
          resize:none;
        }
        .warm-num{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .g-dialog-btn{
        margin: 0;
      }
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
      .uls-a{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 20px;
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
    }

     .img-big-dialog{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      background-color: rgba(0,0,0,.5);
      .img-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        text-align: center;
        img{
          max-width: 80%;
        }
      }
     }

  }

</style>
