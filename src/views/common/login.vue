<template>
  <div class="c-page full-page" @keyup.enter="submit">
    <div class="wrap sign">
      <div class="tit">新交易所管理平台</div>
      <div class="form">
        <div class="input-wrap">
          <!--<i class="icon user-icon"></i>-->
          <input type="text" placeholder="用户名" v-model.trim="userName">
        </div>
        <div class="input-wrap">
          <!--<i class="icon pwd-icon"></i>-->
          <input type="password" ref="password" @keyup.enter="submit" placeholder="密码" autocomplete="new-password" v-model="password">
        </div>
        <div class="input-wrap">
          <!--<i class="icon code-icon"></i>-->
          <input type="number" placeholder="请输入谷歌验证码" v-model.trim="googleCode">
        </div>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <button class="btn full" @click="submit">登录</button>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
  data() {
    return {
      userName: '',
      password: '',
      error: '',
      googleCode: ''
    };
  },
  computed: {
    disabled () {
      return !this.userName || !this.password
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.userName) {
        this.$refs.password && this.$refs.password.focus()
      }
    })
  },
  methods: {
    submit () {
	    this.error = ''
    	// if (this.userName === '') {
		//     this.$message.error('请输入用户名')
		//     return
	  //   }
	  //   if (this.password === '') {
		//     this.$message.error('请输入密码')
		//     return
	  //   }
      // if (this.googleCode === '') {
      //   this.$message.error('请输入谷歌验证码')
      //   return
      // }
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post('/sys/login', {
        username: this.userName,
        password: this.password,
        googleCode: this.googleCode,
        /*username: "admin",
        password: "debug",
        googleCode: "456",*/
        //loading: '正在登陆中...'
      }).then((res) => {
	      this.$store.commit('SET_IS_LOGIN', true)
	      this.$store.dispatch('getNavList')
          this.$store.commit('SET_NAV_ACTIVE', -1) // 重置Nav菜单栏
          localStorage.setItem('userName', this.userName)
          this.$store.dispatch('getUserInfo')
          if (window.innerWidth < 1200) {
            this.$router.push('/users/user')
	          this.$store.state.menuShow = false
	          this.$store.commit('SET_MENU', false)
          } else {
	          this.$router.replace('/blank')
          }
          this.$store.commit('SET_LOGIN_FLAG',true)
          this.$store.commit('SET_LOADING', false)
          localStorage.removeItem('SET_NAV_ACTIVE')
          this.password = ''
          this.googleCode = ''
      }).catch(err => {
	      if (err.code === 1005) {
          localStorage.removeItem('SET_NAV_ACTIVE')
		      localStorage.setItem('userName', this.userName)
		      this.$router.push('/blank')
		      this.$store.dispatch('getNavList')
          this.$store.commit('SET_LOGIN_FLAG',true)
		      this.$store.commit('SET_LOADING', false)
		      this.password = ''
              this.googleCode = ''
	      }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .full-page{
    width: 100%;
    margin-left: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #1346B2;
    z-index: 4;
    .allCenter
  }
  .sign{
    width: 500px;
    margin: 0 auto;
    @media screen and (max-width: 750px){
        width: 280px;
    }
    .label{
      margin-bottom: 0;
    }
    .form{
      width: 100%;
      .input-wrap{
            height: 50px;
            width: 100%;
            font-size: 16px;
            color: #bcbcbc;
            position: relative;
            @media screen and (max-width: 750px){
                font-size: 14px;
            }
            input{
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0, .4);
                padding: 0 20px;
                text-align: center;
                border: none;
                color: #fff;
                border-radius: 8px;
            }
            .icon{
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                display: inline-block;
            }
            .user-icon{
                width: 17px;
                height: 15px;
                background: url("~@img/user-icon.png") no-repeat center;
                background-size: contain;
            }
            .pwd-icon{
                width: 18px;
                height: 18px;
                background: url("~@img/password-icon.png") no-repeat center;
                background-size: contain;
            }
            .code-icon{
                width: 18px;
                height: 18px;
                background: url("~@img/key.png") no-repeat center;
                background-size: contain;
            }
        }
      .full{
        background-color: @white;
        height: 50px;
        line-height: 50px;
        color: #1962df;
        font-size: @textFontSize;
        margin-top: 20px;
      }
      .error{
        font-size: 14px;
        height: 20px;
        margin-top: 6px;
        color: #ff5050;
      }
    }
    .tit{
      text-align: center;
      font-size: 60px;
      color: #fff;
      padding-bottom: 60px;
      @media screen and (max-width: 750px){
        font-size: 30px;
      }
    }
  }
</style>
