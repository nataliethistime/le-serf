'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

program
  .option('-p --planet [name]', 'planet(s) to assign spies on')
  .option('-a --assignment [assignment name]', `what you want your spies to do`)
  .option('-d --dry-run', 'show what would happen without doing actually doing anything')
  .parse(process.argv)

let options = _.pick(program, ['planet', 'assignment', 'dryRun'])
runner.run('assign-spies', options)
