<template>
  <div>
    <FormBuilder
      :formElements="formElements"
      @formSubmit="handleSubmit"
      @formReset="handleFormReset"
      :errors="validationErrors"
      :incommingObject="formObject"
      :submit="submit"
      :cancel="cancel"
      :useCancel="useCancel"
      :dense="dense"
      :color="color"
      :submitOnEnter="submitOnEnter"
      :submitOnLoad="submitOnLoad"
      ref="formBuilder"
      :loading="loading"
      :inline="inline"
    />
    <v-snackbar v-model="snackbar" v-if="snackbar" right :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'ApiForm',
  data: function() {
    return {
      snackbar: false,
      snackbarColor: 'success',
      snackbarText: 'Successfull insert.',
      validationErrors: {},
      loading: false
    }
  },
  props: {
    formElements: {
      type: Array,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    queryParams: {
      type: Object,
      required: false
    },
    color: {
      type: String,
      required: false
    },
    method: {
      type: String,
      default: 'POST'
    },
    validationErrorResponseCode: {
      type: Number,
      default: 422
    },
    formObject: {
      type: Object,
      required: false
    },
    submit: {
      type: Object,
      required: false
    },
    cancel: {
      type: Object,
      required: false
    },
    useCancel: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },
    contentType: {
      type: String,
      default: 'application/json'
    },
    successFn: {
      type: Function,
      required: false
    },
    errorFn: {
      type: Function,
      required: false
    },
    extractErrorsFn: {
      type: Function,
      required: false
    },
    validationErrorsProperty: {
      type: String,
      required: false
    },
    success: {
      type: Object,
      default: function() {
        return {
          color: 'success',
          message: 'An action executed successfully.'
        }
      }
    },
    error: {
      type: Object,
      default: function() {
        return {
          color: 'red',
          message: 'An error has occured. Please contact administrator.'
        }
      }
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
  methods: {
    callApi() {
      this.$refs.formBuilder.performSubmit()
    },
    handleFormReset() {
      this.$emit('formReset')
    },
    resetForm() {
      this.$refs.formBuilder.reset()
    },
    handleSubmit(formObject) {
      this.loading = true
      if (this.contentType == 'multipart/form-data') {
        formObject = this.getMultipartObject(formObject)
      }
      let request = {
        method: this.method,
        url: this.endpoint,
        data: formObject,
        headers: {
          'Content-Type': this.contentType
        },
        params:
          this.method == 'GET'
            ? { ...formObject, ...this.queryParams }
            : this.queryParams,
        paramsSerializer: function(params) {
          let qs = ''
          for (let param in params) {
            if (params[param] == '') {
              continue
            }
            if (Array.isArray(params[param])) {
              for (let item in params[param]) {
                qs += `${param}=${item}&`
              }
            } else {
              qs += `${param}=${params[param]}&`
            }
          }
          return qs
        }
      }

      this.$formBuilderAxios(request)
        .then(response => {
          this.loading = false
          if (this.successFn) {
            this.successFn(response.data)
          } else {
            this.snackbarColor = this.success.color
            this.snackbar = true
            this.snackbarText = this.success.message
          }
        })
        .catch(error => {
          this.loading = false
          if (error.response.status == this.validationErrorResponseCode) {
            if (this.extractErrorsFn) {
              this.setErrors(this.extractErrorsFn(error.response.data))
            } else {
              if (this.validationErrorsProperty) {
                const properties = this.validationErrorsProperty.split('.')
                let tempData = error.response.data

                properties.forEach(p => {
                  tempData = tempData[p]
                })

                this.setErrors(tempData)
              } else {
                this.setErrors(error.response.data)
              }
            }
          } else {
            if (this.errorFn) {
              this.errorFn(error.response)
            } else {
              this.snackbar = true
              this.snackbarColor = this.error.color
              this.snackbarText = this.error.message
            }
          }
        })
    },
    setErrors(errors) {
      this.validationErrors = {}
      for (let error of errors) {
        this.$set(this.validationErrors, error.propertyName, [error.error])
      }
    },
    getMultipartObject(formObject) {
      let formData = new FormData()

      for (let prop in formObject) {
        if (formObject[prop].isFormData) {
          for (let item of formObject[prop].items) {
            formData.append(prop, item)
          }
        } else {
          formData.append(prop, formObject[prop])
        }
      }

      return formData
    }
  }
}
</script>
