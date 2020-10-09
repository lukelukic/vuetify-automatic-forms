export default {
  methods: {
    shouldBeTranslated(keyword) {
      return keyword.indexOf('$') == 0
    },
    translate(translatable, upperFirst) {
      if (!this.shouldBeTranslated(translatable)) {
        return upperFirst ? this.capitalize(translatable) : translatable
      }
      const keyToTranslate = translatable.substring(1)
      if (!this.$t) {
        console.warn(
          `Cant translate ${keyToTranslate}, no i18n translator found.`
        )
        return keyToTranslate
      }
      return upperFirst
        ? this.capitalize(this.$t(keyToTranslate))
        : this.$t(keyToTranslate)
    },
    capitalize(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    canTranslate(keyword) {
      return this.$te(keyword)
    }
  }
}
