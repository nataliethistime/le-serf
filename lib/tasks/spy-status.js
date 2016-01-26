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
          'Quantity',
          'Assignment',
          'On',
          'From'
        ]
      })
      let output = {}

      _.each(result.spies, (spy) => {
        let key = [
          spy.assignment,
          spy.assigned_to.name,
          spy.based_from.name
        ].join(',')

        output[key] = (output[key] || 0) + 1
      })

      let keys = _.sortBy(_.keys(output))
      _.each(keys, (key) => {
        let str = key
        let num = output[key]

        table.push([num].concat(str.split(',')))
      })

      if (keys.length > 0) {
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
