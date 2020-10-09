<template>
  <ApiTable
    :filters="filters"
    :api="api"
    columnWidth="auto"
    :imageColumn="imageColumn"
    :excludedHeaders="exclude"
    :tableProps="tableProps"
    processDataOn="client"
    filterPosition="top"
    itemsPerPageText="$perPage"
  />
</template>

<script>
export default {
  data() {
    return {
      filters: [{ key: 'name', cols: 3, label: '$name' }],
      api: { endpoint: '/api/products' },
      exclude: ['category', 'id', 'description', 'categoryId', 'image'],
      imageColumn: 'picture',
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
