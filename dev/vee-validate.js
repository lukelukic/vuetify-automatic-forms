import Vue from 'vue'
import { localize } from 'vee-validate'
import sr from 'vee-validate/dist/locale/sr_Latin.json'
import en from 'vee-validate/dist/locale/en.json'
import ja from 'vee-validate/dist/locale/ja.json'
import * as rules from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import { setInteractionMode } from 'vee-validate'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

// Install English and Arabic localizations.
localize({
  en,
  sr,
  ja
})

setInteractionMode('eager')

localize('en')

let LOCALE = 'en'

// A simple get/set interface to manage our locale in components.
// This is not reactive, so don't create any computed properties/watchers off it.
Object.defineProperty(Vue.prototype, 'locale', {
  get() {
    return LOCALE
  },
  set(val) {
    LOCALE = val
    localize(val)
  }
})
