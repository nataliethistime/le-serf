'use strict'

let Reflux = require('reflux')

let RunnerActions = Reflux.createActions([
  'runTask',
  'clearLog',
  'logMessage',
  'setSelectedTask'
])

module.exports = RunnerActions
