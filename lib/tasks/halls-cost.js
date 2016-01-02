'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let util = require('../util')

class HallsCost {

  constructor (options) {
    this.options = options
  }

  validateOptions () {
    this.options.start = util.int(this.options.start)
    this.options.end = util.int(this.options.end)

    return new Promise((resolve, reject) => {
      if (!_.include(_.range(0, 31), this.options.start)) {
        reject('start must be between 1 and 30')
      } else if (!_.include(_.range(0, 31), this.options.end)) {
        reject('end must be between 1 and 30')
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      let num = 0
      let start = util.int(this.options.start)
      let end = util.int(this.options.end)

      // NOTE: we add one to `start` because we shouldn't count the level
      // we're on. We add one to `end` because Lodash doesn't include the
      // last one in the range.
      //
      // For example:
      //   _.range(1, 5) => [1, 2, 3, 4]
      _.each(_.range(start + 1, end + 1), (n) => num += n)

      resolve(`Upgrading from ${start} to ${end} costs ${num} Halls of Vrbansk`)
    })
  }
}

module.exports = HallsCost
