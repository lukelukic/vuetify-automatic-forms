import dataSourceBuilder from './internals/dataSourceBuilder'
import fileInputHandler from './internals/fileInputHandler'
export default {
  data() {
    return {
      changeFunctions: {
        dataSource: this.handleDataSourceChange,
        hide: this.handleHide,
        disable: this.handleDisable,
        enable: this.handleEnable,
        clear: this.handleClear,
        order: this.handleOrder,
        cols: this.handleCols,
        value: this.handleValue
      }
    }
  },
  beforeMount() {
    dataSourceBuilder.setAxios(this.$formBuilderAxios)
    dataSourceBuilder.setVue(this)
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

      await this.populateValuesBasedOnIncommingObject()

      this.formIsValid = await this.$refs.observer.validate()
    },
    populateValuesBasedOnIncommingObject() {
      if (!this.incommingObject) {
        return
      }
      for (let el of this.formElements) {
        if (Object.keys(this.incommingObject).includes(el.key)) {
          let incommingValue = this.incommingValue(el.key)
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
      this.$refs.observer.validate().then(() => {
        this.$refs.observer.validate().then(x => {
          this.formIsValid = x
        })

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
        this.eventBus.$emit('formObjectChanged', this.formObject)
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
      if (toBeAffected.change.affectees) {
        var that = this
        toBeAffected.change.affectees.forEach(function(key) {
          that.$set(
            that.disabled,
            key,
            that.shouldChange(toBeAffected.change, value)
          )
        })
      } else {
        this.$set(
          this.disabled,
          toBeAffected.key,
          this.shouldChange(toBeAffected.change, value)
        )
      }
    },
    handleEnable(toBeAffected, value) {
      if (toBeAffected.change.affectees) {
        var that = this
        toBeAffected.change.affectees.forEach(function(key) {
          that.$set(
            that.disabled,
            key,
            !that.shouldChange(toBeAffected.change, value)
          )
        })
      } else {
        this.$set(
          this.disabled,
          toBeAffected.key,
          !this.shouldChange(toBeAffected.change, value)
        )
      }
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
      if (toBeAffected.change.affectees) {
        for (let key of toBeAffected.change.affectees) {
          this.changeValue(toBeAffected, value, key)
        }
      } else {
        this.changeValue(toBeAffected, value, toBeAffected.key)
      }
    },
    changeValue(toBeAffected, value, key) {
      const affectee = this.formElements.filter(x => x.key == key)[0]

      if (!affectee) {
        throw new Error(
          `There was an error affecting the value. Used key ${key} did not resolve to any input element.`
        )
      }

      const binding = toBeAffected.change.bindings[value]

      if (
        toBeAffected.change.bindings &&
        Object.keys(toBeAffected.change.bindings).includes(
          typeof value == 'string' ? value : String(value)
        )
      ) {
        this.$set(this.formObject, key, binding)
      } else {
        if (
          toBeAffected.change.bindings &&
          Object.keys(toBeAffected.change.bindings).includes('$any')
        ) {
          if (value != undefined) {
            this.$set(
              this.formObject,
              key,
              toBeAffected.change.bindings['$any']
            )
          } else {
            this.$set(this.formObject, key, undefined)
          }
        }
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
          if (value === null || value === undefined) {
            //clearing queryString since no item is selected/checked
            dataSource.dataSource.endpoint = dataSource.dataSource.endpoint.split(
              '&'
            )[dataSource.dataSource.endpoint.split('&').length - 2]
          } else {
            if (Array.isArray(value)) {
              var checkedItems = []
              for (let item of value) {
                if (item !== null && item !== undefined) {
                  checkedItems.push(item)
                }
              }

              if (checkedItems.length) {
                dataSource.dataSource.endpoint += checkedItems
              } else {
                dataSource.dataSource.endpoint = dataSource.dataSource.endpoint.split(
                  '&'
                )[dataSource.dataSource.endpoint.split('&').length - 2]
              }
            } else {
              if (value != null && value != undefined) {
                dataSource.dataSource.endpoint += value
              }
            }
          }
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
