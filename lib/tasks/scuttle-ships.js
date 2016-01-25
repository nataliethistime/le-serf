'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let lacuna = require('../lacuna')
let log = require('../log')
let types = require('../types')
let util = require('../util')

class ScuttleShips {

  constructor (options) {
    this.options = options
  }

  getFilter () {
    let filter = {
      task: 'Docked'
    }

    if (this.options.type !== 'all') {
      filter.type = this.options.serverType
    }

    return filter
  }

  handleColony (colony, buildings) {
    return lacuna.body.findBuilding(buildings, 'Space Port').then((sp) => {
      if (!sp) {
        return new Promise((resole, reject) => {
          reject(`No Space Port found on ${colony.name}`)
        })
      }

      return lacuna.buildings.spaceport.viewAllShips([
        sp.id,
        {
          no_paging: 1
        },
        this.getFilter()
      ]).then((result) => {
        let hitlist = _.pluck(result.ships, 'id')
        let num = hitlist.length
        let noun = this.options.type === 'all' ? 'ship' : this.options.type
        let shipPlural = util.handlePlurality(num, noun)

        if (num > 0) {
          log.info(`Scuttling ${num} ${shipPlural}`)
        } else {
          return new Promise((resolve, reject) => {
            reject(`No ${shipPlural} to scuttle on ${colony.name}`)
          })
        }

        return lacuna.buildings.spaceport.massScuttleShip([sp.id, hitlist])
      })
    })
  }

  validateOptions () {
    let serverType = ''

    if (this.options.type !== 'all') {
      serverType = types.translateShipType(this.options.type)
    }

    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
      } else if (!this.options.type && !serverType) {
        reject('please specify ships to scuttle')
      } else {
        this.options.serverType = serverType

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

module.exports = ScuttleShips
