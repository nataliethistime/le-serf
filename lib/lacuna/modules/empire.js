'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let Module = require('../module')

var log = require('../../log')
var util = require('../../util')

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

  findPlanets (planetNames) {
    return this.getStatus().then((result) => {
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

  findPlanet (name) {
    return this.findPlanets(util.array(name)).then(_.first)
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
      let arr = []

      _.each(status.empire[type], function (value, key) {
        arr.push({
          id: key,
          name: value
        })
      })

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

  getAllBuildings () {
    let lacuna = require('../index')

    return new Promise((resolve, reject) => {
      let result = []

      this.colonies().then((colonies) => {
        return Promise.mapSeries(colonies, (colony) => {
          log.info(`Looking at ${colony.name}`)

          return lacuna.body.buildings(colony.id).then((buildings) => {
            result = result.concat(buildings)
          })
        })
      }).then(() => {
        resolve(result)
      }).catch(reject)
    })
  }
}

module.exports = Empire
