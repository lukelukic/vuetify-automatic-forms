import Vue from 'vue';
import Dev from './serve.vue';
import vuetify from './vuetify'
import VueRouter from 'vue-router'
import Register from './examples/register.vue'
import Sample from './examples/sample.vue'

Vue.config.productionTip = false;

const routes = [
  { path: '/register', component: Register },
  { path: '/sample', component: Sample }
]

const router = new VueRouter({routes})
Vue.use(VueRouter)

new Vue({
  vuetify,
  router,
  render: (h) => h(Dev),
}).$mount('#app');
