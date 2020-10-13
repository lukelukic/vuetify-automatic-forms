<template>
  <ApiTable
    :filters="filters"
    :api="api"
    columnWidth="auto"
    :excludedHeaders="exclude"
    :tableProps="tableProps"
    processDataOn="client"
    filterPosition="top"
    itemsPerPageText="$perPage"
    :specializedColumns="specializedColumns"
    :formatters="formatters"
  />
</template>

<script>
export default {
  data() {
    return {
      specializedColumns: [
        { property: 'picture', type: 'image' },
        { property: 'price', type: 'check' }
      ],
      filters: [{ key: 'name', cols: 3, label: '$name' }],
      api: { endpoint: '/api/products' },
      exclude: ['category', 'id', 'description', 'categoryId'],
      imageColumn: 'picture',
      tableProps: {
        dense: true,
        multiSort: true
      },
      dataExtraction: {
        dataProperty: 'items',
        totalItemsProperty: 'totalCount'
      },
      formatters: {
        price: function(price) {
          return price > 300
        }
      }
    }
  }
}
</script>

<style></style>
