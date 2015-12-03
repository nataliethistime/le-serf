'use strict'

let program = require('commander')
let _ = require('lodash')

let runner = require('../lib/cli/task-runner')

program
  .option('-f, --from [planet name]', 'where you want to push glyphs from')
  .option('-t, --to [planet name]', 'where you want the glyphs to end up')
  .parse(process.argv)

let options = _.pick(program, 'from to'.split(' '))
runner.run('push-glyphs', options)
