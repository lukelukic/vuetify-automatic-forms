<template>
  <ApiForm
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
    :submitOnEnter="submitOnEnter"
    :submitOnLoad="searchOnLoad"
    :queryParams="queryParams"
    ref="apiForm"
  />
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    formElements: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      required: false
    },
    endpoint: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: 'GET'
    },
    submit: {
      type: Object,
      default: function() {
        return {
          text: 'Search',
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
    searchOnLoad: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      required: false
    }
  },
  methods: {
    resultHandler: function(apiData) {
      this.$emit('success', apiData)
    },
    errorHandler: function(apiError) {
      this.$emit('error', apiError)
    },
    executeSearch: function() {
      this.$refs.apiForm.callApi()
    }
  }
}
</script>

<style></style>
