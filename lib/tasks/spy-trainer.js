'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let argHandlers = require('../cli/arg-handlers')

let log = require('../log')
let util = require('../util')

const MISSION_NAMES = {
  intel: 'Intel Training',
  mayhem: 'Mayhem Training',
  politics: 'Politics Training',
  theft: 'Theft Training'
}

const SKILLS = ['intel', 'mayhem', 'politics', 'theft']

class SpyTrainer {

  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    this.trained = 0
  }

  trainSpy (intelMin, spy) {
    if (spy.assignment === spy.newAssignment) {
      return
    }

    log.info(`Setting ${spy.name} to ${spy.newAssignment.toLowerCase()}`)

    if (!this.options.dryRun) {
      return this.lacuna.buildings.intelligence.assignSpy([
        intelMin.id,
        spy.id,
        spy.newAssignment
      ]).then((result) => {
        this.trained++
      })
    }
  }

  trainSpies (intelMin, spies) {
    log.newline()
    return Promise.each(spies, (spy) => this.trainSpy(intelMin, spy))
  }

  distributeSkills (spies, maxSkillLevels) {
    // Max number of spies to have training per training building.
    let trainMax = Math.ceil(spies.length / 4)

    // Number of spies set to train in each building
    let training = {
      intel: 0,
      mayhem: 0,
      politics: 0,
      theft: 0
    }

    let toTrain = _.map(spies, (spy) => {
      _.each(SKILLS, (skill) => {
        if (training[skill] < trainMax && util.int(spy[skill]) < maxSkillLevels[skill]) {
          spy.newAssignment = MISSION_NAMES[skill]
          training[skill]++

          // Break out
          return false
        }
      })

      if (!spy.newAssignment) {
        // TODO: can this happen?
        // TODO: what do we do about it?
        log.error(`Assigning skill to spy didn't work`)
      }

      return spy
    })

    _.each(SKILLS, (skill) => {
      let num = training[skill]
      let plural = num > 1 ? 'spies' : 'spy'
      let mission = MISSION_NAMES[skill].toLowerCase()

      if (num === 0) {
        log.info(`Not setting any spies to ${mission}`)
      } else {
        log.info(`Setting ${num} ${plural} to ${mission}`)
      }
    })

    return toTrain
  }

  setSkill (spies, skill) {
    let newAssignment = MISSION_NAMES[skill]

    let toTrain = _.map(spies, (spy) => {
      spy.newAssignment = newAssignment
      return spy
    })

    let num = toTrain.length
    let plural = toTrain.length > 1 ? 'spies' : 'spy'
    let mission = newAssignment.toLowerCase()

    if (num === 0) {
      log.info(`Not setting any spies to ${mission}`)
    } else {
      log.info(`Setting ${num} ${plural} to ${mission}`)
    }

    return toTrain
  }

  getSpies (intelMin, maxSkillLevels, colony) {
    let maxSkillLevelTotal = _.sum(_.values(maxSkillLevels))

    return this.lacuna.buildings.intelligence.viewAllSpies([intelMin.id]).then((result) => {
      return _.chain(result.spies)
        .filter((spy) => {
          if (!util.int(spy.is_available)) {
            return false
          } else if (spy.assignment === 'Political Propaganda') {
            return false
          } else if (spy.assignment === 'Training') {
            return false
          } else if (spy.assignment === MISSION_NAMES[this.options.skill]) {
            return false
          } else if (
            // If the spy's already maxed.
            _.sum([spy.intel, spy.mayhem, spy.politics, spy.theft]) === maxSkillLevelTotal
          ) {
            return false
          } else if (util.int(spy.assigned_to.body_id) !== util.int(colony.id)) {
            return false
          } else {
            return true
          }
        })
        .sortBy((spy) => util.int(spy.id))
        .value()
    })
  }

  getMaxSkillLevels (colony, skillBuildings) {
    let maxSkillLevels = {}

    _.each(SKILLS, (skill) => {
      let building = skillBuildings[skill]

      if (building) {
        // NOTE: this formula is from the server code, see: https://goo.gl/HvcZnp
        maxSkillLevels[skill] = 350 + util.int(building.level) * 75
      } else {
        log.warn(`No ${MISSION_NAMES[skill]} found on ${colony.name}`)
        maxSkillLevels[skill] = 0
      }
    })

    return maxSkillLevels
  }

  findSpyBuildings (buildings) {
    return new Promise((resolve, reject) => {
      let props = {
        intelMin: this.lacuna.body.findBuilding(buildings, 'Intelligence Ministry'),
        intel: this.lacuna.body.findBuilding(buildings, 'Intel Training'),
        mayhem: this.lacuna.body.findBuilding(buildings, 'Mayhem Training'),
        politics: this.lacuna.body.findBuilding(buildings, 'Politics Training'),
        theft: this.lacuna.body.findBuilding(buildings, 'Theft Training')
      }

      Promise.props(props).then((result) => {
        let intelMin = result.intelMin
        let skillBuildings = _.pick(result, SKILLS)

        if (!intelMin) {
          reject(`No Intelligence Ministry found`)
          return
        }

        if (this.options.skill === 'all') {
          // We need all the buildings to train all the skillz, you see.
          let shouldReturn = false

          _.each(SKILLS, (skill) => {
            if (!skillBuildings[skill]) {
              log.error(`No ${MISSION_NAMES[skill]} found`)
              shouldReturn = true
            }
          })

          if (shouldReturn) {
            return
          }
        }

        if (!skillBuildings[this.options.skill] && this.options.skill !== 'all') {
          reject(`No ${MISSION_NAMES[this.options.skill]} found`)
          return
        }

        resolve([intelMin, skillBuildings])
      })
    })
  }

  handleColony (colony) {
    log.newline()
    log.info(`Looking at ${colony.name}`)

    return this.lacuna.body.buildings(colony.id).then((buildings) => {
      return this.findSpyBuildings(buildings).spread((intelMin, skillBuildings) => {
        let maxSkillLevels = this.getMaxSkillLevels(colony, skillBuildings)

        return this.getSpies(intelMin, maxSkillLevels, colony).then((spies) => {
          if (this.options.skill === 'all') {
            return this.trainSpies(intelMin, this.distributeSkills(spies, maxSkillLevels))
          } else {
            return this.trainSpies(intelMin, this.setSkill(spies, this.options.skill))
          }
        })
      }).catch((err) => {
        util.handlePromiseError(err)
        log.info('Moving on')
      })
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.planet) {
        reject('please specify a planet')
      } else if (!this.options.skill) {
        reject(`please specify a skill`)
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
        let plural = this.trained > 1 ? 'spies' : 'spy'
        let message = this.trained > 0
          ? `Successfully trained ${this.trained} ${plural}`
          : `Didn't train any spies`

        resolve(message)
      }).catch(reject)
    })
  }
}

module.exports = SpyTrainer
