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
              text: 'Developer',
              value: 1
            },
            {
              text: 'Loyer',
              value: 2
            },
            {
              text: 'Actor',
              value: 3
            }
          ],
          props: {
            multiple: true
          }
        }
      ],
      user: {
        firstName: 'John',
        lastName: 'Doe',
        jobs: [1, 2]
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
