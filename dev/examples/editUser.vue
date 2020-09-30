<template>
  <v-row>
      <v-col cols="4" offset="4">
          <FormBuilder :formElements="formElements" :submit="subBtn" :incommingObject="user" :handleSubmit="submit" />
      </v-col>
  </v-row>
</template>

<script>
import { FormBuilder } from '@/entry';
export default {
    components : {
        FormBuilder
    },
    data() {
        return {
            formElements: [
              {
                key: 'firstName', rules: 'required', cols: 6
              },
              {
                key: 'lastName', rules: 'required', cols: 6
              },
              {
                key: 'email'
              },
            ],
            user: {
                firstName: 'John',
                lastName: 'Doe'
            },
            subBtn: {
                color: 'blue',
                text: 'Just do it!'
            }
        }   
    },
    methods: {
        submit: function(obj) {
            console.log(obj)
        }
    }
}
</script>

<style>

</style>