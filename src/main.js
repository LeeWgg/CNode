// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './vuex/user'

Vue.config.productionTip = false
Vue.use(NProgress)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

// 处理刷新的时候vuex被清空但是用户已经登录的情况
if (sessionStorage.user) {
  store.dispatch('setUserInfo', JSON.parse(sessionStorage.user))
}

NProgress.configure({ showSpinner: false })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
