<template>
  <ApiTable
    :filters="filters"
    :get="get"
    filterPosition="left"
    columnWidth="auto"
    :excludedHeaders="exclude"
    :tableProps="tableProps"
    :serverSide="serverSide"
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
        dense: true
      },
      serverSide: {
        itemsLengthProperty: 'totalCount'
      }
    }
  }
}
</script>

<style></style>
