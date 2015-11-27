'use strict'

let Building = require('../building')

class PoliceStation extends Building {
  constructor () {
    super('policestation')

    this.apiMethods('policestation', [
      'execute_prisoner',
      'release_prisoner',
      'view_foreign_ships',
      'view_foreign_spies',
      'view_prisoners',
      'view_ships_orbiting',
      'view_ships_travelling'

    ])
  }
}

module.exports = PoliceStation
