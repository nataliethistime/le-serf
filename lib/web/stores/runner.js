'use strict'

// This store is for managing the running of tasks and storing their output.

let Reflux = require('reflux')

let tasks = require('../../tasks').getTasksForPlatform('web')
let log = require('../../log')

let RunnerActions = require('../actions/runner')
let WindowActions = require('../actions/window')

let RunnerStore = Reflux.createStore({
  listenables: [
    RunnerActions
  ],

  init () {
    this.data = this.getInitialState()
    this.taskIsRunning = false
  },

  getInitialState () {
    if (this.data) {
      return this.data
    } else {
      return []
    }
  },

  isRunningTask () {
    return this.taskIsRunning
  },

  onRunTask (name, options) {
    RunnerActions.clearLog()
    WindowActions.navigate('/output')

    log.subscribe(RunnerActions.logMessage)
    this.taskIsRunning = true

    let handleEnd = () => {
      log.unsubscribeAll()
      this.taskIsRunning = false
    }

    tasks[name].run(options).then(() => {
      handleEnd()
    }).catch(() => {
      handleEnd()
    })
  },

  onLogMessage (level, content) {
    this.data.push({level, content})
    this.trigger(this.data)
  },

  onClearLog () {
    this.data.length = 0
    this.trigger(this.data)
  }
})

module.exports = RunnerStore
