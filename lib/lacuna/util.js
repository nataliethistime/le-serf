'use strict'

var _ = require('lodash')

module.exports.sortArrayOfObjects = function (arr, propName) {
  return arr.sort(function compare (a, b) {
    if (a[propName] < b[propName]) {
      return -1
    } else if (a[propName] > b[propName]) {
      return 1
    } else {
      return 0
    }
  })
}

module.exports.objectToArray = function (obj, keyName) {
  if (_.isArray(obj)) {
    return obj
  } else {
    var arr = []

    _.each(obj, function (value, key) {
      value[keyName] = key
      arr.push(value)
    })

    return arr
  }
}

module.exports.regexMatch = (regex, str) => {
  let match = str.match(regex)

  if (match === null) {
    return false
  } else {
    return true
  }
}
