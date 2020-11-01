<template>
  <div>
    {{ data }}
    <br /><br />
    <v-btn @click="exit">Exit</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  methods: {
    exit() {
      this.$emit('close')
    }
  }
}
</script>

<style></style>
