'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let argHandlers = require('../cli/arg-handlers')

let log = require('../log')
let util = require('../util')

const MISSION_STATUS_TO_LOG_LEVEL = {
  Accepted: 'info',
  Success: 'info',
  Bounce: 'warn',
  Failure: 'error'
}

class BuildShips {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    this.assigned = 0
  }

  getNewAssignment (spy, maxSkillLevels) {
    let newAssignment = ''

    if (this.options.assignment === 'Skill Training') {
      let sortable = [
        {
          name: 'Intel Training',
          skill: util.int(spy.intel),
          max: maxSkillLevels.intel
        },
        {
          name: 'Mayhem Training',
          skill: util.int(spy.mayhem),
          max: maxSkillLevels.mayhem
        },
        {
          name: 'Politics Training',
          skill: util.int(spy.politics),
          max: maxSkillLevels.politics
        },
        {
          name: 'Theft Training',
          skill: util.int(spy.theft),
          max: maxSkillLevels.theft
        }
      ]

      let nextSkill = _.chain(sortable)
        // Ignore items where we've hit the max.
        .filter((item) => {
          return item.skill < item.max
        })
        .sortBy('name')
        .first()
        .value()

      newAssignment = nextSkill.name
    } else {
      newAssignment = this.options.assignment
    }

    // Ensure that this spy can be assigned to this assignment. Otherwise return the old one.
    let possibleAssignmentNames = _.pluck(spy.possible_assignments, 'task')
    let canAssign = _.include(possibleAssignmentNames, newAssignment)
    return canAssign ? newAssignment : spy.assignment
  }

  shouldChangeAssignment (spy) {
    // NOTE: 'Training' is the spy's initial training. Not training a skill like intel or mayhem.
    if (!util.int(spy.is_available) || spy.assignment === 'Training') {
      return false
    } else if (spy.assignment !== this.options.assignment) {
      return true
    } else {
      return false
    }
  }

  assignSpies (intelMin, spies, maxSkillLevels) {
    return Promise.each(spies, (spy) => {
      if (this.shouldChangeAssignment(spy)) {
        let newAssignment = this.getNewAssignment(spy, maxSkillLevels)
        let isHome = spy.based_from.id === spy.assigned_to.id

        // Avoid setting the spy's assignment if it hasn't changed.
        if (spy.assignment === newAssignment) {
          return
        }

        // Only display the planet name if the spy is away-from-home.
        if (isHome) {
          log.info(`Assigning ${spy.name} from ${spy.assignment} to ${newAssignment}`)
        } else {
          log.info(`Assigning ${spy.name} on ${spy.assigned_to.name} ` +
            `from ${spy.assignment} to ${newAssignment}`)
        }

        if (!this.options.dryRun) {
          return this.lacuna.buildings.intelligence.assignSpy([
            intelMin.id,
            spy.id,
            newAssignment
          ]).then((result) => {
            let level = MISSION_STATUS_TO_LOG_LEVEL[result.mission.result]
            log.log(level, `${result.mission.result}: ${result.mission.reason}`)
            this.assigned++
          })
        }
      }
    })
  }

  handleColony (colony) {
    log.newline()
    log.info(`Looking at ${colony.name}`)

    return this.lacuna.body.buildings(colony.id).then((buildings) => {
      return Promise.all([
        this.lacuna.body.findBuilding(buildings, 'Intelligence Ministry'),
        this.lacuna.body.findBuilding(buildings, 'Intel Training'),
        this.lacuna.body.findBuilding(buildings, 'Mayhem Training'),
        this.lacuna.body.findBuilding(buildings, 'Politics Training'),
        this.lacuna.body.findBuilding(buildings, 'Theft Training')
      ]).spread((intelMin, intelTraining, mayhemTraining, politicsTraining, theftTraining) => {
        if (!intelMin) {
          log.warn(`No Intelligence Ministry found on ${colony.name}`)
          return
        }

        // We use the building levels to calculate the max a spy can get per skill.
        // NOTE: the formula for calculating this was taken straight from the server code.
        // See: https://goo.gl/HvcZnp
        let maxSkillLevels = {}

        if (!intelTraining) {
          log.warn(`No Intel Training found on ${colony.name}`)
          maxSkillLevels.intel = 0
        } else {
          maxSkillLevels.intel = 350 + util.int(intelTraining.level) * 75
        }

        if (!mayhemTraining) {
          log.warn(`No Mayhem Training found on ${colony.name}`)
          maxSkillLevels.mayhem = 0
        } else {
          maxSkillLevels.mayhem = 350 + util.int(mayhemTraining.level) * 75
        }

        if (!politicsTraining) {
          log.warn(`No Politics Training found on ${colony.name}`)
          maxSkillLevels.politics = 0
        } else {
          maxSkillLevels.politics = 350 + util.int(politicsTraining.level) * 75
        }

        if (!theftTraining) {
          log.warn(`No Theft Training found on ${colony.name}`)
          maxSkillLevels.theft = 0
        } else {
          maxSkillLevels.theft = 350 + util.int(theftTraining.level) * 75
        }

        return this.lacuna.buildings.intelligence.viewAllSpies([intelMin.id]).then((result) => {
          log.info(`Checking ${result.spies.length} spies`)
          return this.assignSpies(intelMin, result.spies, maxSkillLevels)
        })
      })
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
      } else if (!this.options.assignment) {
        reject(`please specify an assignment`)
      } else {
        resolve(true)
      }
    })
  }

  run () {
    if (this.options.dryRun) {
      log.info('RUNNING IN DRY-RUN MODE')
      log.newline()
    }

    return new Promise((resolve, reject) => {
      this.lacuna.authenticate().then(() => {
        // No captcha in dry-run mode
        if (!this.options.dryRun) {
          return this.lacuna.captcha.prompt()
        }
      }).then(() => {
        return argHandlers.planet(this.lacuna, this.options.planet)
      }).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony)
        })
      }).then(() => {
        let plural = this.assigned > 1 ? 'spies' : 'spy'
        let message = this.assigned > 0
          ? `Successfully assigned ${this.assigned} ${plural}`
          : `Didn't assign any spies`

        resolve(message)
      }).catch(reject)
    })
  }
}

module.exports = BuildShips
