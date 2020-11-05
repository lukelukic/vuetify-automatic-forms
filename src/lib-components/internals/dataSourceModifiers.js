var vueInstance = null

function addFirstOption(formElement, dataSource) {
  if (!isMultiple(formElement) && !isRequired(formElement)) {
    dataSource.unshift({
      text: 'Choose...',
      value: ''
    })
  }
  return dataSource
}
function translateDataSource(formElement, dataSource) {
  dataSource.forEach(item => {
    item.text = translate(item.text, true)
  })

  return dataSource
}

function isMultiple(formElement) {
  return formElement.props?.multiple
}

function isRequired(formElement) {
  return formElement.rules?.includes('required')
}

function shouldBeTranslated(keyword) {
  return keyword && keyword.indexOf('$') == 0
}
function translate(translatable, upperFirst) {
  if (!shouldBeTranslated(translatable)) {
    return upperFirst ? capitalize(translatable) : translatable
  }
  const keyToTranslate = translatable.substring(1)
  if (!vueInstance.$t) {
    console.warn(`Cant translate ${keyToTranslate}, no i18n translator found.`)
    return keyToTranslate
  }
  return upperFirst
    ? capitalize(vueInstance.$t(keyToTranslate))
    : vueInstance.$t(keyToTranslate)
}
function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

let modifiers = [addFirstOption, translateDataSource]

export default {
  setVue(vue) {
    vueInstance = vue
  },
  modify: function(formElement, dataSource) {
    for (let modifier of modifiers) {
      dataSource = modifier(formElement, dataSource)
    }
    return dataSource
  }
}
