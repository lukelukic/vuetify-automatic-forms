<template>
  <RestTable
    :filters="filters"
    :excludedHeaders="excludedHeaders"
    resource="/api/products"
    processDataOn="client"
    itemsPerPageText="$perPage"
    :editFormElements="elements"
    :insertFormElements="elements"
  />
</template>

<script>
export default {
  name: 'Rest',
  data() {
    return {
      filters: [{ key: 'name' }],
      excludedHeaders: ['id', 'category', 'categoryId'],
      elements: [
        { key: 'name', rules: '', label: '$name' },
        { key: 'description', component: 'v-textarea', label: '$description' },
        {
          key: 'categoryId',
          label: '$categoryName',
          component: 'v-autocomplete',
          dataSource: {
            endpoint: 'api/categories',
            dataProperty: 'data.items'
          }
        },
        {
          key: 'price',
          label: '$price',
          type: 'number',
          props: { prefix: '$' }
        },
        {
          key: 'picture',
          component: 'v-img',
          cols: 6,
          offset: 3
        }
      ]
    }
  }
}
</script>

<style></style>
