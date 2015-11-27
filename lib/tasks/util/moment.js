'use strict'

let moment = require('moment')

let serverDateToMoment = (str) => {
  return moment(str, 'DD MM YYYY HH:mm:ss ZZ')
}

let formatMomentLong = (theMoment) => {
  return theMoment.format('dddd, Do MMMM HH:mm:ss ZZ')
}

module.exports = {
  serverDateToMoment,
  formatMomentLong
}
