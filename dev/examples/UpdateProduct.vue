<template>
  <v-row>
    <v-col cols="4" offset="4">
      <RestUpdateForm
        :formElements="elements"
        :id="id"
        resource="api/products"
        @success="success"
        @error="error"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'UpdateProduct',
  data() {
    return {
      elements: [
        { key: 'name', rules: 'required' },
        { key: 'description', component: 'v-textarea' },
        {
          key: 'categoryId',
          component: 'v-autocomplete',
          dataSource: {
            endpoint: 'api/categories',
            dataProperty: 'data.items'
          },
          props: {
            multiple: true
          },
          affects: [
            {
              key: 'parentProductId',
              change: {
                type: 'disable',
                when: ''
              }
            },
            {
              key: 'parentProductId',
              change: {
                type: 'dataSource',
                api: {
                  endpoint: '/api/products?&categoryId=',
                  associateValue: true
                }
              }
            }
          ]
        },
        {
          key: 'parentProductId',
          component: 'v-autocomplete',
          dataSource: [],
          disabled: true
        },
        { key: 'price', type: 'number', props: { prefix: '$' } },
        { key: 'picture', component: 'v-img', cols: 6, offset: 3 }
      ]
    }
  },
  computed: {
    id: function() {
      return Number(this.$route.params.id)
    }
  },
  methods: {
    success: function() {
      alert('Successfull update!')
    },
    error: function() {
      alert('Greska.')
    }
  }
}
</script>

<style></style>
