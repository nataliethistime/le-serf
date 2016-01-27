'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

program
  .option('-p --planet <name>', 'planet(s) to look at')
  .parse(process.argv)

let options = _.pick(program, ['planet'])
runner.run('spy-skills', options)
