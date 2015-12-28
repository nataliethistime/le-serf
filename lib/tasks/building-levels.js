'use strict'

let _ = require('lodash')

let log = require('../log')
let util = require('../util')

class BuildingLevels {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  run () {
    return this.lacuna.authenticate().then(() => {
      return this.lacuna.empire.getAllBuildings(this.lacuna)
    }).then((buildings) => {
      log.newline()

      _.each(_.range(0, 32), (level) => {
        let num = _.filter(buildings, (bld) => (bld.level * 1) === level).length
        log.info(`Level ${level}: ${num} buildings`)
      })

      log.newline()

      let totalBuildings = buildings.length
      let mean = util.mean(_.pluck(buildings, 'level'))

      log.info(`Average building level is ${mean}`)
      log.info(`There are ${totalBuildings} buildings`)
    })
  }
}

module.exports = BuildingLevels
