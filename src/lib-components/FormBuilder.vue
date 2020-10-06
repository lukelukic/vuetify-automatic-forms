<template>
  <ValidationObserver ref="observer">
    <v-row>
      <v-col
        v-for="formElement in formElements"
        :cols="cols(formElement)"
        :offset="offset(formElement)"
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
          <datepicker v-if="component(formElement) == 'datepicker'" 
              :no-value-to-custom-elem="true" 
              v-model="formObject[formElement.key]"
              v-bind="formElement.props"
              >
              <v-text-field 
                :disabled="disabled[formElement.key]"
                :value="formObject[formElement.key]"
                :hint="hint(formElement)"
                v-show="!hidden[formElement.key]"
                @change="handleChange(formElement.key, $event, true)"
                :ref="formElement.key"
                v-bind:key="formElement.key"
                :label="label(formElement)"
                outlined
                :hide-detals="true"
                :error-messages="errors"
                :dense="mDense(formElement)"
                :color="mColor(formElement)"
                :clearable="mClearable(formElement)"
                persistent-hint
                v-bind="formElement.props" 
              />
          </datepicker>

          <component v-else
            :disabled="disabled[formElement.key]"
            :hint="hint(formElement)"
            v-show="!hidden[formElement.key]"
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
            :src="formObject[formElement.key]"
            :dense="mDense(formElement)"
            :color="mColor(formElement)"
            :clearable="mClearable(formElement)"
            persistent-hint
            v-bind="formElement.props"
          />
        </ValidationProvider>
      </v-col>
      <v-col cols="12">
        <v-btn small :color="submit.color" @click="performSubmit" class="float-right ml-3"
          > {{ submit.text }} </v-btn
        >
        <v-btn v-if="useCancel" small :color="cancel.color" @click="reset" class="float-right"
          >{{ cancel.text }}</v-btn
        >
      </v-col>
      
    </v-row>
  </ValidationObserver>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import formBuilderMixin from './FormBuilderMixin.js'
import propValidation from './internals/formBuilderPropValidations'
import EventBus from './internals/event-bus'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import Vue from 'vue'
Vue.component('datepicker', VueCtkDateTimePicker);

export default {
  name: 'FormBuilder',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mixins: [formBuilderMixin],
  props: {
    formElements: {
      type: Array,
      required: true,
      validator: propValidation.formElements
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
    },
    submit: {
      type: Object,
      required: false,
      default: function() {
        return {
          text: 'Submit',
          color: 'success'
        }
      },
      validator: propValidation.submit
    },
    useCancel: {
      type: Boolean,
      default: true
    },
    cancel: {
      type: Object,
      required: false,
      default: function() {
        return {
          text: 'Cancel',
          color: 'warning'
        }
      },
      validator: propValidation.cancel
    },
    additionalValidation: {
      type: Function,
      required: false
    },
    clearableInputs: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      date: "",
      formObject: {},
      dataSources: {},
      hidden: {},
      disabled: {},
    }
  },
  mounted: async function() {
    await this.prepareFormObject()
  },
  methods: {
    component: function(formElement) {
      return formElement.component ? formElement.component : 'v-text-field'
    },
    hint: function(formElement) {
      return formElement.hint ? formElement.hint : ''
    },
    mDense: function(formElement){
      if(Object.keys(formElement).includes("dense")){
        return formElement.dense
      }
      return this.dense
    },
    label: function(formElement) {
      if (formElement.label) {
        return formElement.label
      }
      return this.toSentenceCase(formElement.key)
    },
    type: function(formElement) {
      return formElement.type ? formElement.type : undefined
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
    offset: function(formElement) {
      return formElement.offset ? formElement.offset : 0
    },
    mColor: function(formElement) {
      return formElement.color ? formElement.color : this.color
    },
    mClearable: function(formElement) {
      return formElement.clearable ? formElement.clearable : this.clearableInputs
    },
    performSubmit() {
      this.$refs.observer.validate().then((valid) => {
        if (valid) {
          if(this.additionalValidation) {
            let errors = this.additionalValidation(this.formObject)
            
            if(Object.keys(errors).length) {
              this.$refs.observer.setErrors(errors)
              return
            }
          }
          let objectToSubmit = {}
          for (let prop in this.formObject) {
            if (
              !this.hidden[prop] &&
              this.formObject[prop] &&
              this.formObject[prop] !== false
            ) {
              
              if(prop.includes("_upload")) {
                let originalPropName = prop.split("_upload")[0]
                objectToSubmit[originalPropName] = this.formObject[prop]
              } else {
                objectToSubmit[prop] = this.formObject[prop]
              }
              
            }
          }
          try {
            this.handleSubmit(objectToSubmit)
            EventBus.$emit('SUCESSFULL_SUBMIT')
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
      for(let prop in this.formObject) {
        if(this.incommingObject && this.incommingObject[prop]) {
          this.formObject[prop] = this.incommingObject[prop]
        } else {
          this.formObject[prop] = ''
        }
      }
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
<style lang="css">
.v-text-field--outlined.v-input--dense .v-label {
  top: 6px
}

.v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot {
  min-height:30px;
}

.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner, .v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer
{
  margin-top:5px
}

.v-icon.v-icon {
  font-size: 18px;
}

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
