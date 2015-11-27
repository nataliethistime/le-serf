'use strict'

let config = require('./config')

let tasks = require('../tasks').getTasksForPlatform('cli')
let Lacuna = require('../lacuna')

let run = (name, options) => {
  let lacuna = new Lacuna(config.load())
  let task = tasks[name]

  task.run(lacuna, options)
}

module.exports = {
  run
}
