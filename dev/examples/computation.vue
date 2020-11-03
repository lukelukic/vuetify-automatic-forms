<template>
  <v-row>
    <v-col cols="7" offset="2">
      <FormBuilder
        color="info"
        :submit="submit"
        :cancel="cancel"
        :formElements="formElements"
        @formSubmit="handle"
      />
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
          cols: 6,
          color: 'yellow',
          label: '$firstName',
          order: 2,
          affects: [
            {
              key: 'job',
              change: {
                type: 'order',
                bindings: {
                  1: 4
                }
              }
            },
            {
              key: 'lastName',
              change: {
                type: 'value',
                bindings: {
                  luka: 'lukic',
                  onNonEmpty: '123'
                }
              }
            }
          ]
        },
        {
          key: 'lastName',
          cols: 6,
          label: '$lastName',
          order: 5
        },
        {
          key: 'email',
          rules: 'required|email',
          hint: '$sentences.email',
          label: '$email',
          order: 4
        },
        {
          label: '$profession',
          key: 'profession',
          component: 'v-autocomplete',
          dataSource: [
            { text: 'Programmer', value: 1 },
            { text: 'Finance', value: 2 },
            { text: 'Economist', value: 3 }
          ],
          cols: 6,
          affects: [
            {
              key: 'job',
              change: {
                type: 'dataSource',
                api: {
                  endpoint: '/api/products'
                }
              }
            },
            {
              key: 'job',
              change: {
                type: 'disable',
                whenNot: function(val) {
                  return val == 3
                }
              }
            }
          ]
        },
        {
          key: 'job',
          component: 'v-autocomplete',
          dataSource: [],
          disabled: true,
          cols: 6,
          props: {
            multiple: true
          }
        },
        {
          key: 'chb',
          component: 'v-checkbox',
          cols: 6,
          label: 'Chbtext',
          affects: [
            {
              key: 'lastName',
              change: {
                type: 'value',
                bindings: {
                  true: 'lukic',
                  false: 'none'
                }
              }
            }
          ]
        },
        {
          key: 'jobTitle',
          color: 'green',
          component: 'v-text-field',
          disabled: true,
          computation: [
            {
              when: {
                job: 1,
                profession: 1
              },
              then: {
                value: 'Developer',
                disabled: false
              }
            },
            {
              when: {
                job: 2,
                profession: 1
              },
              then: {
                value: 'Architect',
                disabled: true
              }
            }
          ]
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
    handle(obj) {
      console.log(obj)
    }
  }
}
</script>

<style></style>
