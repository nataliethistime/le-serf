'use strict'

let exec = require('child_process').exec
let gutil = require('gulp-util')

let runCommand = (command) => {
  let stream = exec(command)
  stream.stdout.pipe(process.stdout)
  stream.stderr.pipe(process.stderr)

  stream.on('exit', (code) => {
    gutil.log('')
    gutil.log(`Finished with code: ${code}`)
    gutil.log('')
    process.exit(code)
  })
}

module.exports = runCommand
