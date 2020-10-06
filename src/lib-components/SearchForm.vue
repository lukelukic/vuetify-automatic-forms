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
  />
</template>

<script>
export default {
    props: {
        resultHandler: {
            type: Function,
            required: true
        },
        formElements: {
            type: Array,
            required: true,
        },
        color: {
            type: String,
            required: false,
        },
        endpoint: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            default: 'GET',
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
    }
}
</script>

<style>

</style>