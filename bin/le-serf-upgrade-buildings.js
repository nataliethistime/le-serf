'use strict'

let program = require('commander')
let _ = require('lodash')
let runner = require('../lib/cli/task-runner')

let list = (str) => str.split(',')

program
  .option('-l, --loop', 'upgrade buildings forever (hopefully)')
  .option('-p --planet [name]',
    'specify planet(s) to upgrade buildings on', list)
  .option('-s --skip [planet name]',
    'specify planet(s) to skip', list)
  .option('-a --all-colonies', 'just upgrade buildings on all colonies')
  .parse(process.argv)

let options = _.pick(program, 'loop planet skip allColonies'.split(' '))
runner.run('upgrade-buildings', options)
