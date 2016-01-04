'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

program
  .option('-p --planet [name]', 'planet(s) to train spies on')
  .option('-d --dry-run', 'show what would happen without actually changing anything')
  .parse(process.argv)

let options = _.pick(program, ['planet', 'dryRun'])
runner.run('push-buildings-up', options)
