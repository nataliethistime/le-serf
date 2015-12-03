'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

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
  return findPlanets(lacuna, _.flatten([planetName]))
    // findPlanets returns an array. So, get the first.
    .then(_.first)
}

// `planet` can be one of three things:
//  - the string 'all'
//  - a planet name
//  - an array of planet names
//
// This function takes that mess and returns an array of colony objects.
let handlePlanetArg = (lacuna, planet) => {
  return new Promise((resolve, reject) => {
    if (!planet) {
      reject('Please specify a planet')
      return
    }

    let arr = _.flatten([planet])

    if (_.include(arr, 'all')) {
      lacuna.empire.colonies().then((colonies) => {
        resolve(colonies)
      }).catch(reject)
    } else {
      findPlanets(lacuna, arr).then((colonies) => {
        resolve(colonies)
      }).catch(reject)
    }
  })
}

module.exports = {
  findPlanets,
  findPlanet,
  handlePlanetArg
}
