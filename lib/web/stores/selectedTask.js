'use strict'

let Reflux = require('reflux')

let RunnerActions = require('../actions/runner')
let WindowActions = require('../actions/window')

let SelectedTaskStore = Reflux.createStore({

  listenables: [
    RunnerActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    return this.data || ''
  },

  onSetSelectedTask (newTask) {
    this.data = newTask
    this.trigger(this.data)
    WindowActions.navigate('/task-configuration')
  }
})

module.exports = SelectedTaskStore
