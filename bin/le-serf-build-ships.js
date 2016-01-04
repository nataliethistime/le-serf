'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

program
  .option('-p --planet <name>', 'planet(s) to build ships on')
  .option('-t --type <type>', 'type of ship to build')
  .option('-q --quantity <quantity>', 'number of ships to build')
  .option('--topoff', 'top off existing ships to the specified quantity')
  .option('--dry-run', 'show what would happen without actually changing anything')
  .parse(process.argv)

let options = _.pick(program, ['planet', 'type', 'quantity', 'level', 'topoff', 'dryRun'])
runner.run('build-ships', options)
