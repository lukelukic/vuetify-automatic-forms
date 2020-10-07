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
          text: 'Update',
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
    }
  },
  data() {
    return {
      formObject: null
    }
  },
  async beforeMount() {
    var that = this

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
    }
  },
  watch: {
    id: async function() {
      var that = this

      var response = await this.$formBuilderAxios.get(this.endpoint)

      this.formObject = response.data
    }
  }
}
</script>

<style></style>
