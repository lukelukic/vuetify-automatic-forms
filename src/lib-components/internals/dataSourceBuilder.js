var axios = undefined

async function buildDataSource(formElement) {
  if (Array.isArray(formElement.dataSource)) {
    return formElement.props?.multiple
      ? formElement.dataSource
      : addFirstOption(formElement.dataSource)
  }

  if (typeof formElement.dataSource == 'function') {
    return formElement.props?.multiple
      ? formElement.dataSource()
      : addFirstOption(formElement.dataSource())
  }

  if (!formElement.dataSource.endpoint) {
    throw new Error(
      formElement.component +
        ' must have defined dataSource property or appropriate api settings.'
    )
  }

  let items = await loadDataSourceFromApi(
    formElement.dataSource,
    formElement.dataSource.dataProperty,
    formElement.dataSource.dataFn
  )

  return formElement.props?.multiple ? items : addFirstOption(items)
}

function addFirstOption(dataSource) {
  dataSource.unshift({
    text: 'Choose...',
    value: ''
  })
  return dataSource
}

function shouldContainDataSource(formElement) {
  if (!formElement.component) {
    return false
  }
  let elementsWithDataSource = ['v-autocomplete', 'v-select']
  return (
    elementsWithDataSource.includes(formElement.component) ||
    formElement.component.toLowerCase().includes('select')
  )
}

async function loadDataSourceFromApi(
  api,
  dataProperty,
  dataExtractionFunction
) {
  let items = []

  try {
    let isMultiple = api.endpoint.split(',').length > 1

    if (isMultiple) {
      let qs = api.endpoint.split('?')[1]
      if (qs) {
        let qsParams = qs.split('&')
        let lastQsParam = ''
        if (qsParams.length) {
          lastQsParam = qsParams[qsParams.length - 1]
        } else {
          lastQsParam = qsParams
        }
        let paramName = lastQsParam.split('=')[0]
        let paramValues = lastQsParam.split('=')[1].split(',')

        let qsAppend = ''

        for (let value of paramValues) {
          qsAppend += `${paramName}=${value}&`
        }

        api.endpoint = api.endpoint.replace(lastQsParam, qsAppend)
      }
    }
    let response = await axios({
      url: api.endpoint,
      method: api.method ? api.method : 'GET'
    })

    var data = response.data

    if (!data) {
      throw new Error(
        'DataSource error: server responded successfully, but returned no data. Endpoint - ' +
          api.endpoint
      )
    }

    if (dataExtractionFunction && typeof dataExtractionFunction == 'function') {
      items = dataExtractionFunction(data)
      return
    }

    if (!dataProperty) {
      items = data
    } else {
      const properties = dataProperty.split('.')
      let tempData = data

      properties.forEach(p => {
        tempData = tempData[p]
      })

      items = tempData
    }

    if (!api.textProperty) {
      api.textProperty = 'name'
    }

    if (!api.valueProperty) {
      api.valueProperty = 'id'
    }

    if (!items.length) {
      return []
    }

    if (!Object.keys(items[0]).includes(api.textProperty)) {
      throw new Error(
        'API objects do not contain provided textProperty - ' + api.textProperty
      )
    }

    if (!Object.keys(items[0]).includes(api.valueProperty)) {
      throw new Error(
        'API objects do not contain provided valueProperty - ' +
          api.valueProperty
      )
    }

    return items.map(x => {
      return {
        text: x[api.textProperty],
        value: x[api.valueProperty]
      }
    })
  } catch (error) {
    console.log(error.response)
    throw new Error('Failed to load the datasource from ' + api.endpoint + '.')
  }
}

export default {
  buildDataSource,
  shouldContainDataSource,
  addFirstOption,
  setAxios: function(axiosInstance) {
    axios = axiosInstance
  }
}
