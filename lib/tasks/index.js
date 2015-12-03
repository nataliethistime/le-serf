'use strict'

let _ = require('lodash')

let log = require('../log')

let tasksToBeSetup = require('./tasks')

// NOTE: this is actually defined with `function () {}` because it gets
// bound with a `this` value that needs to be retained and `() => {}`
// doesn't do that.
let handleTaskRun = function (lacuna, options) {
  if (!_.isUndefined(this.defaults) && _.isObject(this.defaults)) {
    // Handle defaults
    options = _.merge({}, this.defaults, options)
  }

  let task = new this.TaskClass(lacuna, options)

  log.info(`Running "${this.title}" task`)
  log.debug('Running with options:', options)
  log.newline()

  return task.run().then((message) => {
    if (message) {
      log.newline()
      log.info(message)
      log.info('Done')
    }
  }).catch((err) => {
    if (err) {
      log.newline()
      if (_.isString(err)) {
        log.error(err)
      } else {
        throw new Error(err)
      }
    }
  })
}

// Setup each tasks's `run` method.
const tasks = _.map(tasksToBeSetup, (task) => {
  task.run = _.bind(handleTaskRun, task)
  return task
})

let tasksArrayToObject = (array) => {
  return _.object(_.pluck(array, 'name'), array)
}

let getTasksForPlatform = (platform) => {
  let filtered = _.filter(tasks, (task) => {
    return _.include(task.platforms, platform)
  })

  return tasksArrayToObject(filtered)
}

let getAllTasks = () => {
  return tasksArrayToObject(tasks)
}

module.exports = {
  getAllTasks,
  getTasksForPlatform
}
