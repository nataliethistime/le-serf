'use strict'

let path = require('path')

let runCommand = require('./run-command')
let isThere = require('is-there')

let buildCommand = (arr) => arr.join(' && ')

// Don't run gulp if there isn't a Gulpfile.
if (!isThere(path.join(__dirname, '../Gulpfile.js'))) {
  process.exit()
}

if (process.env.LE_SERF_PRODUCTION) {
  runCommand(buildCommand([
    'bower prune',
    'bower install',
    'gulp clear',
    'gulp build'
  ]))
} else if (process.env.TRAVIS && process.env.CI) {
  // Don't build anything on Travis.
  process.exit()
} else {
  runCommand(buildCommand([
    'bower prune',
    'bower install',
    'gulp clear'
  ]))
}
