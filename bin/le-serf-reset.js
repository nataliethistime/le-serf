'use strict'

let log = require('../lib/log')

let config = require('../lib/cli/config')

config.clear(() => {
  log.info('Successfully cleared the config file')
})
