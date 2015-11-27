#!/usr/bin/env node

'use strict'

let program = require('commander')
let _ = require('lodash')

let tasks = require('../lib/tasks').getTasksForPlatform('cli')

let pkgj = require('../package.json')

program
  .version(pkgj.version)
  .command('reset', 'clear config file and start again')
  .command('setup', 'set up a config file')

_.each(tasks, (task) => {
  // Make descriptions consistent.
  let description = task.description
    .replace(/\.$/, '')
    .toLowerCase()

  program.command(task.name, description)
})

program.parse(process.argv)
