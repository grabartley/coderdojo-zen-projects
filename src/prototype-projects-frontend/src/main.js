// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource';
import VueSocketIO from 'vue-socket.io';
import VeeValidate from 'vee-validate';
import App from './App'
import router from './router'

Vue.config.productionTip = false;
Vue.config.apiServer = process.env.API_SERVER;

// used for GET and POST requests
Vue.use(VueResource);
// server socket is on port 3000
Vue.use(VueSocketIO, 'http://localhost:3000');
// used for form validation
Vue.use(VeeValidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
