'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let argHandlers = require('../cli/arg-handlers')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class BuildShips {

  constructor (lacuna, options) {
    this.options = options
  }

  handleColony (colony) {
    log.info(`Looking at ${colony.name}`)

    return lacuna.body.buildings(colony.id).then((buildings) => {
      //
    })
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
      argHandlers.planet(lacuna, this.options.planet).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony)
        })
      }).catch(reject)
    })
  }
}

module.exports = BuildShips
