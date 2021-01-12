<template>
    <div class="wrap langSettings">
       <div class="main">
            <div class="loading-w" v-show="loadingShow">
              <img src="@img/loading2.gif" alt="">
            </div>
           <ul class="list">
               <li class="ltem-li" v-for="(item, index) in languageList" :key="index">
                   <div class="li-l">{{item.content}}</div>
                   <div class="li-r">
                       <div class="editor" @click="editor(item)"></div>
                       <div class="del" @click="del(item, index)"></div>
                   </div>
               </li>
           </ul>
           <div class="add-lang" @click="editor(false)" v-show="!loadingShow">添加</div>
       </div>
        <transition name="dialog">
          <div class="dialog-box"  v-show="addShow">
            <div class="content-box">
                <div class="title">{{dialogText}}</div>
                <div class="textarea">
                  <textarea v-model="textContent"  @input="textareaVal"></textarea>
                  <div class="warm-num"><span class="text-count">{{descNum}}</span>/<span>{{maxNum}}</span></div>
                </div>
                <div class="btn">
                    <div class="cancel" @click="cancel">取消</div>
                    <div class="save" @click="save">保存</div>
                </div>
            </div>
          </div>
        </transition>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
	      descNum: 0,
        maxNum: 200,
      	dialogText: '编辑',
	      textContent: '',
        addShow: false,
	      loadingShow: true,
	      languageList: [],
        addType: '',
        addId: ''
      }
    },
    created() {
    	this.getType()
    },
    mounted() {
    },
    methods: {
	    getType() {
		    this.$fetch.post('/user/problem/queryLanguageList',{
			    pageIndex: 1,
			    pageSize: 20
        }).then((res) => {
        	this.loadingShow = false
			    if (res.code === 0) {
				    this.languageList = res.data.page.list
			    }
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
      cancel () {
        this.addShow = false
      },
      // 添加
      save () {
	    	if (this.textContent) {
	    		let dataObj = {
				    messageBody: this.textContent,//	String	语句内容
				    type: this.addType,//	Integer	类型 1.新增 2.修改 3.删除
          }
          let dialogText = ''
          if (this.addType === 2) {
          	dataObj.id = this.addId
	          dialogText = '修改成功'
          } else {
	          dialogText = '添加成功'
          }
			    this.addShow = false
	    		this.$fetch.post('/user/problem/editLanguage', dataObj).then(res => {
          	if (res.code === 0) {
		          Dialog({
			          content: dialogText,
                okFn: () => {
			          	this.getType()
                }
              })
	          }
          })
        }
      },
      editor (item) {
        if (item) {
          this.addType = 2
          this.addId = item.id
          this.dialogText = '编辑'
        } else {
            this.addType = 1
            this.addId = ''
            this.dialogText = '添加'
        }
        this.textContent = item.content
        this.addShow = true
        if (!this.textContent) {
	        this.descNum = 0
        } else {
	        this.descNum = this.textContent.length
        }
      },
      del (item, index) {
        Dialog({
          title: '确认删除',
          content: '是否确认删除选中内容?',
          type: 'confirm',
          okFn: () => {
	          this.$fetch.post('/user/problem/editLanguage', {
		          type: 3,//	Integer	类型 1.新增 2.修改 3.删除
		          id: item.id
            }).then(res => {
		          if (res.code === 0) {
			          this.languageList.splice(index, 1)
			          Dialog({
				          content: '删除成功'
			          })
		          }
	          })
          }
        })
      },
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.langSettings{
    width: 100%;
    height: calc(100vh - 60px) ;
    textarea{
      font-family: "Helvetica Neue", Helvetica, "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    }
    .warm-num{
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
    .main{
        width: 100%;
        height: 100%;
        padding: 40px 30px;
        .loading-w{
          margin: 0 auto;
          text-align: center;
        }
        .list{
            width: 100%;
            .ltem-li{
                width: 100%;
                min-height: 68px;
                font-size: 14px;
                color: #666;
                .allCenter;
                &:last-child{
                  .li-l{
                    border-bottom: 1px solid #ebebeb;
                  }
                }
                .li-l{
                    flex: 1;
                    min-height: 68px;

                    border: 1px solid #ebebeb;
                    border-bottom: none;
                    padding: 10px 30px;
                    display: flex;
                    align-items: center;
                }
                .li-r{
                    width: 120px;
                    .allCenter;
                    padding-left: 50px;
                    padding-right: 10px;
                    .editor{
                      width: 14px;
                      height: 14px;
                      background: url("~@img/PC/editor.svg") no-repeat center;
                      background-size: contain;
                      &:hover{
                      }
                    }
                    .editor,.del{
                      cursor: pointer;
                      position: relative;
                      &::before{
                        content: '';
                        position: absolute;
                        left: -10px;
                        top: -10px;
                        width: 34px;
                        height: 34px;
                      }
                    }
                    .del{
                        width: 14px;
                        height: 14px;
                        background: url("~@img/PC/del.svg") no-repeat center;
                        background-size: contain;
                    }
                }
            }
        }
    }
    .add-lang{
      width: 130px;
      height: 40px;
      line-height: 40px;
      background-color: #1962df;
      color: white;
      font-size: 14px;
      margin-top: 40px;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
    .dialog-box{
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0, .4);
        width: 100%;
        height: 100%;
        z-index: 999;
        .content-box{
            width: 600px;
            height: 396px;
            background-color: #fff;
            border-radius: 8px;
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            .title{
                font-size: 16px;
                font-weight: 600;
                text-align: center;
                padding-top: 40px;
                margin-bottom: 30px;
            }
            .textarea{
                width: calc(100% - 80px);
                height: 200px;
                padding: 20px;
                border: 1px solid rgba(0,0,0,.1);
                box-shadow: 0 0 4px rgba(0,0,0,.1);
                margin: 0 auto;
                textarea{
                    display: block;
                    width: 100%;
                    height: 100%;
                    margin-right: 8px;
                    border: none;
                    resize:none;
                }
            }
            textarea::-webkit-input-placeholder {
                color: #b3b3b3;
            }

            .input:-moz-placeholder {
                color: #b3b3b3;
            }

            .input:-ms-input-placeholder {
                color: #b3b3b3;
            }
            .btn{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 30px;
                padding: 0 40px;
                div{
                    width: 100px;
                    line-height: 34px;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .cancel{
                    color: #000;
                    background-color: #ddd;
                }
                .save{
                    background-color: #1962df;
                    color: #fff;
                    margin-left: 30px;
                }
            }
        }
    }
    .dialog-enter, .dialog-leave-to {
      opacity: 0;
      .content-box {
        transform: translate(-50%, -55%)
      }
    }

    .dialog-enter-active {
      transition: .3s;
      .content-box {
        transition: .3s
      }
    }

    .dialog-leave-active {
      transition: .1s;
      .content-box {
        transition: .1s
      }
    }
}
</style>
