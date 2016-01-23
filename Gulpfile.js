'use strict'

let gulp = require('gulp')
let ghPages = require('gulp-gh-pages')

let del = require('del')

let browserifyBuild = require('./scripts/browserify-build')
let runCommand = require('./scripts/run-command')
let server = require('./scripts/server')

let moment = require('moment')

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

gulp.task('publish-docs', ['docs'], () => {
  return gulp.src('./docs/**/*')
    .pipe(ghPages({
      remoteUrl: 'https://github.com/1vasari/le-serf-docs',
      branch: 'gh-pages',
      message: 'Update documentation ' + moment().format('dddd, Do MMMM HH:mm:ss')
    }))
})
