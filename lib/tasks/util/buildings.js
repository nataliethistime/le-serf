'use strict'

let Promise = require('bluebird')
let log = require('../../log')

// Returns a list of every building in the empire.
let getAllBuildings = (lacuna) => {
  return new Promise((resolve, reject) => {
    let allBuildings = []

    lacuna.empire.colonies().then((colonies) => {
      return Promise.mapSeries(colonies, (colony) => {
        log.info(`Getting buildings on ${colony.name}`)
        return lacuna.body.buildings(colony.id).then((buildings) => {
          allBuildings = allBuildings.concat(buildings)
        })
      })
    }).then(() => {
      resolve(allBuildings)
    }).catch(reject)
  })
}

module.exports = {
  getAllBuildings
}
