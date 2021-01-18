<template>
  <ValidationObserver ref="observer">
    <v-row :class="inline ? 'justify-end' : 'justify-start'">
      <template v-for="formElement in formElementsOrdered">
        <v-col
          v-if="!hidden[formElement.key]"
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
              v-if="component(formElement) != 'datepicker'"
              :disabled="disabled[formElement.key]"
              :hint="hint(formElement)"
              @change="handleChange(formElement.key, $event)"
              @input="handleChange(formElement.key, $event)"
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
      </template>

      <slot></slot>

      <v-col :cols="inline ? 1 : 12" class="form-builder-input">
        <span :class="inline ? '' : 'float-right'">
          <v-btn
            id="formSubmitCancel"
            v-if="useCancel"
            small
            :disabled="loading"
            :color="cancel.color"
            @click="reset"
            >{{ translate(cancel.text, true) }}</v-btn
          >
          <v-btn
            id="formBuilderSubmit"
            :disabled="loading || !formIsValid"
            :loading="loading"
            small
            :color="submit.color"
            @click="performSubmit"
            class="ml-2"
          >
            {{ translate(submit.text, true) }}
          </v-btn>
        </span>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>
<script>
import formBuilderMixin from './FormBuilderMixin.js'
import formBuilderMethods from './internals/formBuilderMethods.js'
import formBuilderProps from './internals/formBuilderProps'
import localizationMixin from './internals/localizationMixin'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import Vue from 'vue'
Vue.component('datepicker', VueCtkDateTimePicker)
export default {
  name: 'FormBuilder',
  mixins: [formBuilderMixin, localizationMixin, formBuilderMethods],
  props: formBuilderProps,
  computed: {
    formElementsOrdered() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.localFormElements.sort((x, y) => {
        if (x.order > y.order) return 1

        return x.order < y.order ? -1 : 0
      })
    }
  },
  data: function() {
    return {
      formIsValid: true,
      date: '',
      formObject: {},
      dataSources: {},
      hidden: {},
      disabled: {},
      localFormElements: [],
      initialOrderings: {},
      initialCols: {}
    }
  },
  mounted: async function() {
    if (!this.$formBuilderAxios) {
      console.warn(
        'Axios not found on a vue instance. You will not be able to use AJAX based features.'
      )
    }
    this.formElements.forEach(x => {
      if (!x.order) {
        x.order = 999
      }
      this.localFormElements.push(x)
    })

    this.localFormElements.forEach(x => {
      this.$set(this.initialOrderings, x.key, x.order)
      this.$set(this.initialCols, x.key, x.cols)
    })

    await this.prepareFormObject()
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
<style lang="css"></style>
