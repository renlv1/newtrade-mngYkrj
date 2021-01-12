import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill' // 兼容旧浏览器
import router from './router'
import store from './store'
import fetch from './api/api'
import * as customFiter from './filter'
import listWrap from '@/components/listWrap'
import './plugins/element.js'
import globalMixin from './mixin'
import axios from 'axios'
import vuescroll from 'vuescroll'
import Cube from 'cube-ui'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Cube)

Vue.prototype.isPC = window.innerWidth > 1200
Vue.use(Viewer);
Viewer.setDefaults({
	Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source",'zoomRatio': 0.3 }
});


Vue.use(vuescroll)
Vue.component('listWrap', listWrap)

Vue.mixin(globalMixin)
// 防重复点击(指令实现)
Vue.directive('resetClick', {
  inserted (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  }
}),
Vue.prototype.$fetch = fetch
Vue.prototype.$axios = axios
Vue.prototype.$api = process.env.VUE_APP_BASE_PATH
Vue.config.productionTip = false

//配置全局过滤器
Object.keys(customFiter).forEach(key => {
  Vue.filter(key, customFiter[key])
})
Vue.prototype.toastD = function (text) {
  this.toast = this.$createToast({
    txt: text,
    time: 2000,
    type: 'txt'
  })
  this.toast.show()
}
//1:ios 2:安卓  3:IOS企业版 4:windows客户端 5:mac客户端
Vue.prototype.$versionsType = function (type) {
  let versionsArr = ['ios','安卓','IOS企业版','windows客户端','mac客户端']
  return versionsArr[type - 1]
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
