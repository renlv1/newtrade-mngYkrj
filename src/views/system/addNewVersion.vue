<template>
    <div class="c-page mar-right">
        <div class="wrap">
            <div class="crumb">
                <span><span class="back" @click="$router.push('/system/verNote')">版本新增记录</span> / <span class="tit">新增</span></span>
                <div class="preserve" @click="save">保存</div>
            </div>
            <div class="main-content">
                <div class="search-box">
                    <div class="label">APP名称</div>
                    <div class="input-wrap"><input v-model.trim="appname" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">标题</div>
                    <div class="input-wrap"><input v-model.trim="title" type="text"></div>
                </div>
                <div class="search-box textarea">
                    <div class="label">更新内容</div>
                    <textarea style="width: 294px; height: 150px" v-model="content" placeholder='更新内容'></textarea>
                </div>
                <div class="search-box">
                    <div class="label">安卓版本号</div>
                    <div class="input-wrap"><input v-model.trim="versioncode" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">ios版本号</div>
                    <div class="input-wrap"><input v-model.trim="version" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">类型</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="typeCommand">
                            <span class="el-dropdown-link">
                              {{typeText || 'IOS商店版'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="item" v-for="(item,index) in typeEnum" :key="index">{{item.text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">下载地址</div>
                    <div class="input-wrap"><input v-model="url" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">web端连接</div>
                    <div class="input-wrap"><input v-model="weburl" type="text"></div>
                </div>
                <div class="search-box">
                    <div class="label">是否必须更新</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="updateCommand">
                            <span class="el-dropdown-link">
                              {{updateText || '必须更新'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="item" v-for="(item,index) in mustUpdateEnum" :key="index">{{item.text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="search-box">
                    <div class="label">版本状态</div>
                    <div class="input-wrap dropdown-wrap">
                        <el-dropdown @command="versionsCommand">
                            <span class="el-dropdown-link">
                              {{versionsText || '显示'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="menu" slot="dropdown">
                                <el-dropdown-item :command="item" v-for="(item,index) in versionStatusEnum" :key="index">{{item.text}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        appname: '',
        title: '',
        content: '',
        versioncode: '',
        version: '',
        url: '',
        weburl: '',
        type: '',
        mustUpdate: '',
        versionStatus: '',
        typeText: '',
        updateText: '',
        versionsText: '',
        typeEnum: [],
        mustUpdateEnum: [],
        versionStatusEnum: [],
      }
    },
    created() {
      this.getType()
    },
    mounted() {
    },
    methods: {
      getType () {
        this.$fetch.post(`public/enumValue?classPackage=system.Version$TypeEnum;system.Version$MustupdateEnum;system.Version$VersionStatusEnum&flag=false&state=1`).then((res) => {
          if(res.msg === '成功') {
            this.typeEnum =res.data.data.TypeEnum
            this.mustUpdateEnum =res.data.data.MustupdateEnum
            this.versionStatusEnum =res.data.data.VersionStatusEnum
          }
        })
      },
      typeCommand (commend) {
        this.typeText = commend.text
        this.type = commend.id
      },
      updateCommand (commend) {
        this.updateText = commend.text
        this.mustUpdate = commend.id
      },
      versionsCommand (commend) {
        this.versionsText = commend.text
        this.versionStatus = commend.id
      },
      // 新增保存
      save () {
        this.$fetch.post(`system/version/addVersion`,{
          appname: this.appname,
          title: this.title,
          content: this.content,
          versioncode: this.versioncode,
          version: this.version,
          type: this.type,
          url: this.url,
          weburl: this.weburl,
          mustUpdate: this.mustUpdate,
          versionStatus: this.versionStatus,
        }).then((res) => {
          if (res.msg === '新增成功') {
            Dialog({
              title: res.msg,
              okFn: () => {
                this.$router.push('/system/verNote')
              }
            })
          }
        }).catch((err) => {
          Dialog({
            title: err.msg
          })
        })
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../assets/css/var.less";
.main-container {
    padding: 34px 20px 0 40px;
    .wrap {
        .crumb{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            color: #b7b9c1;
            .back{
                cursor: pointer;
                &:hover{
                    color: @text;
                }
            }
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
                &:nth-child(3){
                    align-items: flex-start !important;
                }
                &:nth-child(1){
                    margin-top: 0;
                }
                .label{
                    width: 84px;
                    margin-right: 40px;
                }
                .textarea{
                    width: 300px;
                    height: 200px;
                }
                .input-wrap{
                    width: 300px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 2px;
                    border: 1px solid @border;
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
            .textarea{
                height: 150px;
            }
            .quill-editor{
                height: 434px;
                position: relative;
                .label{
                    width: 84px;
                }
                .editor{
                    position: absolute;
                    left: 98px;
                    top: 0;
                    width: 800px;
                    .ql-container{
                        height: calc(100% - 66px) !important;
                    }
                }
            }
        }
    }
}
</style>
