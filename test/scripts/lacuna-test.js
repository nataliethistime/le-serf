'use strict'

let lacuna = require('../../lib/lacuna/test-instance')
let log = require('../../lib/log')

let _ = require('lodash')

lacuna.authenticate().then((sessionId) => {
  log.info(`Session ID is ${sessionId}`)
  return lacuna.empire.getStatus()
}).then((result) => {
  log.info(`My name is ${result.empire.name}`)
  log.info(`I have ${result.empire.essentia} Essentia`)

  return lacuna.empire.findPlanet('Preyulara')
}).then((planet) => {
  log.info(`My home planet is: ${planet.name} (${planet.id})`)

  return lacuna.body.findBuilding(planet.id, 'Planetary Command Center')
}).then((planetaryCommand) => {
  log.info(`The home planet's PCC is at level ${planetaryCommand.level}`)

  return lacuna.buildings.planetaryCommand.viewPlans([planetaryCommand.id])
}).then((result) => {
  let numOfPlans = result.plans.length
  log.info(`There are ${numOfPlans} plans on ${result.status.body.name}`)
  return lacuna.empire.colonies()
}).then((result) => {
  let colonies = _.pluck(result, 'name').join(', ')
  log.info(`These are my colonies: ${colonies}`)
}).then(() => {
  log.info('Done')
}).catch((err) => {
  log.error(err)
})
