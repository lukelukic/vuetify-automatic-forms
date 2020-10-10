<template>
  <RestTable
    :filters="filters"
    :excludedHeaders="excludedHeaders"
    resource="/api/products"
    processDataOn="server"
    itemsPerPageText="$perPage"
    :editFormElements="elements"
    :insertFormElements="elements"
    :addBtn="{ text: '$addNew', color: 'red' }"
    :messages="messages"
    :formatters="formatters"
    filterPosition="right"
    :dataExtraction="dataExtraction"
    :insertOpts="insertOpts"
    :updateOpts="editOpts"
    :tableProps="tableProps"
    :extractInsertErrors="extr"
  />
</template>

<script>
export default {
  name: 'Rest',
  data() {
    return {
      tableProps: {
        dense: true
      },
      insertOpts: {
        submitText: '$submit',
        cancelText: '$cancel',
        submitColor: 'primary',
        cancelColor: 'red'
      },
      editOpts: {
        submitText: 'Dodaj',
        cancelText: 'Nemoj',
        submitColor: 'pink',
        cancelColor: 'black'
      },
      dataExtraction: {
        dataProperty: 'items',
        totalItemsProperty: 'totalCount'
      },
      messages: {
        deleteConfirmMessage: '$confirmDelete',
        deleteYes: '$yes',
        deleteNo: '$no'
      },
      filters: [{ key: 'name' }],
      excludedHeaders: ['category', 'categoryId', 'description'],
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
        price: this.formatPrice
      }
    }
  },
  methods: {
    formatPrice(price) {
      return price.toString().split('.')[0]
    },
    extr(response) {
      console.log(response)
      return [{ propertyName: 'name', error: 'Greska' }]
    }
  }
}
</script>

<style></style>
