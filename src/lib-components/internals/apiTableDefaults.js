let props = {
  tableProps: {
    type: Object,
    default: function() {
      return {}
    }
  },
  filters: {
    type: Array,
    required: true
  },
  filterPosition: {
    type: String,
    default: 'right',
    validator: function(value) {
      return ['left', 'right'].includes(value)
    }
  },
  get: {
    type: Object,
    required: true,
    validator: function(value) {
      let errors = []
      if (!value.endpoint) {
        errors.push('endpoint is required property.')
      }

      errors.forEach(e => console.warn(e))

      return !errors.length
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
    default: 'fit',
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
  serverSide: {
      type: Object,
      default: function() {
          return null
      }
  }
}

function toSentenceCase(text) {
  var result = text.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}
function makeHeadersFromFirstItem(item, headersToExclude) {
  return Object.keys(item)
    .filter(x => !headersToExclude.includes(x))
    .map(key => {
      return {
        text: toSentenceCase(key),
        value: key
      }
    })
}

function defaultQueryStringBuilder(options) {
  let qs = '?paginate=true'
  qs += '&perPage=' + options.perPage
  qs += '&page=' + options.currentPage

  if (options.sorts.length) {
    qs +=
      '&sortBy=' +
      options.sorts[0].sortBy +
      '.' +
      options.sorts[0].direction
    for (let i = 1; i < options.sorts.length; i++) {
      qs +=
        ',' +
        options.sorts[i].sortBy +
        '.' +
        options.sorts[i].direction
    }
  }

  return qs
}

export default {
  props,
  toSentenceCase,
  makeHeadersFromFirstItem
}
