'use strict'

// This store is for managing the running of tasks and storing their output.

let Reflux = require('reflux')

let tasks = require('../../tasks').getTasksForPlatform('web')
let log = require('../../log')

let RunnerActions = require('../actions/runner')

let RunnerStore = Reflux.createStore({
  listenables: [
    RunnerActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    if (this.data) {
      return this.data
    } else {
      return []
    }
  },

  onRunTask (name, options) {
    RunnerActions.clearLog()
    log.subscribe(RunnerActions.logMessage)

    tasks[name].run(options).then(() => {
      log.unsubscribeAll()
    })
  },

  onLogMessage (level, content) {
    // NOTE: this is bad React practice - but it's the simplest way. ;)
    window.scrollTo(0, document.body.scrollHeight)

    this.data.push({level, content})
    this.trigger(this.data)
  },

  onClearLog () {
    this.data.length = 0
    this.trigger(this.data)
  }
})

module.exports = RunnerStore
