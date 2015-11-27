'use strict'

let log = require('../lib/log')

let config = require('../lib/cli/config')

config.setup(() => {
  log.info('Successfully set up the config file')
})
