'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let log = require('../../log')
let util = require('../../util')

let Timelist = require('../../timelist')

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
  'Beach [13]'
]

class PushBuildingsUp {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    this.upgraded = 0
    this.timelist = new Timelist()
  }

  upgradeBuildings (buildings) {
    return Promise.mapSeries(buildings, (b) => {
      log.info(`Upgrading ${b.name} from level ${b.level} to ${b.level + 1}`)

      return this.lacuna.buildings.generic(b.url).upgrade([b.id]).then((result) => {
        this.upgraded++
        this.timelist.add(result.building.pending_build.end)
      })
    })
  }

  handleColony (colony) {
    return this.lacuna.body.buildings(colony.id).then((buildings) => {
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
          } else {
            return true
          }
        })
        .value()

      return this.upgradeBuildings(toUpgrade).catch((err) => {
        log.error(err)
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
      resolve(true)
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      this.lacuna.authenticate().then(() => {
        return this.lacuna.empire.colonies()
      }).then((colonies) => {
        return Promise.mapSeries(colonies, (colony) => {
          log.newline()
          log.info(`Looking at ${colony.name}`)
          return this.handleColony(colony)
        })
      }).then(() => {
        let plural = this.upgraded > 1 ? 's' : ''
        let message = this.upgraded === 0
          ? `Didn't upgrade any buildings`
          : `Successfully upgraded ${this.upgraded} building${plural}`

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
