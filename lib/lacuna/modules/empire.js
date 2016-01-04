'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let Module = require('../module')

var log = require('../../log')
var util = require('../../util')

/**
 * TODO
 *
 * @memberof lacuna
 * @namespace lacuna.empire
 * @alias lacuna.empire
 */
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

  /**
   * This function is for handling the `--planet` argument.
   *
   * It can be one of three things:
   *  - the string 'all'
   *  - a planet name
   *  - an array of planet names
   *
   * @example
   * lacuna.empire.findPlanets(['Earth', 'Mars'])
   * // Returns:
   * [
   *   {
   *     name: 'Earth',
   *     id: 3
   *   },
   *   {
   *     name: 'Mars',
   *     id: 4
   *   }
   * ]
   *
   * @memberof lacuna.empire
   * @alias lacuna.empire.findPlanets
   *
   * @param  {string|array} planet - the planet names you want to find
   * @param  {string|array} skip   - the planet names you want to skip
   * @return {array}                 array of the planets that were found
   */
  findPlanets (planet, skip) {
    let lacuna = require('../index')

    let toSkip = util.array(skip)
    let arr = util.array(planet)

    log.debug(`Handling --planet`, planet)
    log.debug(`Handling --skip`, skip)

    return new Promise((resolve, reject) => {
      if (arr.length === 0) {
        reject('please specify a planet')
        return
      }

      if (_.include(arr, 'all')) {
        lacuna.empire.colonies().then(resolve).catch(reject)
      } else {
        lacuna.empire.findPlanets(arr).then(resolve).catch(reject)
      }
    }).then((bodies) => {
      // Handle skipping of bodies.
      return _.filter(bodies, (body) => {
        return !_.include(toSkip, body.name)
      })
    }).then((result) => {
      log.debug(`handlePlanetArg result:`, result)
      return result
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
