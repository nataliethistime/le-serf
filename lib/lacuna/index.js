'use strict'

let _ = require('lodash')

let cache = require('./cache')
let log = require('../log')
let util = require('../util')

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
    this.setupCache(userConfig)
    this.setupModules()
  }

  handleConfig (userConfig) {
    let config = _.merge({}, configDefaults, userConfig)

    if (!config.empire || !config.password) {
      log.warn('Empire name and password not specified')
    }

    return config
  }

  setupCache (userConfig) {
    if (_.isString(userConfig)) {
      this.setupSession(userConfig)
    } else {
      _.each(this.handleConfig(userConfig), (value, key) => {
        cache.put(key, value)
      })

      this.setupSession('')
    }
  }

  setupSession (id) {
    cache.put('session', id)
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
    let empire = cache.get('empire')
    let password = cache.get('password')
    let session = cache.get('session')
    let apiKey = cache.get('apiKey')

    if (session) {
      return new Promise((resolve, reject) => resolve(session))
    } else {
      log.info(`Logging into empire ${empire}`)

      return this.empire.login([
        empire,
        password,
        apiKey
      ]).then((result) => {
        let session = result.session_id
        cache.put('session', session)
        return session
      }).catch((err) => {
        util.handlePromiseError(err)
      })
    }
  }
}

module.exports = Lacuna
