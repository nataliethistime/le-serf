'use strict'

let _ = require('lodash')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class BuildingLevels {

  constructor (options) {
    this.options = options
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  run () {
    return lacuna.authenticate().then(() => {
      return lacuna.empire.getAllBuildings()
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
