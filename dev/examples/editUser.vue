<template>
  <v-row>
      <v-col cols="4" offset="4">
          <FormBuilder :formElements="formElements" :additionalValidation="validation" :errors="errors" :submit="subBtn" :incommingObject="user" :handleSubmit="submit" />
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
              {
                key: 'password',
                type: 'password'
              } 
            ],
            user: {
                firstName: 'John',
                lastName: 'Doe'
            },
            subBtn: {
                color: 'blue',
                text: 'Just do it!'
            },
            errors: {}
        }   
    },
    methods: {
        submit: function(obj) {
            console.log(obj)
        },
        validation: function(formObject) {
            let errors = {}

            if(formObject.password.indexOf(formObject.firstName) != -1) {
                errors.password = ["First name should not be contained inside password."]
            }
            
            return errors
        }
    },
}
</script>

<style>

</style>