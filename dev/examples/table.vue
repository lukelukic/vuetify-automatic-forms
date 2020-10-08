<template>
  <ApiTable
    :filters="filters"
    :get="get"
    columnWidth="auto"
    :imageColumn="imageColumn"
    :excludedHeaders="exclude"
    :tableProps="tableProps"
    processDataOn="client"
    filterPosition="top"
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
        dataProperty: 'items',
        totalItemsProperty: 'totalCount'
      }
    }
  }
}
</script>

<style></style>
