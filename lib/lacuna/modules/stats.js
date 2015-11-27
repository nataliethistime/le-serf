'use strict'

let Module = require('../module')

class Stats extends Module {
  constructor () {
    super()

    this.apiMethods('stats', [
      'alliance_rank',
      'colony_rank',
      'credits',
      'empire_rank',
      'find_alliance_rank',
      'find_empire_rank',
      'spy_rank',
      'weekly_medal_winners'
    ])
  }
}

module.exports = Stats
