export default {
  methods: {
    shouldBeTranslated(keyword) {
      return keyword.indexOf('$') == 0
    },
    translate(translatable) {
      if (!this.shouldBeTranslated(translatable)) {
        return translatable
      }
      const keyToTranslate = translatable.substring(1)
      if (!this.$t) {
        console.warn(
          `Cant translate ${keyToTranslate}, no i18n translator found.`
        )
        return keyToTranslate
      }
      return this.$t(keyToTranslate)
    }
  }
}
