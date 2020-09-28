import $ from 'jquery'

function buildDataSource(formElement) {
  if (formElement.dataSource) {
    return addFirstOption(formElement.dataSource)
  }
  if (!formElement.api) {
    throw new Error(
      formElement.component +
        ' must have defined dataSource property or appropriate api settings.'
    )
  }

  let items = loadDataSourceFromApi(formElement.api)

  return addFirstOption(items)
}

function addFirstOption(dataSource) {
  dataSource.unshift({
    text: 'Choose...',
    value: '',
  })
  return dataSource
}

function shouldContainDataSource(formElement) {
  let elementsWithDataSource = ['v-autocomplete', 'v-select']
  return elementsWithDataSource.includes(formElement.component)
}

function loadDataSourceFromApi(api) {
  let items = []

  $.ajax({
    url: api.endpoint,
    async: false,
    success: function(data) {
      items = data
    },
  })

  if (!api.textProperty) {
    api.textProperty = 'name'
    api.valueProperty = 'id'
  }

  items.forEach((i) => {
    (i.text = i[api.textProperty]), (i.value = i[api.valueProperty])
  })

  return items
}

export default {
  buildDataSource,
  shouldContainDataSource,
  addFirstOption,
}
