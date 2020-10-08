<template>
  <v-row>
    <v-col :cols="serverSide? 2 : 0" :order="filtersColOrder">
      <SearchForm
        v-show="serverSide"
        ref="search"
        class="ml-4"
        :formElements="filters"
        :endpoint="get.endpoint"
        @success="handleSearchResponse"
        :queryParams="initialQueryParams"
      />
    </v-col>
    <v-col :cols="serverSide ? 10 : 12" :order="tableColOrder">
      <v-card-title v-if="!serverSide">
      Nutrition
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
      <v-data-table
        :options.sync="options"
        :search="search"
        class="mr-4 ml-4"
        :headers="tableHeaders"
        v-bind="tableProps"
        :items="tableItems"
        :loading="!tableItems.length"
        :loading-text="loadingMessage"
        :server-items-length="totalItems"
      >
        <template v-slot:item.image="{ item }">
          <div class="p-2">
            <v-img :src="item.image" :alt="item.name" width="100"></v-img>
          </div>
        </template>
      </v-data-table>
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
      search: "",
      tableItems: [],
      options: {},
      isInitialOptionsChange: true,
      totalItems: null
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

        this.initialQueryParams = this.pagingSortingQsBuilder({
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
