<template>
  <v-card
    elevation="3"
    >
    <v-navigation-drawer
        floating
        permanent
        >
        <v-list
            dense
            >
            <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                >
                <router-link :to="item.route">
                    <v-btn :color="item.route == currentRoute ? 'red' : 'white' " @click="navClick(item.route)"> {{ item.title }} </v-btn>
                </router-link>
            </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
</template>

<script>
export default {
    name: "Nav",
    data: function(){
    return {
      items: [
        {
          title: "Register",
          route: "/register"
        },
        {
          title: "Simple",
          route: "/sample"
        },
        {
          title: "Edit",
          route: "/edit"
        },
      ],
      currentRoute: ""
    }
  },
  methods: {
      navClick: function(route){
          this.currentRoute = route
      }
  }
}
</script>

<style>

</style>