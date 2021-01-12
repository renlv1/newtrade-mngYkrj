<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible">
      <div class="g-dialog-mask"></div>
      <div class="g-dialog-wrap content-wrap">
        <div class="top-a">
          <div class="g-dialog-title">{{title}}</div>
          <i class="g-dialog-close el-icon-close" @click="cancelCallback"></i>
        </div>
        <slot></slot>
        <div class="g-dialog-btn-wrap" v-show="btnShow">
          <button v-if="type !== 'alert'" class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">取消</button>
          <button class="g-dialog-btn g-dialog-ok" @click="okCallback">{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visible: false
      }
    },
    props: {
      type: String,
      title: String,
      okFlag: {
	      type: Boolean,
	      default: true
      },
      btnShow: {
          type: Boolean,
          default: true
      },
      okText: {
      	type: String,
        default: '确定'
      },
    },
    methods: {
      show () {
        this.visible = true
      },
      hide () {
        this.visible = false
      },
      okCallback() {
        this.$emit('okFn')
        if (this.okFlag === true) {
	        this.visible = false
        }
      },
      cancelCallback() {
        this.$emit('cancelFn')
        this.visible = false
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .g-dialog{
    .g-dialog-wrap{
      width: 882px;
      text-align: left;
      .top-a{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        .g-dialog-title{
          padding-bottom: 0;
        }
        .el-icon-close{
          top: 38px;
          right: 42px;
        }
      }
      .g-dialog-btn-wrap{
        margin-top: 40px;
        .g-dialog-btn{
          margin: 0;
          &:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
