import ja from './ja.json'
import en from './en.json'
import it from './it.json'

let languages = {
  ja,
  en,
  it
}

export default {
  all: function() {
    return languages
  }
}
