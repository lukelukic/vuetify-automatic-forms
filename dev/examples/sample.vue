<template>
  <v-row>
      <v-col cols="4" offset="4">
          <FormBuilder color="purple" :submit="submit" :cancel="cancel" :formElements="formElements" :handleSubmit="submit"/>
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
                    key: 'firstName',
                    cols: 6,
                    color: 'yellow'
                },
                {
                    key: 'lastName',
                    cols: 6
                },
                {
                    key: 'email',
                    rules: 'required|email',
                }
            ],
            cancel: {
                text: 'Poništi',
                color: 'red'
            },
            submit: {
                text: 'Potvrdi',
                color: 'info'
            }
        }
    },
    methods: {
        submit(obj) {
            console.log(obj)
        }
    }
}
</script>

<style>

</style>