<template>
  <v-data-table v-bind="tableProps">

  </v-data-table>
</template>

<script>
import defaults from './internals/apiTableDefaults'
import apiTableMixin from './apiTableMixin'
export default {
    name: 'ApiTable',
    props: defaults.props,
    mixins:  [apiTableMixin]
}
</script>

<style>

</style>