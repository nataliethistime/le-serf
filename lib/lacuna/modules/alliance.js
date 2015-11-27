'use strict'

let Module = require('../module')

class Alliance extends Module {
  constructor () {
    super()

    this.apiMethods('alliance', [
      'find',
      'view_profile'
    ])
  }
}

module.exports = Alliance
