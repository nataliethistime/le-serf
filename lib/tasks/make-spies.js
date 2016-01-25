'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class MakeSpies {

  constructor (options) {
    this.options = options

    this.spiesTrained = 0
  }

  makeSpies (intelId, quantity) {
    // We can only train spies in batches of 1, 2, 3, 4 or 5.
    // If you see this and can think of a better way to do it, please
    // feel free to send in a PR - 'cause this is shit.
    let arr = []
    while (quantity > 0) {
      _.each([5, 4, 3, 2, 1], (num) => {
        if (util.isMultiple(quantity, num)) {
          arr.push(num)
          quantity -= num
          return false // break out of loop
        }
      })
    }

    log.debug('Training spies:', arr)

    return Promise.mapSeries(arr, (num) => {
      let plural = util.handlePlurality(num, 'spy')

      log.info(`Making ${num} ${plural}`)

      return lacuna.buildings.intelligence.trainSpy([intelId, num]).then((result) => {
        if (util.int(result.not_trained) > 0) {
          return new Promise((resolve, reject) => {
            reject(result.reason_not_trained.message)
          })
        } else {
          this.spiesTrained += util.int(result.trained)
        }
      })
    })
  }

  handleColony (colony, buildings) {
    return lacuna.body.findBuilding(colony.id, 'Intelligence Ministry').then((intelMin) => {
      if (intelMin === undefined) {
        log.warn(`No Intelligence Ministry on ${colony.name}`)
        return
      }

      return lacuna.buildings.intelligence.view([intelMin.id]).then((result) => {
        let spies = result.spies
        let max = util.int(spies.maximum)
        let current = util.int(spies.in_training) + util.int(spies.current)

        if (max > current) {
          let toTrain = max - current
          let plural = util.handlePlurality(toTrain, 'spy')
          log.info(`Making ${toTrain} ${plural} on ${colony.name}`)

          return this.makeSpies(intelMin.id, toTrain)
        } else {
          log.info(`No need to make spies on ${colony.name}`)
        }
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
      }).then((results) => {
        let plural = util.handlePlurality(this.spiesTrained, 'spy')

        resolve(this.spiesTrained === 0
          ? `Didn't make any spies`
          : `Successfully made ${this.spiesTrained} ${plural}`
        )
      }).catch(reject)
    })
  }
}

module.exports = MakeSpies
