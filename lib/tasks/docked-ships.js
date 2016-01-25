'use strict'

let Promise = require('bluebird')
let _ = require('lodash')
let Table = require('cli-table')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class DockedShips {

  constructor (options) {
    this.options = options

    this.totalShips = 0
  }

  handleColony (colony, buildings) {
    return lacuna.body.findBuilding(buildings, 'Space Port').then((sp) => {
      if (!sp) {
        return new Promise((resolve, reject) => {
          reject(`No Space Port found on ${colony.name}`)
        })
      }

      return lacuna.buildings.spaceport.viewAllShips([
        sp.id,
        {
          no_paging: 1
        },
        {
          task: 'Docked'
        }
      ])
    }).then((result) => {
      let table = new Table({
        head: [
          'Quantity',
          'Type',
          'Speed',
          'Combat',
          'Stealth',
          'Hold Size',
          'Occupants',
          'Berth Level'
        ]
      })
      let output = {}

      _.each(result.ships, (ship) => {
        let props = 'type_human speed combat stealth hold_size max_occupants berth_level'.split(' ')
        let key = _.values(_.pick(ship, props)).join(',')

        output[key] = (output[key] || 0) + 1
      })

      this.totalShips += _.sum(_.values(output))

      let keys = _.sortBy(_.keys(output))
      _.each(keys, (key) => {
        let str = key
        let num = output[key]

        table.push([].concat(num, str.split(',')))
      })

      if (keys.length > 0) {
        log.info(table.toString())
      } else {
        log.info(`No docked ships on ${colony.name}`)
      }
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
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
        let plural = util.handlePlurality(this.totalShips, 'ship')
        resolve(`${this.totalShips} total ${plural}`)
      }).catch(reject)
    })
  }
}

module.exports = DockedShips
