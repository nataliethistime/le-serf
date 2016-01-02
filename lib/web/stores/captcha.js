'use strict'

let Reflux = require('reflux')

let log = require('../../log')

let lacuna = require('../../lacuna')

let CaptchaActions = require('../actions/captcha')

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

  onLoad () {
    lacuna.captcha.fetch().then((result) => {
      this.data = result
      this.trigger(this.data)
    })
  },

  onSolve (guid, answer) {
    lacuna.captcha.solve([guid, answer]).then((result) => {
      if (result) {
        this.data.solved = true
        this.trigger(this.data)
      }
    }).catch((err) => {
      log.error(err)
      CaptchaActions.refresh()
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
