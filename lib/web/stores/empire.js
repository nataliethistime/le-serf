'use strict'

// This store is for storing the currently logged-in empire.
// If you want to display information about the currently logged-in empire,
// this is the store to listen in on!

let Reflux = require('reflux')

let lacuna = require('../../lacuna')

let ConfigActions = require('../actions/config')
let EmpireActions = require('../actions/empire')
let RunnerActions = require('../actions/runner')
let SessionActions = require('../actions/session')
let WindowActions = require('../actions/window')

let EmpireStore = Reflux.createStore({
  listenables: [
    EmpireActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    if (this.data) {
      return this.data
    } else {
      return {
        colonies: {},
        essentia: 0,
        exactEssentia: 0,
        has_new_messages: 0,
        home_planet_id: '',
        id: '',
        insurrect_value: 0,
        is_isolationist: 0,
        latest_message_id: 0,
        name: '',
        next_colony_cost: 0,
        next_colony_srcs: 0,
        next_station_cost: 0,
        planets: {},
        primary_embassy_id: 0,
        rpc_count: 0,
        self_destruct_active: 0,
        self_destruct_date: '',
        stations: {},
        status_message: '',
        tech_level: 0
      }
    }
  },

  getData () {
    return this.data
  },

  onLogin () {
    lacuna.authenticate().then(() => {
      ConfigActions.set(lacuna.getConfig())
      return lacuna.empire.getStatus()
    }).then((result) => {
      this.data = result.empire
      this.trigger(this.data)

      // Whether logging in from a stored config, session ID or some new credentials, all pathways
      // lead back to here. So, we store the session now.
      SessionActions.set(lacuna.getSession())

      WindowActions.navigate('/tasks')
    })
  },

  onLogout () {
    ConfigActions.clear()
    EmpireActions.clear()
    SessionActions.clear()
    RunnerActions.clearLog()
    WindowActions.navigate('/login')
  },

  onClear () {
    this.data = undefined
    this.data = this.getInitialState()
    this.trigger(this.data)
  }
})

module.exports = EmpireStore
