import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'
import excel from 'vue-excel-export'
import VueChatScroll from 'vue-chat-scroll'
import html2canvas from 'html2canvas';

Vue.use(html2canvas)
Vue.use(VueChatScroll)
 
Vue.use(excel)

Vue.config.productionTip = false

Vue.prototype.$http = axios;

Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$imageUpload = 'http://127.0.0.1:8000/image_upload/';

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
