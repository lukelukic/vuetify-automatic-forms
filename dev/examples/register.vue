<template>
  <v-row>
      <v-col cols="7" offset="2">
          <CrudForm :submit="submit" :cancel="cancel" :formElements="formElements" color="orange" type="insert" endpoint="http://ourdomain.com/register"/>
      </v-col>
  </v-row>
</template>
<script>

export default {
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
                    rules: 'required',
                    props: {
                        suffix: "@ict.edu.rs",
                    },
                    cols: 6
                },
                {
                    key: 'age',
                    rules: 'required',
                    min: '18',
                    max: '80',
                    component: 'v-slider',
                    props: {
                        min: 18,
                        max: 65
                    },
                    cols: 6
                },
                {
                    key: 'password',
                    type: 'password',
                    rules: 'required|min:8',
                    cols: 6
                },
                {
                    key: 'confirmPassword',
                    type: 'password',
                    rules: 'required|confirmed:password',
                    cols: 6
                },
                {
                    key: 'username',
                    rules: 'required|min:4',
                    label: 'Your username',
                    props: {
                        prefix: "Mr."
                    }
                }
            ]
        }
    }
}
</script>

<style>

</style>