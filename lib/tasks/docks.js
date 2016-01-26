'use strict'

let Promise = require('bluebird')
let _ = require('lodash')
let Table = require('cli-table')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class Docks {

  constructor (options) {
    this.options = options

    this.totals = []
  }

  handleColony (colony, buildings) {
    return lacuna.body.findBuilding(buildings, 'Space Port').then((sp) => {
      if (!sp) {
        return new Promise((resolve, reject) => {
          reject(`No Space Port found on ${colony.name}`)
        })
      }

      return lacuna.buildings.spaceport.view([sp.id]).then((result) => {
        let docks = util.int(result.max_ships)
        let ships = docks - util.int(result.docks_available)

        this.totals.push({
          name: colony.name,
          docks,
          ships
        })
      })
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      lacuna.empire.colonies().then((colonies) => {
        return lacuna.empire.eachPlanet(colonies, _.bind(this.handleColony, this))
      }).then(() => {
        let table = new Table({
          head: [
            'Planet',
            'Ships',
            'Docks'
          ]
        })

        _.each(this.totals, (total) => {
          table.push([
            total.name,
            util.commify(total.ships),
            util.commify(total.docks)
          ])
        })

        table.push([
          'GRAND TOTAL',
          util.commify(_.sum(_.pluck(this.totals, 'ships'))),
          util.commify(_.sum(_.pluck(this.totals, 'docks')))
        ])

        log.newline()
        log.info(table.toString())
        resolve()
      }).catch(reject)
    })
  }
}

module.exports = Docks
