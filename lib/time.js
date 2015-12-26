'use strict'

let moment = require('moment')
require('moment-range')
require('moment-duration-format')

let constants = require('./constants')

let msFromNow = (date) => {
  if (typeof date === 'string') {
    date = moment(date, constants.serverDateFormat)
  }

  return moment.range(
    moment(),
    date
  ).valueOf()
}

let formatMs = (ms) => moment.duration(ms, 'milliseconds').format()

module.exports = {
  formatMs,
  msFromNow
}
