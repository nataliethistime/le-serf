'use strict'

let Building = require('../building')

class StationCommand extends Building {
  constructor () {
    super('stationcommand')

    this.apiMethods('stationcommand', [
      'view',
      'view_plans',
      'view_incoming_supply_chains'
    ])
  }
}

module.exports = StationCommand
