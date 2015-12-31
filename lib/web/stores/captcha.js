'use strict'

let Reflux = require('reflux')
let Promise = require('bluebird')

let Lacuna = require('../../../lib/lacuna')

let CaptchaActions = require('../actions/captcha')

let ConfigStore = require('./config')

let CaptchaStore = Reflux.createStore({
  listenables: [
    CaptchaActions
  ],

  init () {
    this.data = this.getInitialState()
  },

  getInitialState () {
    return {
      url: '',
      guid: '',
      solved: false
    }
  },

  setupLacuna () {
    return new Promise((resolve, reject) => {
      if (!this.lacuna) {
        this.lacuna = new Lacuna(ConfigStore.getData())

        this.lacuna.authenticate()
          .then(resolve)
          .catch(reject)
      } else {
        resolve()
      }
    })
  },

  onLoad () {
    this.setupLacuna().then(() => {
      return this.lacuna.captcha.fetch()
    }).then((result) => {
      this.data = result
      this.trigger(this.data)
    })
  },

  onSolve (guid, answer) {
    this.setupLacuna().then(() => {
      return this.lacuna.captcha.solve([guid, answer])
    }).then((result) => {
      if (result) {
        this.data.solved = true
        this.trigger(this.data)
      }
    }).catch((err) => {
      if (err) {
        CaptchaActions.refresh()
      }
    })
  },

  onRefresh () {
    CaptchaActions.clear()
    CaptchaActions.load()
  },

  onClear () {
    this.data = this.getInitialState()
    this.trigger(this.data)
  }
})

module.exports = CaptchaStore
