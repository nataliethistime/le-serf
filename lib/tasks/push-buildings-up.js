'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

let Timelist = require('../timelist')

const DONT_UPGRADE = [
  'Pyramid Junk Sculpture',
  'Space Junk Park',
  'Metal Junk Arches',
  'Great Ball of Junk',
  'Junk Henge Sculpture',

  'Gas Giant Settlement Platform',
  'Terraforming Platform',

  'Black Hole Generator',
  'Crashed Ship Site',
  'Oracle of Anid',
  'Pantheon of Hagness',
  'Citadel of Knope',
  `Gratch's Gauntlet`,
  'Library of Jith',
  'Temple of the Drajilites',
  'Pantheon of Hagness',
  'Ravine',

  'Geo Thermal Vent',
  'Interdimensional Rift',
  'Kalavian Ruins',
  'Natural Spring',
  'Volcano',
  'Ravine',

  'Algae Pond',
  'Amalgus Meadow',
  'Beeldeban Nest',
  'Denton Brambles',
  'Lapis Forest',
  'Malcud Field',

  'Beach [1]',
  'Beach [2]',
  'Beach [3]',
  'Beach [4]',
  'Beach [5]',
  'Beach [6]',
  'Beach [7]',
  'Beach [8]',
  'Beach [9]',
  'Beach [10]',
  'Beach [11]',
  'Beach [12]',
  'Beach [13]',

  'Crater',
  'Smoldering Crater',
  'Supply Pod',
  'Lake',
  'Rocky Outcropping'
]

class PushBuildingsUp {

  constructor (options) {
    this.options = options

    this.upgraded = 0
    this.timelist = new Timelist()
  }

  upgradeBuildings (buildings) {
    return Promise.mapSeries(buildings, (b) => {
      log.info(`Upgrading ${b.name} from level ${b.level} to ${b.level + 1}`)

      if (this.options.dryRun) {
        return
      }

      return lacuna.buildings.generic(b.url).upgrade([b.id]).then((result) => {
        this.upgraded++
        this.timelist.add(result.building.pending_build.end)
      }).catch((err) => {
        if (err === `There's no room left in the build queue.`) {
          throw err
        } else {
          util.handlePromiseError(err)
        }
      })
    })
  }

  handleColony (colony) {
    return lacuna.body.buildings(colony.id).then((buildings) => {
      // Add existing builds to the time list.
      _.each(buildings, (b) => {
        if (b.pending_build) {
          this.timelist.add(b.pending_build.end)
        }
      })

      let toUpgrade = _.chain(buildings)
        .map((b) => {
          b.level = util.int(b.level)
          return b
        })
        .sortBy('level')
        .filter((b) => {
          if (b.level === 30) {
            return false
          // Level 30 Space Ports use too much energy.
          } else if (b.lebel >= 28 && b.name === 'Space Port') {
            return false
          } else if (_.includes(DONT_UPGRADE, b.name)) {
            return false
          } else if (b.pending_build) {
            return false
          } else {
            return true
          }
        })
        .value()

      return this.upgradeBuildings(toUpgrade).catch((err) => {
        util.handlePromiseError(err)
        log.info('Moving on')
      })
    })
  }

  handleSleep () {
    return new Promise((resolve, reject) => {
      this.timelist.sleepUntilSoonest(() => {
        log.newline()
        log.info('Running again')
        log.newline()

        resolve()
      })
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      lacuna.empire.findPlanets(this.options.planet).then((colonies) => {
        return Promise.mapSeries(colonies, (colony) => {
          log.newline()
          log.info(`Looking at ${colony.name}`)
          return this.handleColony(colony)
        })
      }).then(() => {
        let plural = util.handlePlurality(this.upgraded, 'building')
        let message = this.upgraded === 0
          ? `Didn't upgrade any buildings`
          : `Successfully upgraded ${this.upgraded} ${plural}`

        log.newline()
        log.info(message)

        return this.handleSleep().then(() => {
          this.upgraded = 0
          this.timelist.clear()
          this.run()
        })
      }).catch(reject)
    })
  }
}

module.exports = PushBuildingsUp
