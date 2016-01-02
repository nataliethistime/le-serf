'use strict'

let Reflux = require('reflux')
let store = require('store')

let SessionActions = require('../actions/session')

let SessionStore = Reflux.createStore({

  listenables: [
    SessionActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    if (this.data) {
      return this.data
    } else {
      let storedSession = store.get('session')
      return storedSession || ''
    }
  },

  getData () {
    return this.data
  },

  onSet (data) {
    this.data = data
    store.set('session', this.data)
    this.trigger(this.data)
  },

  onClear () {
    this.data = ''
    store.set('session', this.data)
    this.trigger(this.data)
  }
})

module.exports = SessionStore
