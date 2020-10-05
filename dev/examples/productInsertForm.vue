<template>
  <v-row>
      <v-col cols="7" offset="2">
          <CrudForm :formElements="elements" 
                    :extractErrorsFn="errors" 
                    :updateObject="incomming" 
                    :successFn="success" 
                    :errorFn="error"
                    :submit="dugmence"  
                    endpoint="http://localhost:5000/api/productphoto" />
      </v-col>
  </v-row>
</template>

<script>
import  axios  from 'axios';
export default {
    data() {
        return {
            dugmence: {text: "Posalji", color: "pink"},
            elements: [
                {key: 'productId', component: 'v-autocomplete', cols: 6, dataSource: {
                    endpoint: "http://ec2-3-120-128-154.eu-central-1.compute.amazonaws.com:5000/api/products",
                    textProperty: "name",
                    valueProperty: "id"
                }},
                {
                    key: 'photo',
                    hint: 'Click to pick image', 
                    component: 'v-file-input',
                    clearable: true,
                    cols: 6,
                    conversionStrategy: "base64",
                    props: {
                        showSize: true,
                        chips: true
                    }
                },
                {
                    key: 'categoryId',
                    component: 'v-autocomplete',
                    dataSource: {
                        endpoint: "http://localhost:5000/api/categories",
                        dataProperty: "data.items"
                    }
                },
                {
                    key: 'photoPreview',
                    cols: 4,
                    offset: 4,
                    component: 'v-img'
                },
                {
                    key: 'createdAt',
                    component: 'datepicker',
                    props: {
                        locale: 'sr'
                    },
                    clearable: true,
                    cols: 3
                }
            ],
            incomming: {
                photoPreview: "https://picsum.photos/id/11/500/300"
            },
            success: function(data) {
                console.log(data)
                alert("Bravo!")
            },
            error: function() {
                alert("GRESKA")
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