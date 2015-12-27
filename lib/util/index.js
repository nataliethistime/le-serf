'use strict'

let _ = require('lodash')

let moment = require('moment')
require('moment-range')

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
let numericSort = (a, b) => a - b

// NOTE: .toFixed() returns a string.
let mean = (arr) => (_.sum(arr) / arr.length).toFixed(2) * 1

let isMultiple = (num, multiple) => num % multiple === 0

module.exports = {
  regexMatch,
  fullTrim,
  msRange,
  int,
  numericSort,
  isMultiple,
  mean,

  serverDateFormat: 'DD MM YYYY HH:mm:ss ZZ'
}
