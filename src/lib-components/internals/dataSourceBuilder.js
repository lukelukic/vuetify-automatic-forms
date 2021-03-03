import Builders from './dataSourceBuilders.js'
import Modifiers from './dataSourceModifiers'
var axios = undefined

async function buildDataSource(formElement) {
  var fnBuilder = new Builders.FnBuilder(axios)
  var apiBuilder = new Builders.ApiBuilder(axios)
  var arrayBuilder = new Builders.FromArrayBuilder(axios)

  fnBuilder.setNext(apiBuilder)
  arrayBuilder.setNext(fnBuilder)

  var dataSource = await arrayBuilder.build(formElement)

  return Modifiers.modify(formElement, dataSource)
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

export default {
  buildDataSource,
  shouldContainDataSource,
  setAxios: function(axiosInstance) {
    axios = axiosInstance
  },
  setVue: function(vueInstance) {
    Modifiers.setVue(vueInstance)
  }
}
