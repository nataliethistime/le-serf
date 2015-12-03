'use strict'

let program = require('commander')
let _ = require('lodash')

let runner = require('../lib/cli/task-runner')

program
  .option('-f, --from [planet name]', 'where you want to take glyphs from')
  .option('-t, --to [planet name]', 'where you want the glyphs to end up')
  .option('-a --all-colonies', 'take glyphs from all colonies')
  .parse(process.argv)

if (program.allColonies) {
  program.from = '__all_colonies__'
}

runner.run('push-glyphs', _.pick(program, ['from', 'to']))
