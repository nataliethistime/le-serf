'use strict'

let Lacuna = require('../lacuna')

let SessionStore = require('./stores/session')
let ConfigStore = require('./stores/config')

module.exports = (config) => {
  let currentSession = SessionStore.getData()
  let currentConfig = ConfigStore.getData()

  if (currentSession) {
    return new Lacuna(currentSession)
  } else if (currentConfig) {
    return new Lacuna(currentConfig)
  } else {
    return new Lacuna(config)
  }
}
