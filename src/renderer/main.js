import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from 'store2'
import Vuetify from 'vuetify'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.config.silent = true
window.user = store.get('user')

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
