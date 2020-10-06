# Vuetify Automatic Forms
Configuration based automatic form building, validation and API integration and more!

## The goal of the library

Web forms occupy some part of our development process. Numerous UI frameworks and components are written to help us dealing with them. 
But still, we have to write a lot of boilerplate code over and over to make use of them. Here are some steps we've found common during our development tasks:

1. Choose web form elements and layout them in some meaningful manner
2. If we're doing an update, there should be some kind of form prefill
3. Manage form elements affecting each other (eg. One dropdown change changes the datasource for another dropdown)
4. Perform a client side validation
5. Display validation error messages
6. Form and execute an Ajax request
7. React on server response (either error or success)

These are common scenarios we encounter very often in our day to day job and although easy, occupy much of our work time. Thats the reason we developed this library. It's built on top on Vuetify form elements and is used to do all these steps automatically, based on a configuration. 

Since form can be used for a veriety of use-cases, there are several components designed to tackle different scenarios. 
All of them are dependent on the core form component: ***FormBuilder***.  

# Installation

Install the package:
```
npm install vuetify-automatic-forms
````

This library is built on top of Vuetify Component framework. Bearing that in mind, your project should already have Vuetify fully setup. 

It can be either globally installed using like this in your entry file:

```js
import Vue from 'vue'
import VuetifyFormBuilder from 'vuetify-automatic-forms'

Vue.use(VuetifyFormBuilder)
```

Or you can import the exact component you need in your component's import section.

The installation process is now done! Let's write some code.

## FormBuilder component

FormBuilder component is the core component of the library. It is used to create a form based on array of objects serving as a configration for each form element and on form submit, if form is valid, call your *function* passing in an object made from user input. 

Here is a quick example:

```vue
<template>
  <v-row>
    <v-col cols="4" offset="4">
      <FormBuilder :formElements="formElements" :handleSubmit="handle" />
    </v-col>
  </v-row>
</template>
<script>
import { FormBuilder } from 'vuetify-automatic-forms'
export default {
  name: 'App',
  components: {
    FormBuilder
  },
  data() {
    return {
      formElements: [
        {
          key: 'firstName',
          component: 'v-textarea',
          rules: 'required'
        },
        {
          key: 'price',
          type: 'number'
        }
      ]
    }
  },
  methods: {
    handle: function(obj) {
      console.log(obj)
    }
  }
}
</script>
```

In the above example, we're passing two props to the dynamic form:
1. **form-elements** (Array of Objects)
2. **handleSubmit** (Function)

Used like this, it will produce a form containing two input elements: **v-textarea** and **v-text-field** along with a **submit** and **cancel** buttons. User's click on **submit** button will first trigger a client-side validation, and then, if valid, call the function provided as a prop **handleSubmit**. In this example, console output should look something like this:
```js
{
    firstName: "John",
    price: "120"
}
```

In a realworld scenario, you would just use the resulting object and append it to queryString to do a search or something similar.
