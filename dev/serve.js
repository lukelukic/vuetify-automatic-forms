import Vue from 'vue';
import Dev from './serve.vue';
import vuetify from './vuetify'
import './vee-validate'
import VueRouter from 'vue-router'
import Search from './examples/search.vue'
import Computation from './examples/computation.vue'
import Prefill from './examples/prefill.vue'
import Upload from './examples/upload.vue'
import UpdateProduct from './examples/UpdateProduct.vue'
import Table from './examples/table.vue'
import api from './api'

Vue.config.productionTip = false;

const routes = [
  { path: '/search', component: Search },
  { path: '/computation', component: Computation },
  { path: '/prefill', component: Prefill },
  { path: '/upload', component: Upload },
  { path: '/product/:id', component: UpdateProduct },
  { path: '/apitable', component: Table }
]

Vue.prototype.$formBuilderAxios = api

const router = new VueRouter({routes})
Vue.use(VueRouter)

new Vue({
  vuetify,
  router,
  render: (h) => h(Dev),
}).$mount('#app');
