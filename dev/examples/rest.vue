<template>
  <RestTable
    :filters="filters"
    :excludedHeaders="excludedHeaders"
    resource="/api/products"
    processDataOn="client"
    itemsPerPageText="$perPage"
    :editFormElements="elements"
    :insertFormElements="elements"
    :addBtn="{ text: '$addNew', color: 'red' }"
    :messages="messages"
    :formatters="formatters"
  />
</template>

<script>
export default {
  name: 'Rest',
  data() {
    return {
      messages: {
        deleteConfirmMessage: '$confirmDelete',
        deleteYes: '$yes',
        deleteNo: '$no'
      },
      filters: [{ key: 'name' }],
      excludedHeaders: ['category', 'categoryId'],
      elements: [
        { key: 'name', rules: '', label: '$name' },
        { key: 'description', component: 'v-textarea', label: '$description' },
        {
          key: 'categoryId',
          cols: 6,
          label: '$categoryName',
          component: 'v-autocomplete',
          dataSource: {
            endpoint: 'api/categories',
            dataProperty: 'data.items'
          }
        },
        {
          key: 'price',
          cols: 6,
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
  },
  computed: {
    formatters: function() {
      return {
        price: this.formatPrice,
        id: function(id) {
          return id + 100
        }
      }
    }
  },
  methods: {
    formatPrice(price) {
      return price.toString().split('.')[0]
    }
  }
}
</script>

<style></style>
