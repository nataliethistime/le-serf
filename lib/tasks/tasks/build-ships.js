'use strict'

let Promise = require('bluebird')

let log = require('../../log')

let empireUtils = require('../util/empire')

class BuildShips {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options
  }

  buildShips (colony) {
    log.info(`Building ships on ${colony.name}`)

    // TODO: revisit this!
  }

  run () {
    return new Promise((resolve, reject) => {
      this.lacuna.authenticate().then(() => {
        return empireUtils.handlePlanetArg(this.lacuna, this.options.planet)
      }).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.buildShips(colony)
        })
      }).catch(reject)
    })
  }
}

module.exports = BuildShips
