'use strict'

let Building = require('../building')

class SpacePort extends Building {
  constructor () {
    super('spaceport')

    this.apiMethods('spaceport', [
      'fetch_spies',
      'get_fleet_for',
      'get_ships_for',
      'mass_scuttle_ship',
      'name_ship',
      'prepare_fetch_spies',
      'prepare_send_spies',
      'recall_all',
      'recall_ship',
      'scuttle_ship',
      'send_fleet',
      'send_ship',
      'send_ship_types',
      'send_spies',
      'view_all_ships',
      'view_battle_logs',
      'view_foreign_ships',
      'view_ships_orbiting',
      'view_ships_travelling'
    ])
  }
}

module.exports = SpacePort
