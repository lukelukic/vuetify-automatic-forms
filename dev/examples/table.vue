<template>
  <ApiTable
    :filters="filters"
    :get="get"
    filterPosition="right"
    columnWidth="auto"
    :imageColumn="imageColumn"
    :excludedHeaders="exclude"
    :tableProps="tableProps"
    processDataOn="mixed"
  />
</template>

<script>
export default {
  data() {
    return {
      filters: [{ key: 'name' }],
      get: { endpoint: '/api/products' },
      exclude: ['category', 'id', 'description'],
      imageColumn: 'picture',
      tableProps: {
        dense: true,
        multiSort: true
      },

    } 
  }
}
</script>

<style></style>
