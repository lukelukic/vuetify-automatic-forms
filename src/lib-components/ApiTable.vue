<template>
  <v-row>
    <v-col cols="2" :order="filtersColOrder">
      <SearchForm
        ref="search"
        class="ml-4"
        :formElements="filters"
        :endpoint="get.endpoint"
        @success="handleSearchResponse"
      />
    </v-col>
    <v-col cols="10" :order="tableColOrder">
      <v-data-table
        :options.sync="options"
        class="mr-4 ml-4"
        v-if="tableItems.length"
        :headers="tableHeaders"
        v-bind="tableProps"
        :items="tableItems"
      >
        <template v-slot:item.image="{ item }">
          <div class="p-2">
            <v-img :src="item.image" :alt="item.name" width="100"></v-img>
          </div>
        </template>
      </v-data-table>
      <v-skeleton-loader
        v-else
        class="mx-auto"
        type="table"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import defaults from './internals/apiTableDefaults'
import apiTableMixin from './apiTableMixin'
export default {
  name: 'ApiTable',
  props: defaults.props,
  mixins: [apiTableMixin],
  data() {
    return {
      tableItems: [],
      options: {},
      initialQueryString: '',
      isInitialOptionsChange: true
    }
  },
  watch: {
    options: {
      handler() {
        if(!this.serverSide) {
          return
        }

        let sorts = []
        if (this.options.sortBy.length) {
          for (let i = 0; i < this.options.sortBy.length; i++) {
            sorts.push({
              sortBy: this.options.sortBy[i],
              direction: this.options.sortDesc[i] ? 'desc' : 'asc'
            })
          }
        }

        this.initialQueryString = this.pagingSortingQsBuilder({
          perPage: this.options.itemsPerPage,
          currentPage: this.options.page,
          sorts: sorts
        })

        if(!this.isInitialOptionsChange) {
          this.$refs.search.executeSearch()
        }

        this.isInitialOptionsChange = false
      }
    }
  }
}
</script>

<style></style>
