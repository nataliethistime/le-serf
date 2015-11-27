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

module.exports.regexMatch = regexMatch
module.exports.fullTrim = fullTrim
module.exports.msRange = msRange
module.exports.serverDateFormat = 'DD MM YYYY HH:mm:ss ZZ'
