import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify/index';
import mq from './plugins/mq';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuelidate);
Vue.config.productionTip = false;

Vue.config.errorHandler = console.log;

new Vue({
  router,
  store,
  vuetify,
  mq,
  render: (h) => h(App),
}).$mount('#bhammyfarms');
