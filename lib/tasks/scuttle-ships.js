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

  handleColony (colony) {
    log.newline()
    log.info(`Looking at ${colony.name}`)

    return new Promise((resolve, reject) => {
      lacuna.body.findBuilding(colony.id, 'Space Port').then((sp) => {
        if (!sp) {
          reject(`No Space Port found on ${colony.name}`)
          return
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
          let shipPlural = util.handlePlurality(num, 'ship')

          if (num > 0) {
            log.info(`Scuttling ${num} ${shipPlural}`)
          } else {
            reject(`No ships to scuttle on ${colony.name}`)
            return
          }

          return lacuna.buildings.spaceport.massScuttleShip([sp.id, hitlist]).then(resolve)
        })
      }).catch(reject)
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
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony).catch((err) => {
            util.handlePromiseError(err)
          })
        })
      }).then(() => {
        resolve()
      }).catch(reject)
    })
  }
}

module.exports = ScuttleShips
