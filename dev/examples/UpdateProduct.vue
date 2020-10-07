<template>
  <v-row>
      <v-col cols="4" offset="4">
          <RestUpdateForm :formElements="elements" :id="id" resource="api/products" @success="success" @error="error" />
      </v-col>
  </v-row>
</template>

<script>
export default {
    name: "UpdateProduct",
    data() {
        return {
            elements: [
                { key: 'name' },
                { key: 'description', component: 'v-textarea'},
                {
                    key: 'categoryId',
                    component: 'v-autocomplete',
                    dataSource: {
                        endpoint: "api/categories",
                        dataProperty: "data.items"
                    }
                }, 
                { key: 'price', type: "number", props: { prefix: "$" }},
                { key: 'picture', component: 'v-img', cols: 6, offset: 3 }
            ]
        }
    },
    computed: {
        id: function() {
            return Number(this.$route.params.id)
        }
    },
    methods: {
        success: function() {
            alert("Successfull update!")
        },
        error: function(error) {
            alert("Greska.")
        }
    }
}
</script>

<style>

</style>