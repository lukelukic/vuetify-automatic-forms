<template>
  <v-file-input :value="value" v-bind="props" @change="handleInput($event)"></v-file-input>
</template>

<script>
export default {
    name: "VUpload",
    props: ['props', 'value'],
    data() {
        return {
            content: ''
        }
    },
    methods: {
        handleInput(event) {
            console.log(event)
        }
    }
} 
</script>

<style>

</style>