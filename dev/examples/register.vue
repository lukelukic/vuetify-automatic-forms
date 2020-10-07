<template>
  <v-row>
      <v-col cols="10">
           <v-data-table class="mr-5 ml-5" :items="items" :headers="headers"></v-data-table>
      </v-col>
      <v-col cols="2">
          <SearchForm :formElements="formElements" @success="handleSearchResult" endpoint="api/products"/>
      </v-col>
  </v-row>
</template>
<script>

export default {
    data() {
        return {
            formElements: [
                {
                    key: 'name'
                },
                {
                    key: 'categoryId',
                    component: 'v-autocomplete',
                    dataSource: {
                        endpoint: 'api/categories',
                        dataProperty: "data.items"
                    }
                },
            ],
            items: [],
            headers: [
                {text: 'Name', value: 'name'},
                {text: 'Price', value: 'price'},
                {text: 'Description', value: 'description'},
                {text: 'Category', value: 'category.name'}
            ]
        }
    },
    methods: {
        handleSearchResult: function(data) {
            this.items = data
        }
    }
}
</script>

<style>

</style>