'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

program
  .option('-p --planet <name>', 'planet(s) to build ships on')
  .option('-t --type <type>', 'type of ship to build')
  .option('-q --quantity <quantity>', 'number of ships to build')
  .option('-l --level [level]', 'minimum level of shipyard for build to occur')
  .option('--topoff', 'top off the ships up to the specified quantity')
  .parse(process.argv)

let options = _.pick(program, 'planet type quantity level'.split(' '))
runner.run('build-ships', options)
