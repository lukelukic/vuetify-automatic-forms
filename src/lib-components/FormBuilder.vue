<template>
  <ValidationObserver ref="observer">
    <v-row :class="inline ? 'justify-end' : 'justify-start'">
      <v-col
        v-for="formElement in formElements"
        :cols="cols(formElement)"
        :offset="offset(formElement)"
        :key="formElement.key"
        class="form-builder-input"
      >
        <ValidationProvider
          :vid="formElement.key"
          v-slot="{ errors }"
          :name="formElement.key"
          :rules="rules(formElement)"
          :key="formElement.key"
          v-if="!hidden[formElement.key]"
        >
          <datepicker
            v-if="component(formElement) == 'datepicker'"
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
              :hide-details="true"
              :error-messages="errors"
              :dense="mDense(formElement)"
              :color="mColor(formElement)"
              :clearable="mClearable(formElement)"
              persistent-hint
              v-bind="formElement.props"
            />
          </datepicker>

          <component
            v-else
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
            hide-details="auto"
            :error-messages="errors"
            v-model="formObject[formElement.key]"
            :src="formObject[formElement.key]"
            :dense="mDense(formElement)"
            :color="mColor(formElement)"
            :clearable="mClearable(formElement)"
            persistent-hint
            v-bind="formElement.props"
            v-on:keyup.enter="onEnter"
          />
        </ValidationProvider>
      </v-col>
      <v-col
        :cols="inline ? 1 : 12"
        class="form-builder-input"
        style="margin-top:2px"
      >
        <span :class="inline ? '' : 'float-right'">
          <v-btn v-if="useCancel" small :color="cancel.color" @click="reset">{{
            translate(cancel.text)
          }}</v-btn>
          <v-btn
            small
            :color="submit.color"
            @click="performSubmit"
            class="ml-2"
          >
            {{ translate(submit.text) }}
          </v-btn>
        </span>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import formBuilderMixin from './FormBuilderMixin.js'
import localizationMixin from './internals/localizationMixin'
import propValidation from './internals/formBuilderPropValidations'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import Vue from 'vue'
Vue.component('datepicker', VueCtkDateTimePicker)
export default {
  name: 'FormBuilder',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mixins: [formBuilderMixin, localizationMixin],
  props: {
    formElements: {
      type: Array,
      required: true,
      validator: propValidation.formElements
    },
    errors: {
      type: Object,
      required: false
    },
    incommingObject: {
      type: Object,
      required: false
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
          text: '$submit',
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
          text: '$cancel',
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
    },
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    submitOnLoad: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      date: '',
      formObject: {},
      dataSources: {},
      hidden: {},
      disabled: {}
    }
  },
  mounted: async function() {
    if (!this.$formBuilderAxios) {
      console.warn(
        'Axios not found on a vue instance. You will not be able to use AJAX based features.'
      )
    }
    await this.prepareFormObject()
    if (this.submitOnLoad) {
      this.performSubmit()
    }
  },
  methods: {
    onEnter: function() {
      if (this.submitOnEnter) {
        this.performSubmit()
      }
    },
    component: function(formElement) {
      return formElement.component ? formElement.component : 'v-text-field'
    },
    hint: function(formElement) {
      if (!formElement.hint) {
        return undefined
      }

      if (this.shouldBeTranslated(formElement.hint)) {
        return this.translate(formElement.hint)
      }

      return formElement.hint
    },
    mDense: function(formElement) {
      if (Object.keys(formElement).includes('dense')) {
        return formElement.dense
      }
      return this.dense
    },
    label: function(formElement) {
      if (formElement.label) {
        if (this.shouldBeTranslated(formElement.label)) {
          return this.translate(formElement.label, true)
        }
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
      return formElement.clearable
        ? formElement.clearable
        : this.clearableInputs
    },
    performSubmit() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          if (this.additionalValidation) {
            let errors = this.additionalValidation(this.formObject)

            if (Object.keys(errors).length) {
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
              if (prop.includes('_upload')) {
                let originalPropName = prop.split('_upload')[0]
                objectToSubmit[originalPropName] = this.formObject[prop]
              } else {
                objectToSubmit[prop] = this.formObject[prop]
              }
            }
          }
          try {
            this.$emit('formSubmit', objectToSubmit)
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
      for (let prop in this.formObject) {
        if (this.incommingObject && this.incommingObject[prop]) {
          this.formObject[prop] = this.incommingObject[prop]
        } else {
          this.formObject[prop] = ''
        }
      }
      this.$emit('formReset')
    },
    find(key) {
      return this.formElements.filter(x => x.key == key)[0]
    }
  },
  watch: {
    errors: {
      handler() {
        this.$refs.observer.setErrors(this.errors)
      }
    },
    incommingObject: function() {
      this.populateValuesBasedOnIncommingObject()
    }
  }
}
</script>
<style lang="css">
.v-text-field--outlined.v-input--dense .v-label {
  top: 6px;
}

.v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot {
  min-height: 30px;
}

.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__append-inner,
.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__append-outer,
.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__prepend-inner,
.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__prepend-outer,
.v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__append-inner,
.v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__append-outer,
.v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__prepend-inner,
.v-text-field--full-width.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
  .v-input__prepend-outer {
  margin-top: 5px;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px;
}
.v-icon.v-icon {
  font-size: 18px;
}

.form-builder-input {
  padding: 0 5px 10px 5px !important;
}
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
</style>
