'use strict'

let _ = require('lodash')

let moment = require('moment')
require('moment-range')

let log = require('./log')

let regexMatch = (regex, str) => {
  let match = str.match(regex)

  if (match === null) {
    return false
  } else {
    return true
  }
}

// This function trims a string fully, trimming whitespace and culling all newlines.
// Regex taken from: http://stackoverflow.com/a/10805292
let fullTrim = (str) => _.trim(str).replace(/\r?\n|\r/gm, '')

// Given the format of the dates and the starting and ending dates, this method calculates the
// time in milliseconds between the two dates.
let msRange = (format, startDate, endDate) => {
  return moment.range(moment(startDate, format), moment(endDate, format)).valueOf()
}

let int = (num) => parseInt(num, 10)

let array = (thing) => {
  if (!thing) {
    return []
  } else if (!_.isArray(thing)) {
    return [thing]
  } else {
    return thing
  }
}

let numericSort = (a, b) => a - b

// NOTE: .toFixed() returns a string.
let mean = (arr) => (_.sum(arr) / arr.length).toFixed(2) * 1

let isMultiple = (num, multiple) => num % multiple === 0

let serverDateToMoment = (str) => {
  return moment(str, 'DD MM YYYY HH:mm:ss ZZ')
}

let formatMomentLong = (theMoment) => {
  return theMoment.format('dddd, Do MMMM HH:mm:ss ZZ')
}

let handleError = (err) => {
  if (typeof err === 'string') {
    log.error(err)
  } else {
    throw new Error(err)
  }
}

let objectToArray = function (obj, keyName) {
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

module.exports = {
  regexMatch,
  fullTrim,
  msRange,
  int,
  array,
  numericSort,
  isMultiple,
  mean,

  serverDateToMoment,
  formatMomentLong,

  handleError,
  objectToArray
}
