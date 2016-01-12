'use strict'

let Reflux = require('reflux')

let WindowActions = Reflux.createActions([
  'navigate',
  'error'
])

module.exports = WindowActions
