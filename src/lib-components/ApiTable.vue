<template>
  <v-row>
    <v-col
      v-show="!isClientSide && filterPosition != 'top'"
      cols="3"
      xl="2"
      :order="filtersColOrder"
      style="padding-bottom:0px"
    >
      <v-card class="mt-7" id="apiTableFilters">
        <v-card-title class="caption font-weight-bold">{{
          translate(searchTitle)
        }}</v-card-title>
        <v-card-text>
          <SearchForm
            class="mt-2"
            :color="formFieldsColor"
            v-show="showSearchForm"
            ref="search"
            :formElements="filters"
            :endpoint="api.endpoint"
            @success="handleSearchResponse"
            :queryParams="initialQueryParamsLocal"
            :inline="filterPosition == 'top'"
            :submit="searchSubmit"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      style="padding-top:0px"
      :cols="isClientSide || filterPosition == 'top' ? 12 : 9"
      :xl="isClientSide || filterPosition == 'top' ? 12 : 10"
      :order="tableColOrder"
    >
      <v-row no-gutters class="pb-3">
        <v-col cols="3" id="headerSlot">
          <slot name="header"></slot>
        </v-col>
        <v-col cols="9">
          <template v-if="isClientSide">
            <v-row no-gutters>
              <v-col cols="9" offset="3" md="4" offset-md="8">
                <v-text-field
                  class="shrink"
                  outlined
                  dense
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="translate('$search', true)"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </template>

          <SearchForm
            v-if="!isClientSide && filterPosition == 'top'"
            v-show="showSearchForm"
            :color="formFieldsColor"
            ref="search"
            class="mr-4"
            :formElements="filters"
            :endpoint="api.endpoint"
            @success="handleSearchResponse"
            :queryParams="initialQueryParamsLocal"
            :inline="filterPosition == 'top'"
            :submit="searchSubmit"
          />
        </v-col>
      </v-row>
      <v-data-table
        :options.sync="options"
        :search="search"
        :headers="tableHeaders"
        v-bind="tableProps"
        :items="tableItems"
        :loading="loading"
        :server-items-length="totalItems"
        :footer-props="{
          'items-per-page-text': translate('$restTable.perPage'),
          'items-per-page-all-text': translate('$restTable.allRecords'),
          'items-per-page-options': itemsPerPageOptionsComp
        }"
      >
        <template
          v-for="column in specializedColumns"
          v-slot:[`item.${column.property}`]="{ item }"
        >
          <div v-if="column.type == 'image'" class="p-2" :key="column.property">
            <v-img :src="item[column.property]" height="50" width="50"></v-img>
          </div>

          <template v-if="column.type == 'check'">
            <v-btn
              :key="column.property"
              v-if="item[column.property]"
              text
              icon
              color="blue lighten-2"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              :key="column.property"
              v-else
              text
              icon
              color="red lighten-2"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>

          <template v-if="column.type == 'date'">
            {{ localDateTime(item[column.property]) }}
          </template>
        </template>

        <template v-slot:item.action="{ item }">
          <slot name="action" v-bind="item"></slot>
        </template>

        <template v-slot:item.dialog="{ item }">
          <slot name="dialog" v-bind="item"></slot>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import defaults from './internals/apiTableDefaults'
import apiTableMixin from './apiTableMixin'
import localizationMixin from './internals/localizationMixin'
import Vue from 'vue'
import { DateTime } from 'luxon'
export default {
  name: 'ApiTable',
  props: defaults.props,
  mixins: [apiTableMixin, localizationMixin],
  data() {
    return {
      search: '',
      tableItems: [],
      options: {},
      totalItems: undefined,
      initialQueryParamsLocal: {},
      loading: true
    }
  },
  methods: {
    localDateTime(dateTime) {
      var date = DateTime.fromISO(dateTime, { locale: Vue.prototype.locale })
      date.setLocale('en-GB')
      return date.toLocaleString(DateTime.DATETIME_MED)
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
