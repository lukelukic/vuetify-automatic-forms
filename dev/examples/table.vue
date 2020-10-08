<template>
  <ApiTable
    :filters="filters"
    :get="get"
    filterPosition="top"
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
      filters: [{ key: 'name', cols: 3 }],
      get: { endpoint: '/api/products' },
      exclude: ['category', 'id', 'description'],
      imageColumn: '',
      tableProps: {
        dense: true,
        multiSort: true
      },
      dataExtraction: {
        dataProperty: "items",
        totalItemsProperty: 'totalCount'
      }
    }
  }
}
</script>

<style></style>
