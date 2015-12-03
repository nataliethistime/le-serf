'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let log = require('../../log')

let findPlanets = (lacuna, planetNames) => {
  return lacuna.empire.getStatus().then((result) => {
    // Invert so we can key by name instead of ID.
    let planets = _.invert(result.empire.planets)

    return Promise.mapSeries(planetNames, (planetName) => {
      return new Promise((resolve, reject) => {
        let planetId = planets[planetName]

        if (planetId) {
          resolve({
            id: planetId,
            name: planetName
          })
        } else {
          reject(`Planet ${planetName} not found`)
        }
      })
    })
  })
}

let findPlanet = (lacuna, planetName) => {
  return findPlanets(lacuna, _.flatten([planetName])).then(_.first)
}

let handleSkip = (colonies, skip) => {
  colonies = _.flatten([colonies])
  skip = _.flatten([skip])

  return _.filter(colonies, (colony) => {
    return !_.include(skip, colony.name)
  })
}

// `planet` can be one of three things:
//  - the string 'all'
//  - a planet name
//  - an array of planet names
//
// This function takes that mess and returns an array of colony objects.
let handlePlanetArg = (lacuna, planet, skip) => {
  skip = skip || []

  log.debug(`Handling --planet`, planet)
  log.debug(`Handling --skip`, skip)

  return new Promise((resolve, reject) => {
    if (!planet) {
      reject('Please specify a planet')
      return
    }

    let arr = _.flatten([planet])

    if (_.include(arr, 'all')) {
      lacuna.empire.colonies().then((colonies) => {
        resolve(handleSkip(colonies, skip))
      }).catch(reject)
    } else {
      findPlanets(lacuna, arr).then((colonies) => {
        resolve(handleSkip(colonies, skip))
      }).catch(reject)
    }
  }).then((result) => {
    log.debug(`handlePlanetArg result:`, result)
    return result
  })
}

module.exports = {
  findPlanets,
  findPlanet,
  handlePlanetArg
}
