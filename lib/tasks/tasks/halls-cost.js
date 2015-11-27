'use strict'

let _ = require('lodash')

let util = require('../util')

class HallsCost {
  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options
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
