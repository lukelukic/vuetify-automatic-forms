<template>
  <v-row>
      <v-col cols="7" offset="2">
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
                    key: 'firstName',
                    cols: 6
                },
                {
                    key: 'lastName',
                    cols: 6
                },
            ]
        }
    },
    methods: {
        handleSearchResult: function(data) {
            console.log(data)
        }
    }
}
</script>

<style>

</style>