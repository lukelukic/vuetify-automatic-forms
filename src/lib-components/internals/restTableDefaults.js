let props = {
  tableProps: {
    type: Object,
    default: function() {
      return {}
    }
  },
  resource: {
    type: String,
    required: true
  },
  filters: {
    type: Array,
    required: true
  },
  filterPosition: {
    type: String,
    default: 'right',
    validator: function(value) {
      return ['left', 'right', 'top'].includes(value)
    }
  },
  headers: {
    type: Array,
    required: false,
    validator: function(value) {
      return !value.some(x => !x.text || !x.value)
    }
  },
  excludedHeaders: {
    type: Array,
    required: false,
    default: function() {
      return []
    }
  },
  columnWidth: {
    type: String | Number,
    required: false,
    default: 'auto',
    validator: function(value) {
      if (!isNaN(value)) {
        return true
      }
      return ['fit', 'auto'].includes(value)
    }
  },
  loadingMessage: {
    type: String,
    default: 'Loading data...'
  },
  imageColumn: {
    type: String,
    required: false
  },
  pagingSortingQsBuilder: {
    type: Function,
    default: function(options) {
      return defaultQueryStringBuilder(options)
    }
  },
  dataExtraction: {
    type: Object | Function,
    default: function() {
      return {
        dataProperty: undefined,
        totalItemsProperty: undefined
      }
    }
  },
  initialQueryParams: {
    required: false,
    default: function() {
      return {}
    }
  },
  processDataOn: {
    type: String,
    default: 'client',
    validator: function(value) {
      return ['client', 'server', 'mixed'].includes(value)
    }
  },
  inlineSearch: {
    type: Boolean,
    default: false
  },
  itemsPerPageText: {
    type: String,
    default: 'Rows per page'
  },
  rowActions: {
    type: Boolean,
    default: true
  },
  editFormElements: {
    type: Array,
    required: false
  }
}

function toSentenceCase(text) {
  var result = text.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}
function makeHeadersFromFirstItem(item, headersToExclude, table) {
  return Object.keys(item)
    .filter(x => !headersToExclude.includes(x))
    .map(key => {
      return {
        text: table.canTranslate(key)
          ? table.translate('$' + key)
          : toSentenceCase(key),
        value: key
      }
    })
}

function defaultQueryStringBuilder(options) {
  let qs = {
    paginate: true
  }
  qs.perPage = options.perPage
  qs.page = options.currentPage

  if (options.sorts.length) {
    qs.sortBy = options.sorts[0].sortBy + '.' + options.sorts[0].direction
    for (let i = 1; i < options.sorts.length; i++) {
      qs.sortBy +=
        ',' + options.sorts[i].sortBy + '.' + options.sorts[i].direction
    }
  }

  return qs
}

export default {
  props,
  toSentenceCase,
  makeHeadersFromFirstItem
}
