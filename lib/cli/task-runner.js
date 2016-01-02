'use strict'

let config = require('./config')

let tasks = require('../tasks').getTasksForPlatform('cli')
let lacuna = require('../lacuna')

let run = (name, options) => {
  lacuna.init(config.load())

  lacuna.authenticate().then(() => {
    // TODO: should we save this session for later?
    tasks[name].run(options)
  })
}

module.exports = {
  run
}
