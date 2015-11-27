'use strict'

let _ = require('lodash')

let Module = require('../module')

function bodyObjectToArray (bodyObj) {
  let arr = []
  _.each(bodyObj, function (value, key) {
    arr.push({
      id: key,
      name: value
    })
  })
  return arr
}

class Empire extends Module {
  constructor () {
    super()

    this.apiMethods('empire', [
      'boost_building',
      'boost_energy',
      'boost_food',
      'boost_happiness',
      'boost_ore',
      'boost_storage',
      'boost_water',
      'change_password',
      'create',
      'disable_self_destruct',
      'edit_profile',
      'enable_self_destruct',
      'fetch_captcha',
      'find',
      'found',
      'get_invite_friend_url',
      'get_species_templates',
      'get_status',
      'invite_friend',
      'is_name_available',
      'login',
      'logout',
      'redeem_essentia_code',
      'redefine_species_limits',
      'redefine_species',
      'reset_password',
      'send_password_reset_message',
      'set_status_message',
      'spy_training_boost',
      'update_species',
      'view_boosts',
      'view_profile',
      'view_public_profile',
      'view_species_stats'
    ])
  }

  findPlanet (name) {
    return this.planets().then((planets) => {
      let planet = _.first(_.filter(planets, {name}))

      if (planet) {
        return planet
      } else {
        return this.homePlanet()
      }
    })
  }

  planets () {
    return this.findBodiesType('planets')
  }

  stations () {
    return this.findBodiesType('stations')
  }

  colonies () {
    return this.findBodiesType('colonies')
  }

  findBodiesType (type) {
    return this.getStatus().then((status) => {
      let arr = bodyObjectToArray(status.empire[type])
      return _.sortBy(arr, 'name')
    })
  }

  homePlanet () {
    return this.getStatus().then((status) => {
      return {
        id: status.empire.home_planet_id,
        name: status.empire.planets[status.empire.home_planet_id]
      }
    })
  }
}

module.exports = Empire
