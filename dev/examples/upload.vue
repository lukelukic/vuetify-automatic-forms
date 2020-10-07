<template>
  <v-row>
      <v-col cols="4" offset="3">
          <ApiForm :formElements="elements" 
                    :extractErrorsFn="errors" 
                    :successFn="success" 
                    :errorFn="error"
                    :submit="btn"  
                    endpoint="api/productphoto" />
      </v-col>
  </v-row>
</template>

<script>
import  axios  from 'axios';
export default {
    data() {
        return {
            btn: {text: "Send", color: "pink"},
            elements: [
                {   key: 'productId', component: 'v-autocomplete', 
                    dataSource: {
                    endpoint: "api/products",
                    textProperty: "name",
                    valueProperty: "id"
                }},
                {
                    key: 'photo',
                    hint: 'Click to pick image', 
                    component: 'v-file-input',
                    clearable: true,
                    conversionStrategy: "base64",
                    props: {
                        showSize: true,
                        chips: true
                    }
                }
            ],
            success: function(data) {
                console.log(data)
                alert("Done!")
            },
            error: function() {
                alert("Error")
            },
            errors: function(response) {
                return response
            }
        }
    }
}
</script>

<style>

</style>