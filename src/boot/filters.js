import Vue from 'vue'

Vue.filter('truncate', function (text, length, suffix) {
  if (text.length > length) {
    return text.substring(0, length) + suffix
  } else {
    return text
  }
})

Vue.filter('upper', function (text) {
  text = text.toString()
  return text.charAt(0).toUpperCase() + text.slice(1)
})
