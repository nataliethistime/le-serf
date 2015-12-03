'use strict'

let _ = require('lodash')

let log = require('../../log')

let util = require('../util')
let buildingsUtil = require('../util/buildings')

class BuildingTypes {

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
      return buildingsUtil.getAllBuildings(this.lacuna)
    }).then((buildings) => {
      log.newline()

      let typesObject = {}
      _.each(buildings, (building) => {
        if (!typesObject[building.name]) {
          typesObject[building.name] = {
            num: 0,
            levels: []
          }
        }

        typesObject[building.name].num += 1
        typesObject[building.name].levels.push(util.int(building.level))
      })

      // Convert typesObject to an array of objects so we can sort by `num`
      let typesArray = []
      _.each(typesObject, (building, name) => {
        building.name = name
        typesArray.push(building)
      })

      let outputArray = _.sortBy(typesArray, (building) => building.num)
      _.each(outputArray, (b) => {
        let plural = b.num > 1
          ? 'buildings'
          : 'building'
        let mean = util.mean(b.levels)

        log.info(`You have ${b.num} ${b.name} ${plural} ` +
          `at an average level of ${mean}`)
      })

      log.newline()
      log.info(`You have ${outputArray.length} different types of buildings.`)
    })
  }
}

module.exports = BuildingTypes
