'use strict'

let _ = require('lodash')

let log = require('./log')
let time = require('./time')

class Timelist {
  constructor (initialList) {
    this.list = _.isArray(initialList) ? initialList : []
  }

  add (time) {
    this.list.push(time)
  }

  clear () {
    // See: http://stackoverflow.com/a/1234337
    this.list.length = 0
  }

  sort () {
    return _.sortBy(this.list, time.msFromNow)
  }

  getSoonest () {
    let date = _.first(this.sort())
    let soonest = time.msFromNow(date)

    // No need to sleep if the timer finished.
    if (soonest < 0) {
      soonest = 0
    }

    // Add some extra time to make sure.
    return soonest + 5000
  }

  sleepUntilSoonest (callback) {
    let sleepTime = this.getSoonest()
    let formatted = time.formatMs(sleepTime)

    log.info(`Sleeping for ${formatted}`)

    setTimeout(() => {
      callback()
    }, sleepTime)
  }
}

module.exports = Timelist
