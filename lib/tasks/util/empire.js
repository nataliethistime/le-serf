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
  return findPlanets(lacuna, _.flatten([planetName])).then((result) => {
    // findPlanets returns an array. So, get the first.
    return _.first(result)
  })
}

module.exports = {
  findPlanets,
  findPlanet
}
