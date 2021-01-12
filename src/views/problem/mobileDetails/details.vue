<template>
  <div class="details-w">
    <div class="wrap-t">
      <div class="img-a" v-show="loadShow">
        <img src="@img/loading2.gif" alt />
      </div>
      <ul class="uls-chat">
        <li class="list-chat" v-for="(list, a) in problemFeedBack" :key="a">
          <div class="flex-item">
            <div class="name"  :class="{'author': list.isAuthor === 2}">{{nameFn(list)}}</div>
            <div class="time">{{list.createTime}}</div>
          </div>
          <div class="content">{{list.content}}</div>
          <ul class="img-uls" v-if="list.imageUrl && list.imageUrl.length > 0">
            <viewer :images="list.imageUrl" class="img-list">
              <div class="img-w" v-for="src in list.imageUrl" :key="src">
                <img  :src="src" :key="src">
              </div>
            </viewer>
          </ul>
        </li>
        <li class="list-chat">
          <div class="flex-item">
            <div class="name">{{problem.userName}}</div>
            <div class="time">{{problem.createTime}}</div>
          </div>
          <div class="content">{{problem.content}}</div>
          <ul class="img-uls" v-if="problem.imageUrl && problem.imageUrl.length > 0">
            <viewer :images="problem.imageUrl" class="img-list">
              <div class="img-w" v-for="src in problem.imageUrl" :key="src">
                <img  :src="src" >
              </div>
            </viewer>
          </ul>
        </li>
      </ul>
      <div class="btn-a" @click="replyFn" :class="iphoneHeight">回复</div>
    </div>
    <v-chat  :merchantShow="merchantShow" :languageList="languageList" :tabId="tabId" @hideDialog="hideDialog"></v-chat>
  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				loadShow: false,
				languageList: [],
				merchantShow: false,
				tabId: Number(this.$route.query.id),
				problem: {},
				problemFeedBack: [],
				iphoneHeight: 'ios'
      }
		},
    created () {
			this.getA()
      this.getLanguage()
	    if (/iphone/gi.test(navigator.userAgent)) {
		    if (screen.height >= 812) {
			    this.iphoneHeight = 'iosx'
		    } else {
			    this.iphoneHeight = 'ios'
		    }
	    }
    },
    methods: {
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
	    hideDialog (msg) {
		    this.merchantShow = false
	    	if (msg) {
			    Dialog({
			      content: '回复成功',
			      okFn: () => {
				      this.getA()
				      window.scrollTo(0,0);
			      }
			    })
        }
      },
	    replyFn () {
	    	this.merchantShow = true
      },
	    nameFn (item) {
	    	if (item.isAuthor === 2) return '系统回复'
	    	return item.userName
      },
	    getA () {
		    this.loadShow = true
		    this.$fetch.post(`/system/feedBack/queryProblemReply`, {
			    id: this.tabId
		    }).then((res) => {
			    this.loadShow = false
			    if (res.code === 0) {
				    this.problem = res.data.problem
				    this.problemFeedBack = res.data.problemFeedBack.reverse()
			    }
		    })
	    }
    },
    components: {
	    vChat: require('./chat.vue').default,
    }
	}
</script>

<style scoped lang="less">
.details-w{
  .wrap-t{
    .img-a{
      margin: 50px auto 0;
      text-align: center;
      img{
        width: 100px;
      }
    }
    .uls-chat{
      padding: 30px 20px 100px 20px;
      .list-chat{
        border-bottom: 1px solid #e7effc;
        padding: 20px 0;
        .flex-item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name{
            font-size: 16px;
            font-weight: bold;
          }
          .author{
            color: #1962df;
          }
          .time{
            color: #999;
          }
        }
        .content{
          margin: 10px 0 15px;
          line-height: 1.5;
        }
        .img-uls{
          .img-list{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .img-w{
              width: 70px;
              height: 70px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
              margin-bottom: 10px;
              position: relative;
              &::before{
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                background: url("../../../assets/img/loading.gif") no-repeat center / cover;
              }
            }
            img{
              background-color: #fff;
              max-width: 70px;
              max-height: 70px;
              position: relative;
              z-index: 100;
            }
          }
        }
      }
    }
    .btn-a{
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 500;
      width: 100%;
      height: 50px;
      background-color: #1962df;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      &.iosx{
        height: 70px;
        padding-bottom: 20px;
      }
    }
  }
}
</style>
