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
    :insertOpts="insertOpts"
    :updateOpts="editOpts"
    :tableProps="tableProps"
    :extractInsertErrors="extr"
    :specializedColumns="specializedColumns"
    searchTitle="Available filters"
    :dataExtraction="dataExtraction"
  />
</template>

<script>
export default {
  name: 'Rest',
  data() {
    return {
      specializedColumns: [{ property: 'picture', type: 'image' }],

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
      filters: [
        { key: 'name', cols: 12 },
        {
          key: 'parentProductId',
          cols: 12,
          component: 'v-autocomplete',
          dataSource: {
            endpoint: '/api/products'
          },
          props: {
            multiple: true
          }
        }
      ],
      excludedHeaders: ['category', 'categoryId', 'description'],
      elements: [
        { key: 'name', rules: 'required', label: '$name' },
        { key: 'description', component: 'v-textarea', label: '$description' },
        {
          key: 'categoryId',
          cols: {
            xs: 12
          },
          label: '$categoryName',
          component: 'v-autocomplete',
          dataSource: {
            endpoint: 'api/categories',
            dataProperty: 'data.items'
          },
          affects: [
            {
              key: 'price',
              change: {
                type: 'cols',
                bindings: {
                  1: 12,
                  2: 6,
                  3: 8
                }
              }
            }
          ]
        },
        {
          key: 'price',
          cols: {
            xs: 12,
            lg: 6,
            xl: 6
          },
          label: '$price',
          type: 'number',
          props: { prefix: '$' }
        },
        {
          key: 'picture',
          component: 'v-img',
          cols: {
            xs: 6,
            md: 12
          },
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
