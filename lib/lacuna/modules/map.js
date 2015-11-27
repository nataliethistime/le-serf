'use strict'

let Module = require('../module')

class Map extends Module {
  constructor () {
    super()

    this.apiMethods('map', [
      'check_star_for_incoming_probe',
      'get_star_by_name',
      'get_star_by_xy',
      'get_star_map',
      'get_star',
      'get_stars',
      'search_stars',
      'view_laws'
    ])
  }
}

module.exports = Map
