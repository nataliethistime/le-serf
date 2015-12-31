'use strict'

let Reflux = require('reflux')

let CaptchaActions = Reflux.createActions([
  'clear',
  'load',
  'refresh',
  'solve'
])

module.exports = CaptchaActions
