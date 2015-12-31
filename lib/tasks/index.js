'use strict'

let _ = require('lodash')

let util = require('../util')
let log = require('../log')

/*
  Hello and welcome to Le Serf!

  This is the part of the code where every task that can be run is asembled
  into a big list that is then used by the Web and CLI packages. This
  list us simply an arrray of objects where each object reperesents a task.

  Each task must contain the following:
    - name: name of the task - used by the CLI
    - title: display name of the task - this is what web users see
    - description: describe in one sentence what your task does
    - platforms: array of platforms this task runs on - example: ['web']
      will make this task only visible on the Website
    - TaskClass: this is where your task's implementation goes it is a class
      that takes an initialized Lacuna object and an options object.
      This class must implement a `run` method which returns a promise.

      For example:

      ```javascript
        class MyFancyTask {
          constructor (lacuna, options) {
            this.lacuna = lacuna
            this.options = options
          }

          run () {
            return new Promise((resolve, reject) => {
              log.info('I am running now.')
              log.info('Access the game with `this.lacuna`')
              log.info('Access the options with `this.options`')
              resolve(`I'm done now! Yay!`)
            })
          }
        }
      ```

  Each task can optionally include the following:
    - defaults: object of default `options`
*/

const taskDefinitions = [

  {
    name: 'build-ships',
    title: 'Build Ships',
    description: 'Builds ships.',
    platforms: ['cli'],
    TaskClass: require('./build-ships'),
    defaults: {
      planet: '',
      type: '',
      quantity: 0,
      level: 1,
      topoff: false
    }
  },

  {
    name: 'building-levels',
    title: 'Building Levels',
    description: 'View a list of the number of buildings at each level.',
    platforms: ['cli', 'web'],
    TaskClass: require('./building-levels'),
    defaults: {}
  },

  {
    name: 'building-types',
    title: 'Building Types',
    description: 'View a list of the number of each type of building you have.',
    platforms: ['cli', 'web'],
    TaskClass: require('./building-types'),
    defaults: {}
  },

  {
    name: 'halls-cost',
    title: 'Halls Cost',
    description: 'Calculate the cost of upgrading glyph buildings.',
    platforms: ['cli', 'web'],
    TaskClass: require('./halls-cost'),
    defaults: {
      start: 1,
      end: 30
    }
  },

  {
    name: 'make-halls',
    title: 'Make Halls',
    description: 'Make Halls of Vrbansk on a given planet.',
    platforms: ['cli', 'web'],
    TaskClass: require('./make-halls'),
    defaults: {
      planet: ''
    }
  },

  {
    name: 'make-spies',
    title: 'Make Spies',
    description: 'Fill all Intelligence Ministries with Spies.',
    platforms: ['cli', 'web'],
    TaskClass: require('./make-spies'),
    defaults: {}
  },

  {
    name: 'push-buildings-up',
    title: 'Push Buildings Up',
    description: 'Upgrade all non-glyph buildings, lowest to highest.',
    platforms: ['cli', 'web'],
    TaskClass: require('./push-buildings-up'),
    defaults: {
      loop: false
    }
  },

  {
    name: 'push-glyphs',
    title: 'Push Glyphs',
    description: 'Push Glyphs between your planets.',
    platforms: ['cli', 'web'],
    TaskClass: require('./push-glyphs'),
    defaults: {
      from: '',
      to: ''
    }
  },

  {
    name: 'spy-trainer',
    title: 'Spy Trainer',
    description: 'Train your spies',
    platforms: ['cli', 'web'],
    TaskClass: require('./spy-trainer'),
    defaults: {
      planet: '',
      skill: '',
      dryRun: false
    }
  },

  {
    name: 'upgrade-buildings',
    title: 'Upgrade Buildings',
    description: `Warning: this is only setup for 1vasari - use at own risk.`,
    platforms: ['cli'],
    TaskClass: require('./upgrade-buildings'),
    defaults: {
      loop: false,
      skip: [],
      planet: []
    }
  },

  {
    name: 'view-laws',
    title: 'View Laws',
    description: `View the laws that have been enacted on a Space Station.`,
    platforms: ['cli', 'web'],
    TaskClass: require('./view-laws'),
    defaults: {
      id: ''
    }
  }
]

// NOTE: this is actually defined with `function () {}` because it gets
// bound with a `this` value that needs to be retained and `() => {}`
// doesn't do that.
let handleTaskRun = (taskDefinition, lacuna, options) => {
  if (!_.isUndefined(taskDefinition.defaults) && _.isObject(taskDefinition.defaults)) {
    // Handle defaults
    options = _.merge({}, taskDefinition.defaults, options)
  }

  let TaskClass = taskDefinition.TaskClass
  let task = new TaskClass(lacuna, options)

  return task.validateOptions().then(() => {
    log.info(`Running "${taskDefinition.title}" task`)
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
        util.handlePromiseError(err)
      }
    })
  }).catch((err) => {
    util.handlePromiseError(err)
  })
}

// Setup each tasks's `run` method.
const tasks = _.map(taskDefinitions, (task) => {
  task.run = _.partial(handleTaskRun, task)
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
