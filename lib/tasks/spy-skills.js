'use strict'

let _ = require('lodash')
let Table = require('cli-table')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class SpyStatus {

  constructor (options) {
    this.options = options
  }

  handleColony (colony, buildings) {
    return lacuna.body.findBuilding(buildings, 'Intelligence Ministry').then((intelMin) => {
      if (!intelMin) {
        return new Promise((resolve, reject) => {
          reject(`No Intelligence Ministry found on ${colony.name}`)
        })
      }

      return lacuna.buildings.intelligence.viewAllSpies([intelMin.id])
    }).then((result) => {
      let table = new Table({
        head: [
          'Level',
          'Name',
          'Intel',
          'Mayhem',
          'Politics',
          'Theft'
        ]
      })
      let tempArray = []

      _.each(result.spies, (spy) => {
        let props = 'level name intel mayhem politics theft'.split(' ')
        tempArray.push(_.values(_.pick(spy, props)))
      })

      _.chain(tempArray)
        .sortBy((item) => util.int(item[0]))
        .reverse()
        .each((item) => table.push(item))
        .value()

      if (table.length > 0) {
        log.info(table.toString())
        log.newline()

        let spyPlural = util.handlePlurality(result.spy_count, 'spy')
        log.info(`${result.spy_count} total ${spyPlural}`)
      } else {
        log.info(`No spies on ${colony.name}`)
      }
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject(`please specify a planet`)
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      lacuna.empire.findPlanets(this.options.planet).then((colonies) => {
        return lacuna.empire.eachPlanet(colonies, _.bind(this.handleColony, this))
      }).then(() => {
        resolve()
      }).catch(reject)
    })
  }
}

module.exports = SpyStatus
