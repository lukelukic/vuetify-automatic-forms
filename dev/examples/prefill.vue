<template>
  <v-row>
    <v-col cols="7" offset="2">
      <FormBuilder
        :formElements="formElements"
        :additionalValidation="validation"
        :incommingObject="user"
        @formSubmit="submit"
      >
        <v-checkbox label="Slot checkbox" />
      </FormBuilder>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
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
          key: 'email'
        },
        {
          key: 'password',
          type: 'password'
        },
        {
          key: 'date',
          component: 'datepicker',
          props: {
            onlyDate: true
          }
        },
        {
          key: 'jobs',
          component: 'v-autocomplete',
          dataSource: [
            {
              text: '$developer',
              value: 0
            },
            {
              text: 'Loyer',
              value: 1
            },
            {
              text: 'Actor',
              value: 2
            }
          ]
        }
      ],
      user: {
        firstName: 'John',
        lastName: 'Doe',
        jobs: 0
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

      if (formObject.password.indexOf(formObject.firstName) != -1) {
        errors.password = [
          'First name should not be contained inside password.'
        ]
      }

      return errors
    }
  }
}
</script>

<style></style>
