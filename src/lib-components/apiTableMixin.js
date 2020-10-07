import defaults from './internals/apiTableDefaults'
import pixelWidth from 'string-pixel-width'
export default {
  computed: {
    filtersColOrder: function() {
      return Number(this.filterPosition == 'right') + 1
    },
    tableColOrder: function() {
      return Number(this.filterPosition == 'left') + 1
    },
    tableHeaders: function() {
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
    }
  },
  mounted: function() {
    this.$refs.search.executeSearch()
  },
  methods: {
    handleSearchResponse(data) {
        this.tableItems = data

        if(this.imageColumn) {
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
