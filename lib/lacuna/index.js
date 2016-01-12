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

const defaults = {
  apiKey: 'anonymous',
  empire: '',
  password: '',
  server: 'us1'
}

/**
 * This object is for interacting with the Lacuna game server.
 *
 * @namespace lacuna
 */
let lacuna = {
  init (config, session) {
    if (config) {
      // Handle defaults and stuff
      let obj = _.merge({}, defaults, config)
      cache.put('config', obj)
    } else {
      log.error('No config passed to lacuna.init()')
    }

    if (session) {
      cache.put('session', session)
    }

    return lacuna
  },

  // Base Modules
  alliance: new Alliance(),
  body: new Body(),
  captcha: new Captcha(),
  empire: new Empire(),
  inbox: new Inbox(),
  map: new Map(),
  stats: new Stats(),

  buildings: {
    archaeology: new Archaeology(),
    generic: (url) => new Building(url.replace(/\//g, '')),
    intelligence: new Intelligence(),
    planetaryCommand: new PlanetaryCommand(),
    shipyard: new Shipyard(),
    spaceport: new SpacePort(),
    trade: new Trade()
  },

  modules: {
    parliament: new Parliament(),
    policeStation: new PoliceStation(),
    stationCommand: new StationCommand()
  },

  authenticate () {
    let config = cache.get('config')
    let session = cache.get('session')

    if (session) {
      return new Promise((resolve, reject) => resolve(session))
    } else {
      log.info(`Logging into empire ${config.empire}`)

      if (!config.empire || !config.password) {
        return new Promise((resolve, reject) => {
          reject('Empire name and password are required')
        })
      }

      return lacuna.empire.login([
        config.empire,
        config.password,
        config.apiKey
      ]).then((result) => {
        let session = result.session_id
        cache.put('session', session)
        return session
      })
    }
  },

  newSession () {
    cache.put('session', '')
    return lacuna.authenticate()
  },

  getConfig () {
    return cache.get('config')
  },

  getSession () {
    return cache.get('session')
  }
}

module.exports = lacuna
