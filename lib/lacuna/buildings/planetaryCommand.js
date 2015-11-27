'use strict'

let Building = require('../building')

class PlanetaryCommand extends Building {
  constructor () {
    super('planetarycommand')

    this.apiMethods('planetarycommand', [
      'view_plans',
      'view_incoming_supply_chains',
      'subsidize_pod_cooldown'
    ])
  }
}

module.exports = PlanetaryCommand
