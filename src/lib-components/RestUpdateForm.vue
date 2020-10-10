<template>
  <ApiForm
    v-if="formObject"
    :formElements="formElements"
    :endpoint="endpoint"
    :method="method"
    :useCancel="useCancel"
    :cancel="cancel"
    :submit="submit"
    :dense="dense"
    :color="color"
    :successFn="resultHandler"
    :errorFn="errorHandler"
    :formObject="formObject"
    :submitOnEnter="submitOnEnter"
    @formReset="handleFormReset"
    :extractErrorsFn="extractErrorsFn"
    :validationErrorsProperty="validationErrorsProperty"
  />
</template>

<script>
export default {
  name: 'RestUpdateForm',
  props: {
    formElements: {
      type: Array,
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: false
    },
    method: {
      type: String,
      default: 'PUT'
    },
    submit: {
      type: Object,
      default: function() {
        return {
          text: '$update',
          color: 'primary'
        }
      }
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
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    extractErrorsFn: {
      type: Function,
      required: false
    },
    validationErrorsProperty: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      formObject: null
    }
  },
  async beforeMount() {
    var response = await this.$formBuilderAxios.get(this.endpoint)

    this.formObject = response.data
  },
  computed: {
    endpoint: function() {
      return `${this.resource}/${this.id}`
    }
  },
  methods: {
    resultHandler: function(apiData) {
      this.$emit('success', apiData)
    },
    errorHandler: function(apiError) {
      this.$emit('error', apiError)
    },
    handleFormReset() {
      this.$emit('formReset')
    }
  },
  watch: {
    id: async function() {
      var response = await this.$formBuilderAxios.get(this.endpoint)

      this.formObject = response.data
    }
  }
}
</script>

<style></style>
