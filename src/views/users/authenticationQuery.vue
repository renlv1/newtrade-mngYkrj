<template>
    <div class="c-page mar-right transaction-list authenticationQuery">
        <div class="page-wrap">
            <div class="search">
                <div class="search-box">
                    <div class="label">ID：</div>
                    <div class="input-wrap"><input v-model="id" type="number"></div>
                </div>
                <div class="search-box">
                    <div class="label">用户名：</div>
                    <div class="input-wrap"><input v-model.trim="username" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">昵称：</div>
                    <div class="input-wrap"><input v-model.trim="nickname" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">认证类型：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{certificationText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                <vue-scroll :ops="ops" style="height: 300px">
                                    <el-dropdown-item :command="composeValue(item, 1)" v-for="(item, index) in certificationArr" :key="index">{{item.text}}
                                    </el-dropdown-item>
                                </vue-scroll>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">审核状态：</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{auditText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                <vue-scroll :ops="ops" style="height: 300px">
                                    <el-dropdown-item :command="composeValue(item, 2)" v-for="(item, index) in auditArr" :key="index">{{item.text}}
                                    </el-dropdown-item>
                                </vue-scroll>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">时间：</div>
                    <el-date-picker
                            placeholder="开始时间"
                            v-model="startTime"
                            type="datetime"
                            default-time="00:00:00"
                            :picker-options="pickerBeginDateBefore"
                            format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>

                    <span style="margin-right: 10px">到</span>

                    <el-date-picker
                            placeholder="结束时间"
                            v-model="endTime"
                            type="datetime"
                            default-time="23:59:59"
                            :picker-options="pickerBeginDateAfter"
                            format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </div>
                <div class="f1"></div>
                <div class="btns">
                    <div @click="resetFields()" class="btn black">清空</div>
                    <div class="btn" @click="search">查询</div>
                </div>
            </div>
            <list-wrap :list="list" :total="total" @change="getData">
                <div class="web-table">
                    <div class="center">
                        <div class="common-thead">
                            <div class="thead">ID</div>
                            <div class="thead">用户名</div>
                            <div class="thead">昵称</div>
                            <div class="thead">类型</div>
                            <div class="thead tbody-address">状态</div>
                            <div class="thead">手机号码</div>
                            <div class="thead">邮箱</div>
                            <div class="thead">真实姓名</div>
                            <div class="thead">操作</div>
                        </div>
                        <div v-for="(item, index) in isListNull(list)" :key="index" @click="reviewTheDetails(item,index)" class="tbody-wrap" :class="{'active': itemIndex === index}">
                            <div class="common-tbody">
                                <div class="tbody">{{item.id}}</div>
                                <div class="tbody">{{item.userName}}</div>
                                <div class="tbody">{{item.nickName}}</div>
                                <div class="tbody">{{certificationIdFn(item.certificationType)}}</div>
                                <div class="tbody tbody-address status-li" :class="{'active': parseInt(item.status) === 0}">{{statusFn(item.status)}}</div>
                                <div class="tbody">{{item.mobile}}</div>
                                <div class="tbody">{{item.email}}</div>
                                <div class="tbody">{{item.realName}}</div>
                                <div @click.stop="upload(item)" class="blue-td cursor tbody" v-show="item.packFlag === false"> <span>展开</span><img src="../../../src/assets/img/kai.png"></div>
                                <div @click.stop="shouqi(item)" class="blue-td cursor tbody" v-show="item.packFlag === true"> <span>收起</span><img src="../../../src/assets/img/shou.png"></div>
                            </div>
                            <div class="add-more" v-show="item.packFlag === true">
                                <div class="add-up">
                                    <span>审核说明: {{item.auditDesc || '0'}}</span>
                                    <span>认证随机数: {{item.creationCode}}</span>
                                    <span>认证文本: {{item.creationContent}}</span>
                                    <span>创建时间: {{item.createTime}}</span>
                                    <span>更新时间: {{item.updateTime}}</span>
                                    <span>备注: {{item.remarks}}</span>
                                </div>
                            </div>
                        </div>
                        <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
                            <img src="~@img/loading.gif" />
                        </div>
                    </div>
                </div>
            </list-wrap>
            <v-dialog2
                    ref="dialog"
                    class="dislog-t"
                    :title="dialogTitle"
                    :type="dialogType"
                    @okFn="okFn"
                    :btnShow="btnShow"
                    @cancelFn="canceFn"
                    :okText="okText">
                <div class="item-li">
                    <div class="input-box">
                        <div class="tit">ID</div>
                        <input type="text" v-model="detailsObj.id || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="input-box">
                        <div class="tit">昵称</div>
                        <input type="text" v-model="detailsObj.nickName || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="input-box">
                        <div class="tit">用户名</div>
                        <input type="text" v-model="detailsObj.userName || '-'" disabled="disabled" placeholder="">
                    </div>
                </div>
                <div class="item-li">
                    <div class="input-box">
                        <div class="tit">手机</div>
                        <input type="text" v-model="phoneDetails" disabled="disabled" placeholder="">
                    </div>
                    <div class="input-box">
                        <div class="tit">邮箱</div>
                        <input type="text" v-model="detailsObj.email || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="search-box">
                        <div class="label">类型</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{commonText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                                <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                    <vue-scroll :ops="ops" style="height: 300px">
                                        <el-dropdown-item :command="composeValue(item, 3)" v-for="(item, index) in certificationArr2" :key="index">{{item.text}}
                                        </el-dropdown-item>
                                    </vue-scroll>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <div class="hr"></div>
                <div class="item-li">
                    <div class="input-box">
                        <div class="tit">姓名</div>
                        <input type="text" v-model="detailsObj.realName || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="input-box">
                        <div class="tit">身份证</div>
                        <input type="text" v-model="detailsObj.idCarNumber || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="search-box">
                        <div class="label">状态</div>
                        <div class="input-wrap dropdown-wrap">
                            <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{auditStateText || '未审核'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                                <el-dropdown-menu class="menu dropdown-menu-hidden3" slot="dropdown">
                                    <vue-scroll :ops="ops" style="height: 300px">
                                        <el-dropdown-item :command="composeValue(item, 4)" v-for="(item, index) in auditArr2" :key="index">{{item.text}}
                                        </el-dropdown-item>
                                    </vue-scroll>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <div class="item-li address-item">
                    <div class="input-box">
                        <div class="tit">住址</div>
                        <input type="text" v-model="detailsObj.homeAddress || '-'" disabled="disabled" placeholder="">
                    </div>
                </div>
                <div class="item-li">
                    <div class="input-box creationCode">
                        <div class="tit">随机数</div>
                        <input type="text" v-model="detailsObj.creationCode || '-'" disabled="disabled" placeholder="">
                    </div>
                    <div class="input-box">
                        <div class="tit">识别码</div>
                        <input class="userSystemCode" type="text" v-model="detailsObj.userSystemCode || '-'" disabled="disabled" placeholder="">
                    </div>
                </div>
                <div class="item-li address-item">
                    <div class="input-box">
                        <div class="tit">认证文本</div>
                        <input type="text" v-model="detailsObj.creationContent || '-'" disabled="disabled" placeholder="">
                    </div>
                </div>
                <div class="ul-img">
                    <viewer :images="imgData" class="list-img">
                        <div class="img-box video-box" @click="videoShow" v-show="creationVideo">
                            <div class="bg"></div>
                            <video :src="imgFn(creationVideo)"></video>
                        </div>
                        <div v-for="(item, index) in imgData2" :key="index" class="img-box" :class="{'img-a': item.flag === true}">
                            <div class="bg-a" :style="{backgroundImage: 'url( '+ item.url +')'}">
                                <img  :src="item.url" @load="loadImg(index)" ref="imgLoad">
                            </div>
                        </div>
                    </viewer>
                </div>
                <div class="item-li address-item" v-show="auditStateShow">
                    <div class="input-box err-a">
                        <div class="tit">失败原因</div>
                        <input type="text" v-model.trim="failCause"  placeholder="请输入失败原因">
                        <div class="err-t">{{errA}}</div>
                    </div>
                </div>
            </v-dialog2>
            <!--    video视频播放-->
            <v-dialog2
                    :btnShow="false"
                    ref="dialog2"
                    class="dialog-t video-dialog">
                <div class="video-box">
                    <video :src="imgFn(creationVideo)" loop ref="video" controls></video>
                </div>
            </v-dialog2>
        </div>
    </div>
</template>

<script>
  import { Message } from 'element-ui'
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        errA: '',
        failCause: '',
        auditStateShow: false,
        creationVideo: '',
        imgData: [],
        imgData2: [],
        detailsObj: {},
        dialogTitle: '用户审核认证',
        dialogType: 'alert',
        btnShow: false,
        okText: '保存',
        itemIndex: -1,
        lookShow: false,
        ops: {
          vuescroll: {},
          scrollPanel: {
            easing: 'easeInQuad',
            scrollingX: false,//是否启用 x 或者 y 方向上的滚动
          },
          rail: {
            background: '#01a99a',
            opacity: 0,
            size: '10px',
            specifyBorderRadius: false,
            gutterOfEnds: null,    //轨道距 x 和 y 轴两端的距离
            gutterOfSide: '0',   //距离容器的距离
            keepShow: false,   //是否即使 bar 不存在的情况下也保持显示
            border:'none'    //边框
          },
          bar: {
            hoverStyle: true,
            onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
            background: '#eee',   //颜色
          }
        },
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.startTime
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
        id: '',
        username: '',
        nickname: '',
        certificationText: '',
        auditText: '',
        auditId: '',
        startTime: '',
        endTime: '',
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        loadShow: false,
        showDialog: false,
        auditArr: [],
        auditArr2: [],
        auditStateText: '未审核',
        auditStateId: '',
        certificationArr: [],
        certificationArr2: [],
        commonText: '',
        commonId: '',
        phoneDetails:''
      }
    },
    created() {
      this.getTypeFn()
      // this.getData()
    },
    methods: {
      loadImg (index) {
        this.imgData2[index].flag = false
      },
      videoShow () {
        this.$refs.dialog2.show()
        setTimeout(() => {
          this.$refs.video.play()
        }, 300)
      },
      getTypeFn() {
        this.$fetch.get(`/public/enumValue?classPackage=user.UserCertification$CertificationTypeEnum;user.UserCertification$StatusEnum;user.UserCertification$NoticeTypeEnum;&flag=true&state=1`).then(res => {
          if (res) {
            this.certificationArr = res.data.data.CertificationTypeEnum
            this.auditArr = res.data.data.StatusEnum
          }
        })
      },
      certificationIdFn (item) {
        if (item !== null && this.certificationArr.length >0 && item > 0) {
          for (let i in this.certificationArr){
            if(item === parseInt(this.certificationArr[i].id)){
              return this.certificationArr[i].text
            }
          }
        }
      },
      statusFn (item) {
        if (item !== null && this.auditArr.length >0 && item > -1) {
          for (let i in this.auditArr){
            if(item === parseInt(this.auditArr[i].id)){
              return this.auditArr[i].text
            }
          }
        }
      },
      handleCommand(commend) {
        let command = commend.item
        let id = commend.index
        if (id === 1) {
          this.certificationText = command.text
          this.certificationId = command.id
        } else if (id === 2) {
          this.auditText = command.text
          this.auditId = command.id
        } else if (id === 3) {
          this.commonText =  command.text
          this.commonId =  command.id
        } else if (id === 4) {
          this.auditStateText = command.text
          this.auditStateId = command.id
          if (this.detailsObj.certificationType === 1 && this.detailsObj.status === 0) {
            //this.btnShow = true
            if (this.auditStateText === '审核失败' && this.auditStateId === 2) {
              this.auditStateShow = true
              this.btnShow = true
            }
            if (this.auditStateText === '审核通过' && this.auditStateId === 1) {
              this.btnShow = true
              this.auditStateShow = false
            }
          }
        }
      },
      upload(item) {
        item.packFlag = !item.packFlag
      },
      shouqi(item) {
        item.packFlag = !item.packFlag
      },
      resetFields() {
        this.auditId = ''
        this.auditText = ''
        this.certificationId = ''
        this.certificationText = ''
        this.username = ''
        this.id = ''
        this.userName = ''
        this.startTime = ''
        this.endTime = ''
      },
      getData(pageIndex,pageSize) {
        if(pageSize) {
          this.pageSize = pageSize
        }
        this.loadShow = true
        this.$fetch.post('/user/certification/queryCertificationList', {
          id: this.id,
          userName: this.username,
          nickName: this.nickname,
          certificationType: this.certificationId > 0 ? this.certificationId : '',
          status: this.auditId >= 0 ? this.auditId : '',
          startDateStr: this.$changeDate(this.startTime, '-', 8),
          endDateStr: this.$changeDate(this.endTime, '-', 8),
          pageIndex: pageIndex || this.pageIndex,
          pageSize: this.pageSize
        }).then((res) => {
          this.loadShow = false
          if( res.data) {
            this.loadShow = false
            let list = res.data.page.list
            list.forEach(item => {
              item.packFlag = false
            })
            this.list = list
            this.total = res.data.page.totalCount
          } else {
            this.list = []
            this.total = 0
          }
        }).catch(err => {
          this.loadShow = false
          console.log(err)
        })
      },
      search() {
        this.total = 1 // hook listWrap组件的loading
        this.getData()
      },
      // 查看详情
      reviewTheDetails (item,index) {
        //if (parseInt(item.certificationType) === 1 && parseInt(item.status === 0)) {}
        this.itemIndex = index
        this.$refs.dialog.show()
        document.body.style.overflow = 'hidden'
        this.getDetails(item)
      },
      // 详情
      getDetails(item) {
        this.$fetch.post(`/user/certification/preAuditUserCertInfo?id=${item.id}`).then((res) =>{
          if (res.code === 0){
            this.detailsObj = res.data.resultData
            // idCarImageFront--身份证正面照    idCarImageBack--身份证反面照 // 住址验明 -- addressImage   // 手持身份证：idCarHandImage
            let imgData = [this.imgFn(this.detailsObj.idCarImageFront), this.imgFn(this.detailsObj.idCarImageBack),this.imgFn(this.detailsObj.addressImage),this.imgFn(this.detailsObj.idCarHandImage)]
            let arr = []
            imgData.forEach(item => {
              if (item && typeof item !== null) {
                arr.push(item)
              }
            })
            this.imgData = arr
            this.imgData.forEach(item => {
              let obj = {
                url: item,
                flag: true
              }
              this.imgData2.push(obj)
            })
            this.btnShow = false
            // 认证类型,1:普通用户认证,2:市商认证,
            if (this.detailsObj.certificationType === 1)  {
              this.certificationArr2 = [
                {id:'1',text:'普通用户认证'}
              ]
            } else if (this.detailsObj.certificationType === 2) {
              this.certificationArr2 = [
                { id: "2", text: "星级市商认证" }
              ]
            } else if (this.detailsObj.certificationType === 3) {
              this.certificationArr2 = [
                { id: "3", text: "钻石市商认证" }
              ]
            }
            //// 审核状态 0：待审核  1：审核通过 2：审核失败 3:用户删除
            if(this.detailsObj.status === 0) {
              this.auditArr2= [
                {id: 1, text: '审核通过'},
                {id: 2, text: '审核失败'}
              ]
            } else {
              this.auditStateText = this.statusFn(this.detailsObj.status)
              this.auditArr2= [
                {id: this.detailsObj.status, text: this.auditStateText},
              ]
            }
            this.creationVideo = this.detailsObj.creationVideo
            this.commonText = this.matchType(this.certificationArr2,this.detailsObj.certificationType)
            if (this.detailsObj.phoneCode) {
              this.phoneDetails = '+' + this.detailsObj.phoneCode + ' ' + this.detailsObj.mobile 
            } else {
              this.phoneDetails = '+' + this.detailsObj.mobile
            }
            if (this.detailsObj.certificationType === 1 && this.detailsObj.status === 0) {
              if (this.auditStateText === '审核失败' && this.auditStateId === 2) {
                this.auditStateShow = true
                this.btnShow = true
              }
              if (this.auditStateText === '审核通过' && this.auditStateId === 1) {
                this.btnShow = true
                this.auditStateShow = false
              }
            }
          } 
        })
      },
      // 审核修改
      okFn () {
        this.errA = ''
        if (this.auditStateId === 2 && this.failCause === '') {
          this.errA = '请输入失败原因'
          return
        } else {
          if (this.auditStateId !== 2) {
            this.failCause = ''
          }
          Dialog({
            title: '是否提交审核？',
            okFn: () => {
              this.$fetch.post('/user/certification/auditUserCertInfo',{
                id: this.detailsObj.id,
                choose: this.auditStateId,
                auditDesc: this.failCause
              }).then(res => {
                Dialog({
                  content: res.msg,
                  okFn: () =>{
                    this.pageIndex = 1
                    this.getData(1,10)
                    this.resetFields()
                    this.canceFn()
                  }
                })
              })
            }
          })
        }
      },
      // 关闭
      canceFn(){
        this.imgData = []
        this.imgData2 = []
        this.detailsObj = ''
        this.commonText = ''
        this.auditStateText = ''
        this.btnShow = false
        this.auditStateShow = false
      },
      imgFn (url) {
        if (url && typeof url !== null) {
          if (url.indexOf(';') > -1)  return  url.replace(';', '')
          if (url.indexOf('\"') > -1)  return  url.replace('\"', '')
          if (url.indexOf('http') === -1) return  'https://rraystudio.blob.core.windows.net/' + url
          return url
        }
      },
    },
    components: {
      vDialog2: require('@/components/dialog2.vue').default,
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .web-table{
        .status-li{
            &.active{
                color #f00
            }
        }
        .common-tbody{
            .blue-td{
                height 100%
            }   
        }
    }
    .dialog-t{
        &.video-dialog{
            .video-box{
                max-height 500px
                max-width 800px
                display: flex
                align-items center
                justify-content center
                margin-top: 60px
            }
            video{
                max-height 500px
                max-width 800px
            }
        }
    }
    .dislog-t{
        .hr{
            width 100%
            height 1px 
            background-color rgba(0,0,0,.2)
            margin 40px auto
            position relative
            &:after{
                content ''
                display block
                position absolute
                left 0
                bottom -1px
                width 30px
                height 4px
                background-color #2176ff
            }
        }
        .item-li{
            width 100%
            height 32px
            line-height 32px
            margin-bottom 30px
            display flex
            align-items center
            justify-content space-between
            .input-box{
                flex 1
                height 100%
                display flex
                align-items center
                justify-content space-between
                margin-right 20px
                &:last-child{
                    margin-right: 0px;
                }
                .tit{
                    font-size 14px
                }
                input{
                    display inline-flex
                    width 200px
                    height 100%
                    border none
                    border-radius 4px
                    margin-left 6px
                    font-size 14px
                    padding 0 10px
                }
                .userSystemCode{
                    width auto
                    flex 1
                }
            }
            .err-a{
                position relative
                .err-t{
                    position absolute
                    top 60%
                    left 60px
                    color #f00
                    margin-top 10px
                }
                input{
                    border 1px solid rgba(0,0,0,.2)
                }
            }
            .creationCode{
                justify-content flex-start
            }
        }
        .ul-img{
            margin-bottom: 40px
            .list-img{
                display: flex
                align-items center
                .img-box{
                    width: 180px
                    height: 135px
                    display: flex
                    align-items center
                    justify-content center
                    cursor pointer
                    margin-right: 27px
                    &:last-child{
                        margin-right: 0
                    }
                    &.img-a{
                        background: url("../../assets/img/loading.gif") no-repeat center
                        background-size: 30px
                    }
                    &.video-box{
                        position: relative

                        .bg{
                            width: 100%
                            height: 100%
                            background-color: rgba(0,0,0,.4)
                            position: absolute
                            &::before{
                                position: absolute
                                left: 50%
                                top: 50%
                                transform translate(-50%,-50%)
                                z-index: 10
                                content ''
                                display: block
                                width: 40px
                                height: 40px
                                background: url("../../assets/img/play.svg") no-repeat center / cover
                            }
                        }
                    }
                    .bg-a{
                        width: 100%
                        height: 100%
                        background-repeat:no-repeat
                        background-size: cover
                        background-position: center
                        img{
                            opacity: 0
                        }
                    }
                    img, video{
                        max-width 100%
                        max-height 100%
                    }
                }
            }
        }
        .address-item{
            justify-content flex-start
            .input-box{
                justify-content flex-start
                input{
                    flex 1
                }
            }
        }
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
           padding 0 20px!important
           .search{
               padding-bottom 0
               .search-box{
                   width 100%
                   margin-top 0
                   margin-bottom 20px
                   .el-input{
                       display flex
                       align-items center
                       .el-input__inner{
                           margin-right 0!important
                           width 100%!important
                           padding-left 26px !important
                       }
                       .el-input__icon{
                           line-height 35px!important
                       }
                   }
                   .curreny-wrap{
                       cursor pointer
                       text-align center
                       line-height 40px
                       background-color #fff
                       border: 1px solid #DCDFE6;
                       border-radius: 6px;
                       padding: 0 10px;
                       font-size 15px
                       height: 40px;
                   }
                   .input-wrap{
                       width 80%
                       &.input-main{
                           width 70%
                       }
                       input{
                           margin-right 0!important
                           width 100%
                       }
                   }
               }
           }
       }
    .dialog-input{
        width 250px
    }
    .el-dropdown-menu{
        max-height 320px!important
        overflow auto !important
        /*max-width 200px!important*/
    }
    .payment{
        max-width 210px!important
    }
    .crumb
        display flex
        justify-content space-between
    .wrap
        background-color: @white;
    .search
        position relative
        display flex
        flex-direction row
        flex-wrap wrap
        .search-box
            margin-top 30px
            margin-bottom 0
            display flex
            flex-direction row
            align-items center
            .dropdown-wrap
                cursor pointer
                text-align center
                line-height 40px
                width: 180px;
                margin-right: 20px;
                background-color #fff
                border: 1px solid #DCDFE6;
                border-radius: 6px;
                padding: 0 10px;
                font-size 15px
                height: 40px;
        .btns
            margin-top 30px
            margin-right 50px
            .btn
                cursor pointer
</style>

<style scoped>
    >>>.freezeListWrap .empty {
        top: 20px;
    }

    >>> .el-dialog {
        margin: 0 auto;
        width: 80%;
        box-shadow: none;
    }

    >>> .el-dialog .el-dialog__headerbtn {
        top: 20px;
        right: 15px;
    }

    textarea {
        font-size: 14px;
        padding: 16px 0 0 18px;
        color: #000;
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
</style>
