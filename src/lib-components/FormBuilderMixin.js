import dataSourceBuilder from './internals/dataSourceBuilder'
export default {
  data() {
    return {
      changeFunctions: {
        dataSource: this.handleDataSourceChange,
        hide: this.handleHide,
        disable: this.handleDisable,
        clear: this.handleClear,
      },
    }
  },
  methods: {
    toSentenceCase(text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    prepareFormObject() {
      for (let el of this.formElements) {
        this.$set(this.formObject, el.key, this.incommingValue(el.key))
        if (dataSourceBuilder.shouldContainDataSource(el)) {
          this.$set(this.dataSources, el.key, this.dataSource(el))
        }
        this.$set(this.disabled, el.key, el.disabled)
        this.$set(this.hidden, el.key, el.hidden)
      }
    },
    incommingValue(key) {
      if (this.incommingObject) {
        return this.incommingObject[key] ? this.incommingObject[key] : ''
      }
      return ''
    },
    dataSource: function(formElement) {
      return dataSourceBuilder.buildDataSource(formElement)
    },
    handleChange(key, value) {
      let element = this.find(key)
      if (element && element.affects) {
        for (let toBeAffected of element.affects) {
          this.changeFunctions[toBeAffected.change.type](toBeAffected, value)
        }
      }
      if(this.affectsComputation(key)) {
        let affected = this.getAffectedComputations(key)
        for(let affectedItem of affected) {
          let filtered = affectedItem.computation.filter(x => x.when[key])
          for(let x of filtered) {
              let whenMatched = true
            for(let whenKey in x.when) {
                if(this.formObject[whenKey] != x.when[whenKey]) {
                  whenMatched = false
                  break
                }
            } 

            if(whenMatched) {
              this.formObject[affectedItem.key] = x.then.value
            }
               
            this.disabled[affectedItem.key] = whenMatched ? x.then.disabled : affectedItem.disabled  
          }
        }
      }
    },
    affectsComputation(key) {
      let affected = this.getAffectedComputations(key)
      return affected.length
    },
    getAffectedComputations(key) {
      let affectedComputations = this.formElements
                                                 .filter(x => x.computation != undefined &&
                                                         x.computation.some(x => x.when[key] != undefined))
      return affectedComputations                                                         
    },
    handleHide(toBeAffected, value) {
      this.$set(this.hidden, toBeAffected.key, value != '')
    },
    handleClear(toBeAffected) {
      this.$set(this.formObject, toBeAffected.key, '')
    },
    handleDisable(toBeAffected, value) {
      this.$set(
        this.disabled,
        toBeAffected.key,
        toBeAffected.change.when == value
      )
    },
    handleDataSourceChange: function(toBeAffected, value) {
      let isChangeSpecificToSelectedElement =
        toBeAffected.change.bindings && toBeAffected.change.bindings[value]
      if (isChangeSpecificToSelectedElement) {
        let binding = toBeAffected.change.bindings[value]
        if (Array.isArray(binding)) {
          binding = dataSourceBuilder.addFirstOption(binding)
          this.$set(this.dataSources, toBeAffected.key, binding)
          let selected = binding.find((x) => x.selected)
          if (selected) {
            this.formObject[toBeAffected.key] = selected.value
          }
          return
        }
        if (binding.api) {
          this.$set(
            this.dataSources,
            toBeAffected.key,
            dataSourceBuilder.buildDataSource(binding)
          )
          return
        }

        throw new Error(
          'DataSource binding must contain either new DataSource or an api endpoint.'
        )
      }

      if (toBeAffected.change.api) {
        let dataSource = {
          api: {
            endpoint: toBeAffected.change.api.endpoint,
          },
        }
        if (toBeAffected.change.api.associateValue) {
          dataSource.api.endpoint += value
        }

        this.$set(
          this.dataSources,
          toBeAffected.key,
          dataSourceBuilder.buildDataSource(dataSource)
        )
      }
    },
  },
}
