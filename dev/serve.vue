<script>
import Vue from 'vue';
import { VuetifyFormBuilderSample, FormBuilder } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VuetifyFormBuilderSample,
    FormBuilder
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
      <v-row>
        <v-col cols="4" offset="4">
          <FormBuilder :formElements="formElements" :handleSubmit="handle"/>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
