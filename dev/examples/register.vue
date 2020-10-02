<template>
  <v-row>
      <v-col cols="7" offset="2">
          <CrudForm :submit="submit" :cancel="cancel" :formElements="formElements" color="orange" type="insert" endpoint="http://ourdomain.com/register"/>
      </v-col>
  </v-row>
</template>

<script>
import { CrudForm } from '@/entry';
export default {
    components : {
        CrudForm
    },
    data() {
        return {
            submit: {
                text: 'Register',
                color: 'primary'
            },
            cancel: {
                text: 'Quit',
                color: 'red'
            },
            formElements: [
                {
                    key: 'firstName',
                    rules: 'required',
                    cols: 6
                },
                {
                    key: 'lastName',
                    rules: 'required',
                    cols: 6
                },
                {
                    key: 'email',
                    rules: 'required|email',
                },
                {
                    key: 'password',
                    type: 'password',
                    rules: 'required|min:8'
                },
                {
                    key: 'username',
                    rules: 'required|min:4'
                }
            ]
        }
    }
}
</script>

<style>

</style>