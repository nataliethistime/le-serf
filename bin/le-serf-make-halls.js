'use strict'

let program = require('commander')
let _ = require('lodash')

let runner = require('../lib/cli/task-runner')

program
  .option('-p, --planet [planet name]', 'the planet to make halls on')
  .parse(process.argv)

runner.run('make-halls', _.pick(program, ['planet']))
