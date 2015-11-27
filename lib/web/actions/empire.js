'use strict'

let Reflux = require('reflux')

let EmpireActions = Reflux.createActions([
  'login',
  'logout',
  'clear'
])

module.exports = EmpireActions
