<script>
import Vue from 'vue';
import Nav from './nav';
export default Vue.extend({
  name: 'ServeDev',
  components: {
    Nav
  }
});
</script>



<template>
   <v-app id="app">
      <v-container>
        <v-row class="mt-5">
          <v-col cols="2">
            <Nav/>
          </v-col>
          <v-col cols="10">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
   </v-app>
</template>


