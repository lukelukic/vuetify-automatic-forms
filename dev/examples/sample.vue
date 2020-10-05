<template>
  <v-row>
      <v-col cols="7" offset="2">
          <FormBuilder color="info" :submit="submit" :cancel="cancel" :formElements="formElements" :handleSubmit="handle"/>
      </v-col>
  </v-row>
</template>

<script>
import $ from 'jquery'
export default {
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
                    hint: 'Mail sa domena edu'
                },
                {
                    key: 'profession',
                    component: 'v-autocomplete',
                    dataSource: [
                                        { "text" : "Programmer", value: 1 },
                                        { "text" : "Finance", value: 2 },
                                        { "text" : "Economist", value: 3 },
                    ],
                    cols: 6,
                    affects: [
                        {
                            key: 'job',
                            change: {
                                type: 'dataSource',
                                bindings: {
                                    "1" : [
                                        { "text" : "PHP", value: 1 },
                                        { "text" : "C#", value: 2 },
                                        { "text" : "Java", value: 3 },
                                    ],
                                    "2": [],
                                    "3": [
                                        { "text" : "Revision", value: 4 },
                                        { "text" : "Book handling", value: 5 },
                                        { "text" : "Finance", value: 6 },
                                    ],
                                    '' : []
                                }
                            }
                        },
                        {
                            key: 'job',
                            change: {
                                type: 'disable',
                                when: false
                            }
                        }
                    ]
                },
                {
                    key: 'job',
                    component: 'v-autocomplete',
                    dataSource: [],
                    disabled: true,
                    cols: 6
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
            },
        }
    },
    methods: {
        handle(obj) {
            console.log(obj)
        }
    }
}
</script>

<style>

</style>