'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let moment = require('moment')
require('moment-duration-format')

let log = require('../../log')
let util = require('../../util')

let empireUtils = require('../util/empire')

// This is the template that the upgrader follows.
// The template is comprised of sections.
// Each section is an array of buildings to upgrade.
// Each building is an object containing the name of the building and the level to upgrade to.
// Only one section is upgraded at a time.

const TEMPLATE = [

  // I tend to max my glyph buildings as soon as I colonise a colony. Hence, this is here.
  [
    {
      level: 30,
      name: 'Algae Pond'
    },
    {
      level: 30,
      name: 'Amalgus Meadow'
    },
    {
      level: 30,
      name: 'Beeldeban Nest'
    },
    {
      level: 30,
      name: 'Denton Brambles'
    },
    {
      level: 30,
      name: 'Lapis Forest'
    },
    {
      level: 30,
      name: 'Malcud Field'
    },
    {
      level: 30,
      name: 'Volcano'
    },
    {
      level: 30,
      name: 'Natural Spring'
    },
    {
      level: 30,
      name: 'Geo Thermal Vent'
    },
    {
      level: 30,
      name: 'Kalavian Ruins'
    },
    {
      level: 30,
      name: 'Interdimensional Rift'
    },
    {
      level: 30,
      name: 'Crashed Ship Site'
    },
    {
      level: 30,
      name: 'Pantheon of Hagness'
    }
  ],

  // Basic construction stuff.
  [
    {
      level: 30,
      name: 'Oversight Ministry'
    },
    {
      level: 5,
      name: 'Development Ministry'
    }
  ],

  // Get the Archaeology up a bit
  [
    {
      level: 25,
      name: 'Archaeology Ministry'
    }
  ],

  // Upgrade the shipyards so we can build some Excavators.
  [
    {
      level: 20,
      name: 'Shipyard'
    }
  ],

  // Upgrade the spaceports so we can hold some Excavators.
  [
    {
      level: 5,
      name: 'Space Port'
    }
  ],

  // Upgrade the Dev Min so we can build more.
  [
    {
      level: 15,
      name: 'Development Ministry'
    }
  ],

  // Some defence would be nice, too.
  [
    {
      level: 10,
      name: 'Shield Against Weapons'
    }
  ],

  // Upgrade the Archaeology all the way.
  [
    {
      level: 30,
      name: 'Archaeology Ministry'
    }
  ],

  // If you're cever enough to have one of these - go nuts.
  [
    {
      level: 30,
      name: 'Lost City of Tyleon (A)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (B)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (C)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (D)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (E)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (F)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (G)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (H)'
    },
    {
      level: 30,
      name: 'Lost City of Tyleon (I)'
    }
  ],

  // Get started on all the spy releated stuff.
  [
    {
      level: 20,
      name: 'Intelligence Ministry'
    },
    {
      level: 20,
      name: 'Security Ministry'
    },
    {
      level: 20,
      name: 'Espionage Ministry'
    },
    {
      level: 20,
      name: 'Intel Training'
    },
    {
      level: 20,
      name: 'Mayhem Training'
    },
    {
      level: 20,
      name: 'Politics Training'
    },
    {
      level: 20,
      name: 'Theft Training'
    }
  ],

  // Get setup to make Space Station plans, too.
  [
    {
      level: 20,
      name: 'Space Station Lab (A)'
    },
    {
      level: 20,
      name: 'Space Station Lab (B)'
    },
    {
      level: 20,
      name: 'Space Station Lab (C)'
    },
    {
      level: 20,
      name: 'Space Station Lab (D)'
    }
  ],

  // Finish off the shipyards.
  [
    {
      level: 30,
      name: 'Shipyard'
    }
  ],

  // Max out the ship attribute buildings.
  [
    {
      level: 30,
      name: 'Trade Ministry'
    },
    {
      level: 30,
      name: 'Pilot Training Facility'
    },
    {
      level: 30,
      name: 'Munitions Lab'
    },
    {
      level: 30,
      name: 'Cloaking Lab'
    },
    {
      level: 30,
      name: 'Propulsion System Factory'
    }
  ],

  // Upgrade the defences a bit further.
  [
    {
      level: 20,
      name: 'Shield Against Weapons'
    }
  ],

  // Finish off the spy stuff.
  [
    {
      level: 30,
      name: 'Intelligence Ministry'
    },
    {
      level: 30,
      name: 'Security Ministry'
    },
    {
      level: 30,
      name: 'Espionage Ministry'
    },
    {
      level: 30,
      name: 'Intel Training'
    },
    {
      level: 30,
      name: 'Mayhem Training'
    },
    {
      level: 30,
      name: 'Politics Training'
    },
    {
      level: 30,
      name: 'Theft Training'
    }
  ],

  // Finish off the SAWs
  [
    {
      level: 30,
      name: 'Shield Against Weapons'
    }
  ],

  // These are all 'bonus buildings' that need to be upgraded eventually, I guess.
  [
    {
      level: 30,
      name: 'Mission Command'
    },
    {
      level: 30,
      name: 'Entertainment District'
    },
    {
      level: 30,
      name: 'Observatory'
    },
    {
      level: 30,
      name: 'Terraforming Lab'
    },
    {
      level: 30,
      name: 'Gas Giant Lab'
    },
    {
      level: 30,
      name: 'Subspace Transporter'
    },
    {
      level: 30,
      name: 'Planetary Command Center'
    },
    {
      level: 30,
      name: 'Network 19'
    },
    {
      level: 30,
      name: 'Genetics Lab'
    },
    {
      level: 30,
      name: 'Waste Sequestration Well'
    },
    {
      level: 30,
      name: 'Development Ministry'
    }
  ],

  // Waste some time on these...
  [
    {
      level: 30,
      name: 'Food Reserve'
    },
    {
      level: 30,
      name: 'Ore Storage Tanks'
    },
    {
      level: 30,
      name: 'Water Storage Tank'
    },
    {
      level: 30,
      name: 'Energy Reserve'
    }
  ],

  // Finally, upgrade all the Space Port. Only up to level 28 because 30 uses too much energy.
  [
    {
      level: 28,
      name: 'Space Port'
    }
  ]
]

class UpgradeBuildings {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    // Make sure these args are what we're expecting.
    this.options.skip = _.flatten([this.options.skip])
    this.options.planet = _.flatten([this.options.planet])

    // This is for tracking the number of buildings that have been upgraded this run.
    this.upgraded = 0

    // This array is for storing all the dates on which upgrades will end. It's used to determine
    // the length of time to sleep for when run in loop mode.
    this.upgradeEndDates = []
  }

  // This method clears the upgrade count and the array of upgrade end dates.
  // It's called before the whole task runs again when in loop mode.
  //
  reset () {
    this.upgraded = 0

    // See: http://stackoverflow.com/a/1234337
    this.upgradeEndDates.length = 0
  }

  // This method calculates the number of milliseconds until the next upgrade finishes.
  //
  calculateSleepTime (endDates, serverDate) {
    let endDate = _.first(_.sortBy(endDates,
      _.partial(util.msRange, util.serverDateFormat, serverDate)))
    let sleepTime = util.msRange(util.serverDateFormat, serverDate, endDate)

    if (sleepTime < 0) {
      sleepTime = 0
    }

    // Add some extra time just to make sure - this script runs pretty fast.
    return sleepTime + 5000
  }

  // This method sleeps until the next build has finished.
  // It handles:
  //  - calcululating how long to sleep for according to the server time and the saved end dates of
  //    all pending builds.
  //  - running this task again when the time is elapsed
  //
  handleSleep () {
    return new Promise((resolve, reject) => {
      this.lacuna.empire.getStatus().then((result) => {
        let sleepTime = this.calculateSleepTime(_.clone(this.upgradeEndDates), result.server.time)
        let formatted = moment.duration(sleepTime, 'milliseconds').format()

        log.info(`Sleeping for ${formatted} before running again`)

        setTimeout(() => {
          this.reset()

          log.newline()
          log.info('Running again')
          log.newline()

          resolve()
        }, sleepTime)
      }).catch(reject)
    })
  }

  // This method checks if a building can be upgraded.
  // It handles:
  //  - rejecting if there's any error
  checkPossibleUpgrade (bd) {
    return new Promise((resolve, reject) => {
      let b = this.lacuna.genericBuilding(bd.url)

      b.view([bd.id]).then((result) => {
        if (result.building.upgrade.can) {
          resolve()
        } else {
          let textReason = result.building.upgrade.reason[1]
          reject(textReason)
        }
      }).catch(reject)
    })
  }

  // This method upgrades the given building.
  // It handles:
  //  - logging the action to the screen
  //  - incrementing the buildings upgraded counter
  //
  upgradeBuilding (bd) {
    log.info(`Upgrading ${bd.name} (${bd.x}, ${bd.y}) from ${bd.level} to ` +
      `${(bd.level * 1) + 1}`)

    return this.checkPossibleUpgrade(bd).then(() => {
      let b = this.lacuna.genericBuilding(bd.url)

      return b.upgrade([bd.id]).then((result) => {
        this.upgradeEndDates.push(result.building.pending_build.end)
        this.upgraded++
      })
    })
  }

  // This method upgrades a list of buildings according to the template.
  // It handles:
  //  - making sure that one section is upgraded at a time
  //  - makue sure we don't try to upgrade a building thats already upgrading
  //
  upgradeBuildings (buildings) {
    // This variable is used to ensure that one section is upgraded at a time.
    let sectionCompleted = true

    return Promise.each(TEMPLATE, (section) => {
      // If the section isn't complete, don't go any further in the template.
      if (!sectionCompleted) {
        return
      }

      return Promise.each(section, (build) => {
        // A build is an upgrade that should be done according to the template.
        // Here, we go through each one and see if it can be done.

        return this.lacuna.body.findBuildings(buildings, build.name)
          .then((matches) => {
            // A 'match' is a building that matches the current 'build' within
            // the current 'section'.

            return Promise.each(matches, (match) => {
              if (build.level > match.level) {
                // A section is considered incomplete when there's still more
                // that needs upgrading.
                sectionCompleted = false

                // Don't try and upgrade something that's already upgrading.
                if (match.pending_build) {
                  return
                }

                return this.upgradeBuilding(match)
              }
            })
          })
      })
    })
  }

  // This method handles getting and upgrading buildings and a given colony.
  // It also handles:
  //  - errors thrown anyhwere in the upgrading process
  //  - saving the build end dates for later
  //
  handleColony (colony) {
    log.newline()
    log.info(`Upgrading buildings on ${colony.name}`)

    return this.lacuna.body.buildings(colony.id).then((buildings) => {
      // Take note of everything that's upgrading.
      _.each(buildings, (building) => {
        if (building.pending_build) {
          this.upgradeEndDates.push(building.pending_build.end)
        }
      })

      return this.upgradeBuildings(buildings).catch((err) => {
        log.error(err)
        log.info('Moving on')
      })
    })
  }

  handleRun (colonyNames) {
    // Skip planets that are in the skip array
    colonyNames = _.filter(colonyNames, (name) => {
      return !_.include(this.options.skip, name)
    })

    return empireUtils.findPlanets(this.lacuna, colonyNames)
      .then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony)
        })
      })
  }

  run () {
    return new Promise((resolve, reject) => {
      return this.lacuna.authenticate().then(() => {
        return this.lacuna.empire.colonies()
      }).then((colonies) => {
        if (this.options.allColonies) {
          return this.handleRun(_.pluck(colonies, 'name'))
        } else if (this.options.planet) {
          return this.handleRun(this.options.planet)
        } else {
          return
        }
      }).then(() => {
        let plural = this.upgraded > 1 ? 's' : ''
        let message = this.upgraded === 0
          ? `Didn't upgrade any buildings`
          : `Successfully upgraded ${this.upgraded} building${plural}`

        if (this.options.loop) {
          log.newline()
          log.info(message)

          return this.handleSleep().then(() => {
            this.run()
          })
        } else {
          resolve(message)
        }
      }).catch(reject)
    })
  }
}

module.exports = UpgradeBuildings
