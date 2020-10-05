/* eslint-disable import/prefer-default-export */
import vue from 'vue'
import FormBuilder from './FormBuilder.vue'
import CrudForm from './CrudForm.vue'

vue.component('FormBuilder', FormBuilder)
vue.component('CrudForm', CrudForm)

export { default as VuetifyFormBuilderSample } from './vuetify-form-builder-sample.vue';
export { default as FormBuilder } from './FormBuilder.vue';
export { default as CrudForm } from './CrudForm.vue';
