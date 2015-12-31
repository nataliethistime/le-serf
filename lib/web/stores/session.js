'use strict'

let Reflux = require('reflux')

let SessionActions = require('../actions/session')

let SessionStore = Reflux.createStore({
  listenables: [
    SessionActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    return ''
  },

  getData () {
    return this.data
  },

  onSet (session) {
    this.data = session
    this.trigger(this.data)
  },

  onClear () {
    this.data = this.getInitialState()
    this.trigger(this.data)
  }
})

module.exports = SessionStore
