'use strict'

let gulp = require('gulp')

let del = require('del')

let browserifyBuild = require('./scripts/browserify-build')
let runCommand = require('./scripts/run-command')
let server = require('./scripts/server')

gulp.task('build', () => {
  return browserifyBuild({watch: false})
})

gulp.task('clear', () => {
  return del([
    './build/**/*'
  ])
})

gulp.task('default', ['build'])

gulp.task('dev', ['serve'], () => {
  return browserifyBuild({watch: true})
})

gulp.task('serve', (done) => {
  server({production: false}, done)
})

gulp.task('docs', (done) => {
  runCommand('jsdoc --configure .jsdoc.json', done)
})
