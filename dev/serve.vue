<script>
import Vue from 'vue';
import { VuetifyFormBuilderSample, FormBuilder } from '@/entry';
import Login from './examples/login.vue'
export default Vue.extend({
  name: 'ServeDev',
  components: {
    VuetifyFormBuilderSample,
    FormBuilder,
    Login
  },
  data() {
    return {
      formElements: [
        { 
          key: "firstName",
          rules: "required"
        }
      ]
    }
  },
  methods: {
    handle: function(obj) {
      console.log(obj)
    }
  }
});
</script>

<template>
  <v-app id="app">
    <v-container>
      <Login/>
    </v-container>
  </v-app>
</template>
