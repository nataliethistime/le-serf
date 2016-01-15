'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

const RECIPES = [
  'goethite halite gypsum trona'.split(' '),
  'gold anthracite uraninite bauxite'.split(' '),
  'kerogen methane sulfur zircon'.split(' '),
  'monazite fluorite beryl magnetite'.split(' '),
  'rutile chromite chalcopyrite galena'.split(' ')
]

class MakeHalls {

  constructor (options) {
    this.options = options

    this.numMade = 0
  }

  calculateQuantity (inventory, recipe) {
    return _.min(_.map(recipe, (glyph) => inventory[glyph] || 0))
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

  makeRecipe (colony, archaeology, inventory, recipe) {
    let quantity = this.calculateQuantity(inventory, recipe)
    let prettyList = _.map(recipe, _.capitalize).join(', ')
    let plural = util.handlePlurality(quantity, 'Hall')

    if (quantity === 0) {
      return
    }

    log.info(`Making ${quantity} ${plural} with ${prettyList}`)

    return lacuna.buildings.archaeology.assembleGlyphs([
      archaeology.id,
      recipe,
      quantity
    ]).then((result) => {
      this.numMade += quantity
    })
  }

  makeHalls (colony, archaeology, inventory) {
    log.newline()
    log.info(`Looking at ${colony.name}`)

    return Promise.each(RECIPES, (recipe) => {
      return this.makeRecipe(colony, archaeology, inventory, recipe)
    })
  }

  handleColony (colony) {
    return new Promise((resolve, reject) => {
      return lacuna.body.findBuilding(colony.id, 'Archaeology Ministry').then((archaeology) => {
        if (!archaeology) {
          reject(`No Archaeology Ministry on ${colony.name}`)
          return
        }

        return lacuna.buildings.archaeology.getInventory(archaeology.id).then((inventory) => {
          return this.makeHalls(colony, archaeology, inventory)
        })
      }).then(resolve).catch(reject)
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      lacuna.empire.findPlanets(this.options.planet).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony)
        })
      }).then(() => {
        if (this.numMade > 0) {
          let plural = util.handlePlurality(this.numMade, 'Hall')
          resolve(`Made ${this.numMade} ${plural}`)
        } else {
          resolve(`Didn't make any Halls`)
        }
      }).catch(reject)
    })
  }
}

module.exports = MakeHalls
