'use strict'

let Reflux = require('reflux')

let ConfigActions = Reflux.createActions([
  'set',
  'clear'
])

module.exports = ConfigActions
