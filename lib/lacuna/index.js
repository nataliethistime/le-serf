'use strict'

let _ = require('lodash')

let cache = require('./cache')
let log = require('../log')

let Alliance = require('./modules/alliance')
let Body = require('./modules/body')
let Captcha = require('./modules/captcha')
let Empire = require('./modules/empire')
let Inbox = require('./modules/inbox')
let Map = require('./modules/map')
let Stats = require('./modules/stats')

let Building = require('./building')

let Archaeology = require('./buildings/archaeology')
let Intelligence = require('./buildings/intelligence')
let PlanetaryCommand = require('./buildings/planetaryCommand')
let Shipyard = require('./buildings/shipyard')
let SpacePort = require('./buildings/spaceport')
let Trade = require('./buildings/trade')

let Parliament = require('./ssbuildings/parliament')
let PoliceStation = require('./ssbuildings/policeStation')
let StationCommand = require('./ssbuildings/stationCommand')

const configDefaults = {
  apiKey: 'anonymous',
  empire: '',
  password: '',
  server: 'us1'
}

class Lacuna {
  constructor (userConfig) {
    this.config = this.handleConfig(userConfig)
    this.setupCache()
    this.setupModules()
  }

  handleConfig (userConfig) {
    let config = _.merge({}, configDefaults, userConfig)

    if (!config.empire || !config.password) {
      log.warn('Empire name and password not specified')
    }

    return config
  }

  setupCache () {
    _.each(this.config, (value, key) => {
      cache.put(key, value)
    })

    cache.put('session', '')
  }

  setupModules () {
    // Base Modules
    this.alliance = new Alliance()
    this.body = new Body()
    this.captcha = new Captcha()
    this.empire = new Empire()
    this.inbox = new Inbox()
    this.map = new Map()
    this.stats = new Stats()

    this.buildings = {
      archaeology: new Archaeology(),
      generic: (url) => {
        return new Building(url.replace(/\//g, ''))
      },
      intelligence: new Intelligence(),
      planetaryCommand: new PlanetaryCommand(),
      shipyard: new Shipyard(),
      spaceport: new SpacePort(),
      trade: new Trade()
    }

    this.modules = {
      parliament: new Parliament(),
      policeStation: new PoliceStation(),
      stationCommand: new StationCommand()
    }
  }

  authenticate () {
    var empire = this.config.empire
    var password = this.config.password

    log.info(`Logging into empire ${empire}`)

    return this.empire.login([
      empire,
      password,
      this.config.apiKey
    ]).then((result) => {
      let sessionId = result.session_id
      cache.put('session', sessionId)
      return sessionId
    })
  }
}

module.exports = Lacuna
