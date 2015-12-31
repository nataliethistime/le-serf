'use strict'

let Reflux = require('reflux')

let SessionActions = Reflux.createActions([
  'set',
  'clear'
])

module.exports = SessionActions
