<script>
import Vue from 'vue'
import Nav from './nav'
export default Vue.extend({
  name: 'ServeDev',
  components: {
    Nav
  },
  data() {
    return {
      langs: ['ja', 'en', 'it']
    }
  },
  methods: {
    changeLanguage(val) {
      Vue.prototype.locale = val
    }
  }
})
</script>

<template>
  <v-app id="app">
    <v-container>
      <v-row class="mt-5">
        <v-col cols="2">
          <Nav />
          <v-autocomplete
            v-model="$i18n.locale"
            :items="langs"
            @change="changeLanguage"
          />
        </v-col>
        <v-col cols="10">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<style>
.form-builder-input {
  padding: 0 5px 12px 5px !important;
}
</style>
