'use strict'

let _ = require('lodash')
let colors = require('colors')

class Log {
  constructor () {
    if (typeof process === 'undefined') {
      this.logLevel = 'info'
    } else {
      this.logLevel = process.env.LOG_LEVEL || 'info'
    }

    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
      silly: 5
    }

    this.levelColors = {
      error: colors.red,
      warn: colors.yellow,
      info: colors.green,
      verbose: colors.cyan,
      debug: colors.blue,
      silly: colors.magenta
    }

    _.each(this.logLevels, (num, name) => {
      this[name] = _.partial(this.log, name)
    })

    this.subscribers = []
    this.isSilent = false
  }

  silent () {
    this.isSilent = true
  }

  handleConsoleOutput (level, message) {
    let coloredLevel = this.colorLevel(level)

    if (message === '---') {
      message = ''
    } else {
      message = `${coloredLevel}: ${message}`
    }

    message = message.replace(/\n/g, `\n${coloredLevel}: `)

    if (!this.isSilent) {
      console.log(message)
    }

    return message
  }

  prepareOutput (messages) {
    messages = _.flatten([messages])

    let output = _.map(messages, (message, i) => {
      if (!_.isString(message)) {
        if (i + 1 === messages.length) {
          // Put the last one on a new line and prettify it.
          // See: http://stackoverflow.com/a/7220510
          message = '\n' + JSON.stringify(message, null, 2)
        } else {
          message = JSON.stringify(message)
        }
      }

      return message
    })

    return output.join(' ')
  }

  log (level, message) {
    if (this.shouldLog(level)) {
      // Handle the input being a splat.
      let args = Array.prototype.slice.call(arguments)
      let output = this.prepareOutput(args.slice(1))

      this.broadcast(level, output)
      return this.handleConsoleOutput(level, output)
    } else {
      return false
    }
  }

  newline () {
    return this.log('info', '---')
  }

  shouldLog (level) {
    if (this.isLogLevel(level)) {
      let currentLevelNum = this.logLevels[this.logLevel]
      let levelNum = this.logLevels[level]

      return currentLevelNum >= levelNum
    } else {
      return false
    }
  }

  setLogLevel (level) {
    if (this.isLogLevel(level)) {
      this.logLevel = level
    }
  }

  isLogLevel (level) {
    return this.logLevels[level] !== undefined
  }

  colorLevel (level) {
    if (this.isLogLevel(level)) {
      return this.levelColors[level](level)
    } else {
      return level
    }
  }

  subscribe (fn) {
    if (typeof fn === 'function') {
      this.subscribers.push(fn)
    }
  }

  unsubscribeAll () {
    this.subscribers.length = 0
  }

  broadcast (level, message) {
    _.each(this.subscribers, (fn) => {
      fn(level, message)
    })
  }
}

module.exports = new Log()
