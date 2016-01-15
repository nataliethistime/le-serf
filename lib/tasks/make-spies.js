'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

class MakeSpies {

  constructor (options) {
    this.options = options
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

    return new Promise((resolve, reject) => {
      Promise.mapSeries(arr, (num) => {
        let plural = util.handlePlurality(num, 'spy')

        log.info(`Making ${num} ${plural}`)

        return lacuna.buildings.intelligence.trainSpy([intelId, num])
          .then((result) => {
            if (util.int(result.not_trained) > 0) {
              // TODO: handle this up the Promise chain somewhere so that
              // we don't crash the whole script!
              reject(result.reason_not_trained.message)
            } else {
              return util.int(result.trained)
            }
          })
      }).then((results) => {
        resolve(_.sum(results))
      })
    })
  }

  handleColony (colony) {
    return new Promise((resolve, reject) => {
      log.info(`Looking at Intelligence Ministry on ${colony.name}`)

      lacuna.body.findBuilding(colony.id, 'Intelligence Ministry')
        .then((intelMin) => {
          if (intelMin === undefined) {
            log.warn(`No Intelligence Ministry on ${colony.name}`)
            resolve(0)
            return
          }

          return lacuna.buildings.intelligence.view([intelMin.id])
            .then((result) => {
              let spies = result.spies
              let max = util.int(spies.maximum)
              let current = (util.int(spies.in_training) + util.int(spies.current))

              if (max > current) {
                let toTrain = max - current
                let plural = util.handlePlurality(toTrain, 'spy')
                log.info(`Making ${toTrain} ${plural} on ${colony.name}`)

                this.makeSpies(intelMin.id, toTrain).then(() => {
                  resolve(toTrain)
                })
              } else {
                log.info(`No need to make spies on ${colony.name}`)
                resolve(0)
              }
            })
        }).catch(reject)
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
        return Promise.mapSeries(colonies, (colony) => {
          log.newline()
          return this.handleColony(colony)
        })
      }).then((results) => {
        let num = _.sum(results)
        let plural = util.handlePlurality(num, 'spy')

        resolve(num === 0
          ? `Didn't make any spies`
          : `Successfully made ${num} ${plural}`
        )
      }).catch(reject)
    })
  }
}

module.exports = MakeSpies
