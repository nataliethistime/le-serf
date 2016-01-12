'use strict'

let lacuna = require('../lacuna')

let EmpireActions = require('./actions/empire')
let WindowActions = require('./actions/window')

let ConfigStore = require('./stores/config')
let SessionStore = require('./stores/session')

let freshLogin = (config, session) => {
  if (!session) {
    if (!config.empire) {
      WindowActions.error('Please enter an empire')
      return
    } else if (!config.password) {
      WindowActions.error('Please enter a password')
      return
    } else if (!config.server) {
      WindowActions.error('Please select a server to play on')
      return
    }
  }
  
  lacuna.init(config, session)
  EmpireActions.login()
}

let handleInitialLogin = () => {
  let config = ConfigStore.getData()
  let session = SessionStore.getData()

  if (!config || !config.empire || !config.password) {
    WindowActions.navigate('/login')
    return
  }

  freshLogin(config, session)
}

module.exports = {
  freshLogin,
  handleInitialLogin
}
