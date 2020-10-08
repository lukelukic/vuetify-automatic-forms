<template>
  <ApiTable :filters="filters" />
</template>

<script>
export default {
  name: 'RestTable',
  data() {
    return {
      filters: []
    }
  }
}
</script>

<style></style>
