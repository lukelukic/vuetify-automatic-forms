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
      } else if (this.tableItems.length) {
        headers = defaults.makeHeadersFromFirstItem(
          this.tableItems[0],
          this.excludedHeaders
        )
      }

      headers.forEach(x => this.setHeaderWidth(x))

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

    if(this.callApiOnLoad) {
      this.$refs.search.executeSearch()
    }
  },
  methods: {
    processData(data) {
      if (typeof this.dataExtraction == 'function') {
        const converted = this.dataExtraction(data)
        this.totalItems = converted.totalItems
        this.tableItems = converted.items
      } else {
        if (this.dataExtraction.dataProperty) {
          const properties = this.dataExtraction.dataProperty.split('.')
          let tempData = data

          properties.forEach(p => {
            tempData = tempData[p]
          })

          this.tableItems = tempData
        } else {
          this.tableItems = data
        }
        this.totalItems = this.isClientSide ? undefined : data[this.dataExtraction.totalItemsProperty]

        console.log(this.tableItems)
      }
    },
    handleSearchResponse(data) {
      this.processData(data)

      if (this.imageColumn) {
        this.prepareImageProperties()
      }
    },
    prepareImageProperties() {
      this.tableItems.forEach(x => {
        x.image = x[this.imageColumn]
        delete x[this.imageColumn]
      })
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