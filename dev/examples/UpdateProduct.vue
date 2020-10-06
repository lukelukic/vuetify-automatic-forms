<template>
  <v-row>
      <v-col cols="4" offset="4">
          <RestUpdateForm :formElements="elements" :id="1" resource="api/products" />
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
            ]
        }
    }
}
</script>

<style>

</style>