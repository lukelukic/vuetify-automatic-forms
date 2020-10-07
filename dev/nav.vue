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
                    <v-btn :color="item.route == currentRoute ? 'red' : 'white' " > {{ item.title }} </v-btn>
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
        {
          title: "Product",
          route: "/product"
        },
        {
          title: "Update Product",
          route: "/product/1"
        }
      ]
    }
  },
  computed: {
    currentRoute: function(){
      return this.$route.path
    }
  }
}
</script>

<style>

</style>