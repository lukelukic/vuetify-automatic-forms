export default {
  methods: {
    onEnter: function() {
      if (this.submitOnEnter) {
        this.performSubmit()
      }
    },
    component: function(formElement) {
      return formElement.component ? formElement.component : 'v-text-field'
    },
    hint: function(formElement) {
      if (!formElement.hint) {
        return undefined
      }

      if (this.shouldBeTranslated(formElement.hint)) {
        return this.translate(formElement.hint)
      }

      return formElement.hint
    },
    mDense: function(formElement) {
      if (Object.keys(formElement).includes('dense')) {
        return formElement.dense
      }
      return this.dense
    },
    label: function(formElement) {
      if (formElement.label) {
        if (this.shouldBeTranslated(formElement.label)) {
          return this.translate(formElement.label, true)
        }
        return formElement.label
      }
      return this.toSentenceCase(formElement.key)
    },
    type: function(formElement) {
      return formElement.type ? formElement.type : undefined
    },
    rules: function(formElement) {
      if (formElement.rules) {
        return formElement.rules
      }
      return ''
    },
    cols: function(formElement) {
      if (!Object.keys(formElement).includes('cols')) {
        return 12
      }
      if (typeof formElement.cols == 'object') {
        let currentScreen = this.$vuetify.breakpoint.name

        let exactColMatch = formElement.cols[currentScreen]

        if (exactColMatch) {
          return exactColMatch
        }

        let sizes = ['xs', 'sm', 'md', 'lg', 'xl']
        let currentScreenIndex = sizes.findIndex(x => x == currentScreen)

        for (let i = currentScreenIndex - 1; i >= 0; i--) {
          let lowerSizeDefinition = formElement.cols[sizes[i]]

          if (lowerSizeDefinition) {
            return lowerSizeDefinition
          }
        }

        return 12
      }
      return formElement.cols
    },
    offset: function(formElement) {
      return formElement.offset ? formElement.offset : 0
    },
    mColor: function(formElement) {
      return formElement.color ? formElement.color : this.color
    },
    mClearable: function(formElement) {
      return formElement.clearable
        ? formElement.clearable
        : this.clearableInputs
    },
    performSubmit() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          if (this.additionalValidation) {
            let errors = this.additionalValidation(this.formObject)

            if (Object.keys(errors).length) {
              this.$refs.observer.setErrors(errors)
              return
            }
          }
          let objectToSubmit = {}
          for (let prop in this.formObject) {
            if (
              (!this.hidden[prop] || this.find(prop).sendOnHidden) &&
              this.formObject[prop] !== undefined &&
              this.formObject[prop] !== null &&
              this.formObject[prop].toString().trim() !== ''
            ) {
              if (prop.includes('_upload')) {
                let originalPropName = prop.split('_upload')[0]
                objectToSubmit[originalPropName] = this.formObject[prop]
              } else {
                objectToSubmit[prop] = this.formObject[prop]
              }
            }
          }
          try {
            this.$emit('formSubmit', objectToSubmit)
          } catch (e) {
            throw new Error(
              'There was an error calling a provided function in FormBuilder',
              e
            )
          }
        }
      })
    },
    reset() {
      this.$refs.observer.reset()
      for (let prop in this.formObject) {
        if (this.incommingObject && this.incommingObject[prop]) {
          this.formObject[prop] = this.incommingObject[prop]
        } else {
          this.formObject[prop] = ''
        }
      }
      this.$emit('formReset')
    },
    find(key) {
      return this.formElements.filter(x => x.key == key)[0]
    }
  }
}
