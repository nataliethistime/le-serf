'use strict'

let _ = require('lodash')

let WindowActions = require('./actions/window')

let Messenger = () => {
  let M = window.Messenger
  
  return M({
    theme: 'block',
    extraClasses: 'messenger-fixed messenger-on-top',
    maxMessages: 1
  })
}

let log = require('../log')

const messageDefaults = {
  showCloseButton: true,
  hideAfter: 10
}

let handleDefaults = (options) => {
  return _.merge({}, messageDefaults, options)
}

WindowActions.error.listen((message) => {
  log.error(message)

  Messenger().post(handleDefaults({
    message,
    type: 'error'
  }))
})
