'use strict'

let _ = require('lodash')
let Table = require('cli-table')

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
      let table = new Table({
        head: [
          'Level',
          'Number of Buildings'
        ]
      })

      _.each(_.range(0, 32), (level) => {
        let num = _.filter(buildings, (b) => {
          return util.int(b.level) === level
        }).length

        table.push([level, num])
      })

      log.newline()
      log.info(table.toString())
      log.newline()

      let total = buildings.length
      let mean = util.mean(_.pluck(buildings, 'level'))

      log.info(`Average building level is ${mean}`)
      log.info(`There are ${total} buildings`)
    })
  }
}

module.exports = BuildingLevels
