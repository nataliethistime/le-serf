'use strict'

let program = require('commander')
let _ = require('lodash')

let runner = require('../lib/cli/task-runner')

program
  .option('-s, --start [level]', 'level the building is currently at')
  .option('-e, --end [level]', 'level you want to upgrade the building to')
  .parse(process.argv)

runner.run('halls-cost', _.pick(program, ['start', 'end']))
