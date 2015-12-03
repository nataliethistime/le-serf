'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let log = require('../../log')

let empireUtils = require('../util/empire')

const RECIPES = [
  'goethite halite gypsum trona'.split(' '),
  'gold anthracite uraninite bauxite'.split(' '),
  'kerogen methane sulfur zircon'.split(' '),
  'monazite fluorite beryl magnetite'.split(' '),
  'rutile chromite chalcopyrite galena'.split(' ')
]

class MakeHalls {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    this.colony = {}
    this.archaeology = {}
    this.inventory = {}
  }

  getArchaeology () {
    return new Promise((resolve, reject) => {
      return empireUtils.findPlanet(this.lacuna, this.options.planet)
        .then((result) => {
          this.colony = result
          return this.lacuna.body
            .findBuilding(this.colony.id, 'Archaeology Ministry')
        }).then((result) => {
          if (result) {
            this.archaeology = result
            resolve()
          } else {
            reject(`No Archaeology Ministry on ${this.colony.name}`)
          }
        }).catch(reject)
    })
  }

  calculateQuantity (recipe) {
    return _.min(_.map(recipe, (glyphName) => {
      return this.inventory[glyphName] || 0
    }))
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

  makeRecipe (recipe) {
    return new Promise((resolve, reject) => {
      let quantity = this.calculateQuantity(recipe)
      let prettyList = _.map(recipe, _.capitalize).join(', ')

      if (!quantity > 0) {
        resolve(0)
      } else {
        log.info(`Making ${quantity} Halls with ${prettyList}`)
        let params = [this.archaeology.id, recipe, quantity]
        this.lacuna.buildings.archaeology.assembleGlyphs(params).then(() => {
          resolve(quantity)
        }).catch(reject)
      }
    })
  }

  makeHalls () {
    return new Promise((resolve, reject) => {
      log.info(`Making Halls on ${this.colony.name}`)

      Promise.mapSeries(RECIPES, (recipe) => {
        return this.makeRecipe(recipe)
      }).then((results) => {
        resolve(_.sum(results))
      }).catch(reject)
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      this.lacuna.authenticate().then(() => {
        return this.getArchaeology()
      }).then(() => {
        return this.lacuna.buildings.archaeology
          .getInventory(this.archaeology.id)
      }).then((inventory) => {
        this.inventory = inventory
        return this.makeHalls()
      }).then((numMade) => {
        if (numMade > 0) {
          let plural = numMade > 1 ? 's' : ''
          resolve(`Made ${numMade} Hall${plural} on ${this.colony.name}`)
        } else {
          resolve(`Didn't make any halls on ${this.colony.name}`)
        }
      }).catch(reject)
    })
  }
}

module.exports = MakeHalls
