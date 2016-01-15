'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let lacuna = require('../lacuna')
let log = require('../log')
let util = require('../util')

const MISSION_NAMES = {
  intel: 'Intel Training',
  mayhem: 'Mayhem Training',
  politics: 'Politics Training',
  theft: 'Theft Training'
}

const SKILLS = ['intel', 'mayhem', 'politics', 'theft']

// Max number of spies to have training per training building.
const TRAIN_MAX = 3

class SpyTrainer {

  constructor (options) {
    this.options = options

    this.trained = 0
  }

  trainSpy (intelMin, spy, skill) {
    let newAssignment = MISSION_NAMES[skill]

    log.info(`Setting ${spy.name} to ${newAssignment.toLowerCase()}`)

    if (!this.options.dryRun) {
      return lacuna.buildings.intelligence.assignSpy([
        intelMin.id,
        spy.id,
        newAssignment
      ]).then((result) => {
        this.trained++
      })
    }
  }
  
  trainSpies (intelMin, toTrain) {
    log.newline()

    return Promise.each(SKILLS, (skill) => {
      let spies = util.array(toTrain[skill])

      return Promise.each(spies, (spy) => {
        return this.trainSpy(intelMin, spy, skill)
      })
    })
  }

  numTraining (spies, skill) {
    return _.filter(spies, {assignment: MISSION_NAMES[skill]}).length
  }

  distributeSkills (spies, maxSkillLevels) {
    let toTrain = {}

    _.each(SKILLS, (skill) => {
      let mission = MISSION_NAMES[skill].toLowerCase()
      let numTraining = this.numTraining(spies, skill)

      if (numTraining < TRAIN_MAX) {
        toTrain[skill] = _.chain(spies)
          .filter((spy) => spy.assignment === 'Idle') // grab the idle guys
          .sortBy(skill)                              // sort by skill
          .take(TRAIN_MAX - numTraining)              // only get the number we should train
          .value()

        let num = toTrain[skill].length
        let plural = util.handlePlurality(num, 'spy')
        log.info(`Setting ${num} ${plural} to ${mission}`)
      } else {
        log.info(`Not setting any spies to ${mission}`)
      }
    })

    return toTrain
  }

  isAvailable (spy) {
    return (
      util.int(spy.is_available) &&
      spy.assignment !== 'Political Propaganda' &&
      spy.assignment !== 'Training'
    )
  }

  isMaxed (spy, maxSkillLevels) {
    let maxSkillLevelTotal = _.sum(_.values(maxSkillLevels))
    let currentSkillLevelTotal = _.sum(_.values(_.pluck(spy, SKILLS)))

    return currentSkillLevelTotal === maxSkillLevelTotal
  }

  isAt (spy, colony) {
    return util.int(spy.assigned_to.body_id) === util.int(colony.id)
  }

  getSpies (intelMin, maxSkillLevels, colony) {
    return lacuna.buildings.intelligence.viewAllSpies([intelMin.id]).then((result) => {
      return _.chain(result.spies)
        .filter((spy) => {
          if (
            this.isAvailable(spy) &&
            !this.isMaxed(spy, maxSkillLevels) &&
            this.isAt(spy, colony)
          ) {
            return true
          } else {
            return false
          }
        })
        .sortBy((spy) => util.int(spy.id))
        .value()
    })
  }

  getMaxSkillLevels (skillBuildings) {
    let calc = (b) => {
      // NOTE: this formula is from the server code, see: https://goo.gl/HvcZnp
      return b && b.level ? 350 + util.int(b.level) * 75 : 0
    }

    return {
      intel: calc(skillBuildings.intel),
      mayhem: calc(skillBuildings.mayhem),
      politics: calc(skillBuildings.politics),
      theft: calc(skillBuildings.theft)
    }
  }

  findSpyBuildings (colony) {
    return new Promise((resolve, reject) => {
      lacuna.body.buildings(colony.id).then((buildings) => {
        let props = {
          intelMin: lacuna.body.findBuilding(buildings, 'Intelligence Ministry'),
          intel: lacuna.body.findBuilding(buildings, 'Intel Training'),
          mayhem: lacuna.body.findBuilding(buildings, 'Mayhem Training'),
          politics: lacuna.body.findBuilding(buildings, 'Politics Training'),
          theft: lacuna.body.findBuilding(buildings, 'Theft Training')
        }

        Promise.props(props).then((result) => {
          let intelMin = result.intelMin
          let skillBuildings = _.pick(result, SKILLS)

          if (!intelMin) {
            reject(`No Intelligence Ministry found on ${colony.name}`)
            return
          }

          // Warn about missing skill buildings.
          _.each(SKILLS, (skill) => {
            if (!skillBuildings[skill]) {
              log.warn(`No ${MISSION_NAMES[skill]} found on ${colony.name}`)
            }
          })

          resolve([intelMin, skillBuildings])
        })
      }).catch(reject)
    })
  }

  handleColony (colony) {
    log.newline()
    log.info(`Looking at ${colony.name}`)

    return this.findSpyBuildings(colony).spread((intelMin, skillBuildings) => {
      let maxSkillLevels = this.getMaxSkillLevels(skillBuildings)

      return this.getSpies(intelMin, maxSkillLevels, colony).then((spies) => {
        let toTrain = this.distributeSkills(spies, maxSkillLevels)
        return this.trainSpies(intelMin, toTrain)
      })
    }).catch((err) => {
      util.handlePromiseError(err)
      log.info('Moving on')
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
        if (!this.options.dryRun) {
          return lacuna.captcha.prompt().then(() => colonies)
        } else {
          return colonies
        }
      }).then((colonies) => {
        return Promise.each(colonies, (colony) => {
          return this.handleColony(colony)
        })
      }).then(() => {
        let plural = util.handlePlurality(this.trained, 'spy')
        let message = this.trained > 0
          ? `Successfully trained ${this.trained} ${plural}`
          : `Didn't train any spies`

        resolve(message)
      }).catch(reject)
    })
  }
}

module.exports = SpyTrainer
