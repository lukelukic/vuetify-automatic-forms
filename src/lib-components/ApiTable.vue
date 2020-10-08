<template>
  <v-row>
    <v-col :cols="filterPosition == 'top' ? 12 : 2" :order="filtersColOrder" style="padding-bottom:0px">
      <SearchForm
        v-show="showSearchForm"
        ref="search"
        class="ml-4"
        :formElements="filters"
        :endpoint="get.endpoint"
        @success="handleSearchResponse"
        :queryParams="initialQueryParamsLocal"
        :inline="filterPosition == 'top'"
      />
    </v-col>
    <v-col
    style="padding-top:0px"
      :cols="isClientSide || filterPosition == 'top' ? 12 : 10"
      :order="tableColOrder"
    >
      <v-card-title v-if="isClientSide">
        Data Table
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field
          outlined
          dense
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :options.sync="options"
        :search="search"
        class="mr-4 ml-4 elevation-1"
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
      search: '',
      tableItems: [],
      options: {},
      totalItems: undefined,
      initialQueryParamsLocal: {}
    }
  },
  watch: {
    /**
     * On table load, options will change to set the initial page and per page properties
     * That will trigger options watch handler which will in turn trugger the first API call
     */
    options: {
      handler() {
        if (this.isClientSide || this.isMixed) {
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

        this.initialQueryParamsLocal = this.pagingSortingQsBuilder({
          perPage: this.options.itemsPerPage,
          currentPage: this.options.page,
          sorts: sorts
        })

        this.$refs.search.executeSearch()
      }
    },
    initialQueryParams: {
      handler() {
        this.initialQueryParamsLocal = this.initialQueryParams
      }
    }
  }
}
</script>

<style></style>
