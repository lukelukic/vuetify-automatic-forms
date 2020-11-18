import defaults from './internals/apiTableDefaults'
import pixelWidth from 'string-pixel-width'
export default {
  computed: {
    filtersColOrder() {
      return Number(this.filterPosition == 'right') + 1
    },
    tableColOrder() {
      return Number(this.filterPosition == 'left') + 1
    },
    tableHeaders() {
      let headers = []

      if (this.headers) {
        headers = this.headers
        headers.forEach(x => {
          x.text = this.translate(x.text)
        })
      } else if (this.tableItems.length) {
        headers = defaults.makeHeadersFromFirstItem(
          this.tableItems[0],
          this.excludedHeaders,
          this
        )
      }

      if (this.useCustomDialog) {
        if (!headers.some(x => x.text == 'Operation')) {
          headers.push({
            text: 'Operation',
            value: 'dialog',
            width: '80',
            sortable: false
          })
        }
      }

      if (this.rowActions) {
        if (!headers.some(x => x.value == 'action')) {
          headers.push({
            text: this.translate('$action'),
            value: 'action',
            width: '80',
            sortable: false
          })
        }
      }

      if (this.tableItems.length) {
        headers.forEach(x => this.setHeaderWidth(x))
      }

      return headers
    },
    isClientSide() {
      return this.processDataOn == 'client'
    },
    isMixed() {
      return this.processDataOn == 'mixed'
    },
    callApiOnLoad() {
      return this.isMixed || this.isClientSide
    },
    showSearchForm() {
      return !this.isClientSide
    },
    filterCols() {
      return this.isClientSide ? 0 : 2
    },
    tableCols() {
      return !this.isClientSide ? 10 : 12
    }
  },
  mounted: function() {
    if (this.processDataOn == 'server' && !this.dataExtraction) {
      throw new Error(
        "dataExtraction prop is required when processDataOn is set to 'server'"
      )
    }
    this.initialQueryParamsLocal = this.initialQueryParams

    if (this.callApiOnLoad) {
      this.$refs.search.executeSearch()
    }
  },
  methods: {
    refreshTable() {
      this.$refs.search.executeSearch()
    },
    processData(data) {
      this.loading = true
      let tableData = []
      if (typeof this.dataExtraction == 'function') {
        const converted = this.dataExtraction(data)
        this.totalItems = converted.totalItems
        tableData = converted.items
      } else {
        if (this.dataExtraction.dataProperty) {
          const properties = this.dataExtraction.dataProperty.split('.')
          let tempData = data

          properties.forEach(p => {
            tempData = tempData[p]
          })

          tableData = tempData
        } else {
          tableData = data
        }
        this.totalItems = this.isClientSide
          ? undefined
          : data[this.dataExtraction.totalItemsProperty]
      }
      if (tableData.length) {
        for (let key in this.formatters) {
          if (Object.keys(tableData[0]).includes(key)) {
            tableData.forEach(x => {
              x[key] = this.formatters[key](x[key])
            })
          }
        }
      }
      this.tableItems = tableData
      this.loading = false
    },
    handleSearchResponse(data) {
      this.processData(data)
    },
    setHeaderWidth: function(header) {
      if (!isNaN(this.columnWidth)) {
        header.width = this.columnWidth
        return
      }

      if (this.columnWidth == 'fit') {
        let firstDataItem = this.tableItems[0]
        let columnWidths = {}
        for (let key of Object.keys(firstDataItem)) {
          columnWidths[key] = pixelWidth(firstDataItem[key], { size: 13 })
        }
        let headerTextWidth = pixelWidth(header.text, { size: 13 })
        header.width =
          columnWidths[header.value] > headerTextWidth
            ? columnWidths[header.value] + 50
            : headerTextWidth + 50
      } else {
        this.columnWidth = 'auto'
      }
    }
  }
}
