<template>
  <v-row>
      <v-col cols="7" offset="2">
          <CrudForm contentType="multipart/form-data" :formElements="elements" :submit="dugmence" type="insert" endpoint="http://ec2-3-120-128-154.eu-central-1.compute.amazonaws.com:5000/api/products" />
      </v-col>
  </v-row>
</template>

<script>
import { CrudForm } from '@/entry';
import  axios  from 'axios';

export default {
    components: {
        CrudForm
    },
    data() {
        return {
            dugmence: {text: "Posalji", color: "pink"},
            elements: [
                { key: 'name', cols: 6, props: {
                    appendIcon: "mdi-account",
                    autofocus: true                }},
                {key: 'price', cols: 6, rules: "numeric", hint: "Only numbers are allowed", props: {
                    counter: 6, 
                    prefix: "$"
                }},
                {key: 'categoryId', component: "v-autocomplete", cols: 6, dataSource: [
                    {text: "Kategorija 1", value: 1},
                    {text: "Kategorija 2", value: 2}
                ]},
                {key: 'parentProduct', component: 'v-autocomplete', cols: 6, dataSource: {
                    endpoint: "http://ec2-3-120-128-154.eu-central-1.compute.amazonaws.com:5000/api/products",
                    textProperty: "name",
                    valueProperty: "id"
                }},
                {key: 'description', component: 'v-textarea', counter: 1000, hint: "Max 1000 characters."},
                {
                    key: 'rating', component: 'v-slider', color: "pink", label: " ", 
                    props: {
                        trackColor: "orange",
                        thumbLabel: "always",
                        thumbColor: "blue",
                        prependIcon: "mdi-volume-high",
                        min: 0,
                        max: 50,
                        step: 5,
                        ticks: "always"
                    },
                    cols: 6
                },
                {
                    key: 'image',
                    hint: 'Click to pick image', 
                    component: 'v-file-input',
                    clearable: true,
                    cols: 6,
                    props: {
                        showSize: true,
                        chips: true,
                        multiple: true,
                        fileRender: 'base64'
                    }
                }
            ]
        }
    }
}
</script>

<style>

</style>