<template>
  <ValidationObserver ref="observer">
    <v-row>
      <v-col
        v-for="formElement in formElements"
        :cols="cols(formElement)"
        :key="formElement.key"
      >
        <ValidationProvider
          :vid="formElement.key"
          v-slot="{ errors }"
          :name="formElement.key"
          :rules="rules(formElement)"
          :key="formElement.key"
          v-if="!hidden[formElement.key]"
        >
          <component
            :disabled="disabled[formElement.key]"
            :placeholder="hint(formElement)"
            v-if="!hidden[formElement.key]"
            @change="handleChange(formElement.key, $event)"
            :is="component(formElement)"
            :ref="formElement.key"
            v-bind:key="formElement.key"
            :label="label(formElement)"
            :type="type(formElement)"
            :items="dataSources[formElement.key]"
            outlined
            :hide-detals="true"
            :error-messages="errors"
            v-model="formObject[formElement.key]"
            dense
            :color="mColor(formElement)"
          />
        </ValidationProvider>
      </v-col>
      <v-col cols="12">
        <v-btn small color="success" @click="submit" class="float-right ml-3"
          >Submit</v-btn
        >
        <v-btn small color="warning" @click="reset" class="float-right"
          >Cancel</v-btn
        >
      </v-col>
    </v-row>
  </ValidationObserver>
</template>
<script>
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate/dist/vee-validate.full'
import formBuilderMixin from './FormBuilderMixin.js'
import EventBus from './internals/event-bus'
export default {
  name: 'FormBuilder',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [formBuilderMixin],
  props: {
    formElements: {
      type: Array,
      required: true,
    },
    handleSubmit: {
      type: Function,
      required: true,
    },
    errors: {
      type: Object,
      required: false,
    },
    incommingObject: {
      type: Object,
      required: false,
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data: function() {
    return {
      formObject: {},
      dataSources: {},
      hidden: {},
      disabled: {},
    }
  },
  mounted: function() {
    this.prepareFormObject()
  },
  methods: {
    component: function(formElement) {
      return formElement.component ? formElement.component : 'v-text-field'
    },
    hint: function(formElement) {
      return formElement.hint ? formElement.hint : ''
    },
    label: function(formElement) {
      if (formElement.label) {
        return formElement.label
      }
      return this.toSentenceCase(formElement.key)
    },
    type: function(formElement) {
      return formElement.type ? formElement.type : ''
    },
    rules: function(formElement) {
      if (formElement.rules) {
        return formElement.rules
      }
      return ''
    },
    cols: function(formElement) {
      return formElement.cols ? formElement.cols : 12
    },
    mColor: function(formElement) {
      return formElement.color ? formElement.color : this.color
    },
    submit() {
      this.$refs.observer.validate().then((valid) => {
        if (valid) {
          let objectToSubmit = {}
          for (let prop in this.formObject) {
            if (
              !this.hidden[prop] &&
              this.formObject[prop] &&
              this.formObject[prop] !== false
            ) {
              objectToSubmit[prop] = this.formObject[prop]
            }
          }
          try {
            this.handleSubmit(objectToSubmit)
            EventBus.$emit('SUCESSFULL_INSERT')
          } catch (e) {
            throw new Error(
              'There was an error calling a provided function in FormBuilder',
              e
            )
          }
        }
      })
    },
    reset() {
      this.$refs.observer.reset()
      EventBus.$emit('FORM_RESET')
    },
    find(key) {
      return this.formElements.filter((x) => x.key == key)[0]
    },
  },
  watch: {
    errors: {
      handler() {
        this.$refs.observer.setErrors(this.errors)
      },
    },
  },
}
</script>
<style lang="css" scoped>
.col,
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12,
.col-auto,
.col-lg,
.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-lg-auto,
.col-md,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-md-auto,
.col-sm,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-sm-auto,
.col-xl,
.col-xl-1,
.col-xl-2,
.col-xl-3,
.col-xl-4,
.col-xl-5,
.col-xl-6,
.col-xl-7,
.col-xl-8,
.col-xl-9,
.col-xl-10,
.col-xl-11,
.col-xl-12,
.col-xl-auto {
  padding: 0px 5px 0px 5px !important;
}
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
</style>
