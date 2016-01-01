'use strict'

// This file defines functions for handling arguments that are used in multiple different scripts
// that need to have the same behaviour and semantics.

let Promise = require('bluebird')
let _ = require('lodash')

let log = require('../log')
let util = require('../util')

// This function is for handling the `--planet` argument.
//
// It can be one of three things:
//  - the string 'all'
//  - a planet name
//  - an array of planet names
//
// This function takes that mess and returns an array of colony objects.
//
let planet = (lacuna, planet, skip) => {
  let toSkip = util.array(skip)
  let arr = util.array(planet)

  log.debug(`Handling --planet`, planet)
  log.debug(`Handling --skip`, skip)

  return new Promise((resolve, reject) => {
    if (arr.length === 0) {
      reject('please specify a planet')
      return
    }

    if (_.include(arr, 'all')) {
      lacuna.empire.colonies().then(resolve).catch(reject)
    } else {
      lacuna.empire.findPlanets(arr).then(resolve).catch(reject)
    }
  }).then((bodies) => {
    // Handle skipping of bodies.
    return _.filter(bodies, (body) => {
      return !_.include(toSkip, body.name)
    })
  }).then((result) => {
    log.debug(`handlePlanetArg result:`, result)
    return result
  })
}

module.exports = {
  planet
}
