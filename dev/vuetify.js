import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import VuetifyFormBuilder from '../src/entry'

Vue.use(Vuetify)
Vue.use(VuetifyFormBuilder)

export default new Vuetify({
  icons: {
    iconFont: 'mdi',
  },
})
