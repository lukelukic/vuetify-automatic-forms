<template>
  <div>
    <FormBuilder
      :formElements="formElements"
      :handleSubmit="handleInsert"
      :errors="validationErrors"
      :incommingObject="updateObject"
      :submit="submit"
      :cancel="cancel"
      :useCancel="useCancel"
      :dense="dense"
    />
    <v-snackbar v-model="snackbar" right :color="snackbarColor">
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
import FormBuilder from './FormBuilder.vue'

export default {
  name: 'ApiForm',
  components: {
    FormBuilder,
  },
  data: function() {
    return {
      snackbar: false,
      snackbarColor: 'success',
      snackbarText: 'Successfull insert.',
      validationErrors: {},
      allowedTypes: ['insert', 'update'],
    }
  },
  props: {
    formElements: {
      type: Array,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'POST',
    },
    validationErrorResponseCode: {
      type: Number,
      default: 422,
    },
    type: {
      type: String,
      default: "insert",
    },
    updateObject: {
      type: Object,
      required: false,
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
    clientErrorProperty: {
      type: String,
      required: false
    }
  },
  beforeMount() {
    if (!this.allowedTypes.includes(this.type)) {
      throw new Error(
        'Invalid value for prop "type". Use either "insert" or "update".'
      )
    }

    if (this.type == 'update' && !this.updateObject) {
      throw new Error(
        'Prop "updateObject" is required when update form is used.'
      )
    }
  },
  methods: {
    handleInsert(objectToInsert) {

      if(this.contentType == "multipart/form-data") {
        objectToInsert = this.getMultipartObject(objectToInsert)
      }

      this.$formBuilderAxios({
        method: this.method,
        url: this.endpoint,
        data: objectToInsert,
        headers: {
          'Content-Type' : this.contentType
        }
      })
        .then((response) => {
          if(this.successFn) {
              this.successFn(response.data) 
          } else {
              this.snackbarColor = 'success'
              this.snackbar = true
              this.snackbarText = 'Successfull insert.'
          }
          
        })
        .catch((error) => {
          if (error.response.status == this.validationErrorResponseCode) {
            if(this.extractErrorsFn) {
              this.setErrors(this.extractErrorsFn(error.response.data))
            } else {
              if(this.clientErrorProperty) {
                const properties = clientErrorProperty.split(".")
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
            if(this.errorFn) {
              this.errorFn(error.response)
            } else {
              this.snackbar = true
              this.snackbarColor = 'red'
              this.snackbarText = 'An error has occured. Please contact administrator.'
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
      
      for(let prop in formObject) {
        if(formObject[prop].isFormData) {
          for(let item of formObject[prop].items) {
            formData.append(prop, item)
          }
        } else {
          formData.append(prop, formObject[prop])
        }
        
      }

      return formData
    }
  }, 
  watch: {
    incommingObject: {
      handler() {
        console.log('Izmena')
      },
    },
  },
}
</script>
