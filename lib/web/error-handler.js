'use strict'

let WindowActions = require('./actions/window')

let log = require('../log')

WindowActions.error.listen((message) => {
  log.error(message)
  window.alert(message)
})
