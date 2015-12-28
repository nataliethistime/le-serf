'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let argHandlers = require('../cli/arg-handlers')

let log = require('../log')
let util = require('../util')

class BuildShips {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options
  }

  buildShips (colony) {
    log.info(`Building ships on ${colony.name}`)

    // TODO: revisit this!
  }

  validateOptions () {
    this.options.quantity = util.int(this.options.quantity)
    this.options.level = util.int(this.options.level)

    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
      } else if (!this.options.type || !this.options.quantity) {
        reject(`please specify a ship type and quantity`)
      } else if (!_.include(_.range(0, 31), this.options.level)) {
        reject('level must be between 1 and 30')
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      this.lacuna.authenticate().then(() => {
        return argHandlers.planet(this.lacuna, this.options.planet)
      }).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.buildShips(colony)
        })
      }).catch(reject)
    })
  }
}

module.exports = BuildShips
