'use strict'

let exec = require('child_process').exec

let runCommand = (command, callback) => {
  let stream = exec(command)
  stream.stdout.pipe(process.stdout)
  stream.stderr.pipe(process.stderr)

  stream.on('exit', (code) => {
    if (typeof callback === 'function') {
      callback(code)
    } else {
      process.exit(code)
    }
  })
}

module.exports = runCommand
