<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible">
      <div class="g-dialog-mask"></div>
      <div class="g-dialog-wrap content-wrap">
        <i class="g-dialog-close el-icon-close" @click="visible = false"></i>
        <div class="g-dialog-title"><i class="el-icon" v-show="warningShow"></i>{{title}}</div>
        <div class="g-dialog-content" :style="{textAlign: align}" v-html="content"></div>
        <div class="g-dialog-btn-wrap">
          <button v-if="type !== 'alert'" class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{cancelText}}
          </button>
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
      content: String,
      okFn: Function,
      okText: String,
      cancelFn: Function,
      cancelText: String,
      align: String,
      warningShow: Boolean,
    },
    methods: {
      okCallback() {
        this.visible = false
        this.okFn && this.okFn()
      },
      cancelCallback() {
        this.visible = false
        this.cancelFn && this.cancelFn()
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @btnColor: #1962df;
  @btnCancel: #ddd;
  .full () {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .g-dialog {
    .full();
    position: fixed;
    color: #000;
    z-index: 999;
    .content-wrap {
      padding: 40px !important;
      border-radius: 8px;
      @media screen and (max-width:1200px) {
        padding: 20px !important;
      }
      .g-dialog-content{
        color: #000;
        margin-bottom: 60px;
      }
    }
    .g-dialog-title{
           font-size: 16px;
           font-weight: bold;
           line-height: 18px;
          .el-icon{
              display: inline-block;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: url("~@img/warning.png") no-repeat center;
              background-size: contain;
              vertical-align: top;
              margin-right: 6px;
          }
    }
    &-mask {
      .full();
      position: absolute;
      background: rgba(0, 0, 0, .5)
    }
    &-wrap {
      position: absolute;
      width: 400px;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      background: #fff;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
      @media screen and (max-width:1200px) {
        width: 80%;
      }
    }
    &-close {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    &-title {
      font-size: 24px;
      line-height: 1;
      padding-bottom: 30px;
    }
    &-btn-wrap {
      text-align: center;
      display: flex;
      justify-content: center;
    }
    &-btn {
      display: inline-block;
      height: 34px;
      border: 1px solid @btnColor;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background-color: #fff;
      margin: 0 15px;
    }
    &-ok {
      width: 100%;
      background: @btnColor;
      transition: .4s;
      &:hover {
        background: darken(@btnColor, 10%);
      }
    }
    &-cancel {
      width: 100px;
      background-color: @btnCancel;
      border: none;
      color: #000;
      & + button {
        width: 100px;
      }
    }
  }

  .dialog-enter, .dialog-leave-to {
    opacity: 0;
    .g-dialog-wrap {
      transform: translate(-50%, -55%)
    }
  }

  .dialog-enter-active {
    transition: .3s;
    .g-dialog-wrap {
      transition: .3s
    }
  }

  .dialog-leave-active {
    transition: .1s;
    .g-dialog-wrap {
      transition: .1s
    }
  }
</style>
