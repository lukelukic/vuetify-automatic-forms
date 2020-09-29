<script>
import Vue from 'vue';
export default Vue.extend({
  name: 'ServeDev'
});
</script>

<template>
  <v-app id="app">
    <v-container>
      <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <router-link to="/register">Register sample</router-link>
    <router-link to="/sample">Sample</router-link>
  </p>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>
