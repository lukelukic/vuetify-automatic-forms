import dataSourceBuilder from './internals/dataSourceBuilder'
import fileInputHandler from './internals/fileInputHandler'
export default {
  data() {
    return {
      changeFunctions: {
        dataSource: this.handleDataSourceChange,
        hide: this.handleHide,
        disable: this.handleDisable,
        clear: this.handleClear,
        order: this.handleOrder,
        cols: this.handleCols,
        value: this.handleValue
      }
    }
  },
  beforeMount() {
    dataSourceBuilder.setAxios(this.$formBuilderAxios)
  },
  methods: {
    toSentenceCase(text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    async prepareFormObject() {
      this.formObject = {}
      for (let el of this.formElements) {
        if (dataSourceBuilder.shouldContainDataSource(el)) {
          this.$set(this.dataSources, el.key, await this.dataSource(el))
        }
        this.$set(this.disabled, el.key, el.disabled)
        this.$set(this.hidden, el.key, el.hidden)
      }

      this.populateValuesBasedOnIncommingObject()
    },
    populateValuesBasedOnIncommingObject() {
      if (!this.incommingObject) {
        return
      }
      for (let el of this.formElements) {
        let incommingValue = this.incommingValue(el.key)
        if (incommingValue !== '' && incommingValue !== undefined) {
          if (el.props && el.props.multiple && !Array.isArray(incommingValue)) {
            this.$set(this.formObject, el.key, [incommingValue])
          } else {
            this.$set(this.formObject, el.key, incommingValue)
          }
          this.handleChange(el.key, incommingValue)
        }
      }
    },
    incommingValue(key) {
      return this.incommingObject[key]
    },
    dataSource: async function(formElement) {
      return await dataSourceBuilder.buildDataSource(formElement)
    },
    handleChange(key, value, isDate) {
      if (isDate) {
        if (!value) {
          this.$set(this.formObject, key, '')
        }
        return
      }

      let changeFunctions = this.changeFunctionChain()

      changeFunctions.forEach(x => {
        x(key, value)
      })
    },
    changeFunctionChain() {
      let that = this

      function affectsChange(key, value) {
        let element = that.find(key)

        if (element && element.affects) {
          for (let toBeAffected of element.affects) {
            that.changeFunctions[toBeAffected.change.type](toBeAffected, value)
          }
        }
      }

      function computationChange(key) {
        if (that.affectsComputation(key)) {
          let affected = that.getAffectedComputations(key)
          for (let affectedItem of affected) {
            let filtered = affectedItem.computation.filter(x => x.when[key])
            for (let x of filtered) {
              let whenMatched = true
              for (let whenKey in x.when) {
                if (that.formObject[whenKey] != x.when[whenKey]) {
                  whenMatched = false
                  break
                }
              }

              if (whenMatched) {
                that.formObject[affectedItem.key] = x.then.value
              }

              that.disabled[affectedItem.key] = whenMatched
                ? x.then.disabled
                : affectedItem.disabled
            }
          }
        }
      }

      function fileChoosenChange(key, value) {
        let element = that.find(key)
        if (element.component == 'v-file-input') {
          fileInputHandler.handle(
            value,
            key,
            that,
            element.conversionStrategy ? element.conversionStrategy : 'base64'
          )
        }
      }

      return [affectsChange, computationChange, fileChoosenChange]
    },

    affectsComputation(key) {
      let affected = this.getAffectedComputations(key)
      return affected.length
    },
    getAffectedComputations(key) {
      let affectedComputations = this.formElements.filter(
        x =>
          x.computation != undefined &&
          x.computation.some(x => x.when[key] != undefined)
      )
      return affectedComputations
    },
    handleHide(toBeAffected, value) {
      this.$set(
        this.hidden,
        toBeAffected.key,
        this.shouldChange(toBeAffected.change, value)
      )
    },
    shouldChange(change, value) {
      if (Object.keys(change).includes('when')) {
        if (Array.isArray(change.when)) {
          return change.when.includes(value)
        }
        if (typeof change.when == 'function') {
          return change.when(value)
        }
        return change.when == value
      }

      if (Object.keys(change).includes('whenNot')) {
        if (Array.isArray(change.whenNot)) {
          return !change.whenNot.includes(value)
        }
        if (typeof change.whenNot == 'function') {
          return change.whenNot(value)
        }
        return change.whenNot != value
      }

      return false
    },
    handleClear(toBeAffected) {
      this.$set(this.formObject, toBeAffected.key, '')
    },
    handleOrder(toBeAffected, value) {
      this.reactivePropertyChange(toBeAffected, value, 'order')
    },
    handleDisable(toBeAffected, value) {
      this.$set(
        this.disabled,
        toBeAffected.key,
        this.shouldChange(toBeAffected.change, value)
      )
    },
    handleCols(toBeAffected, value) {
      this.reactivePropertyChange(toBeAffected, value, 'cols')
    },
    reactivePropertyChange(toBeAffected, value, property) {
      let elementToChangeOrderTo = this.localFormElements.find(
        x => x.key == toBeAffected.key
      )
      let index = this.localFormElements.findIndex(
        x => x.key == toBeAffected.key
      )

      let affectedValue = toBeAffected.change.bindings[value]
      if (affectedValue) {
        elementToChangeOrderTo[property] = affectedValue
      } else {
        elementToChangeOrderTo[property] = this.initialOrderings[
          toBeAffected.key
        ]
      }
      this.$set(this.localFormElements, index, elementToChangeOrderTo)
    },
    handleValue(toBeAffected, value) {
      const affectee = this.formElements.filter(
        x => x.key == toBeAffected.key
      )[0]

      if (!affectee) {
        throw new Error(
          `There was an error affecting the value. Used key ${toBeAffected.key} did not resolve to any input element.`
        )
      }

      const binding = toBeAffected.change.bindings[value]

      if (binding) {
        this.$set(this.formObject, toBeAffected.key, binding)
      }
    },
    handleDataSourceChange: async function(toBeAffected, value) {
      var affectee = this.formElements.filter(x => x.key == toBeAffected.key)[0]

      if (!affectee) {
        throw new Error(
          `There was an error affecting the DataSource. Used key ${toBeAffected.key} did not resolve to any input element.`
        )
      }

      let specificBindingMatched =
        toBeAffected.change.bindings && toBeAffected.change.bindings[value]
      if (specificBindingMatched) {
        let binding = toBeAffected.change.bindings[value]
        if (Array.isArray(binding)) {
          binding = affectee.props?.multiple
            ? binding
            : dataSourceBuilder.addFirstOption(binding)
          this.$set(this.dataSources, toBeAffected.key, binding)
          let selected = binding.find(x => x.selected)
          if (selected) {
            this.formObject[toBeAffected.key] = selected.value
          }
          return
        }

        if (affectee.props && affectee.props.multiple) {
          binding.props = {
            multiple: true
          }
        }

        if (binding.api) {
          this.$set(
            this.dataSources,
            toBeAffected.key,
            await dataSourceBuilder.buildDataSource(binding)
          )
          return
        }

        throw new Error(
          'DataSource binding must contain either new DataSource or an api endpoint.'
        )
      }

      if (toBeAffected.change.api) {
        let dataSource = {
          dataSource: {
            endpoint: toBeAffected.change.api.endpoint
          }
        }

        if (affectee.props && affectee.props.multiple) {
          dataSource.props = {
            multiple: true
          }
        }

        if (toBeAffected.change.api.associateValue) {
          dataSource.dataSource.endpoint += value
        }

        this.$set(
          this.dataSources,
          toBeAffected.key,
          await dataSourceBuilder.buildDataSource(dataSource)
        )
      }
    }
  }
}
