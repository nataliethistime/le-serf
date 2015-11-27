'use strict'

let Module = require('../module')

class Captcha extends Module {
  constructor () {
    super()

    this.apiMethods('captcha', [
      'fetch',
      'solve'
    ])
  }
}

module.exports = Captcha
