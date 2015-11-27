'use strict'

let gulp = require('gulp')
let gutil = require('gulp-util')
let uglify = require('gulp-uglify')

let path = require('path')
let mkdirp = require('mkdirp')

let browserify = require('browserify')
let watchify = require('watchify')
let babelify = require('babelify')

let source = require('vinyl-source-stream')
let buffer = require('vinyl-buffer')

const outputLocation = path.join(__dirname, '../build')
mkdirp.sync(path.dirname(outputLocation))

let handleBundle = (b) => {
  return b
    .bundle()
    .on('error', function (err) {
      gutil.log(
        gutil.colors.red('Browserify compile error:'),
        err.message
      )
      this.emit('end')
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(process.env.LE_SERF_PRODUCTION
      ? uglify().on('error', gutil.log)
      : gutil.noop())
    .pipe(gulp.dest(outputLocation))
}

let getBrowserifyOptions = (options) => {
  if (options.watch) {
    return {
      cache: {},
      packageCache: {},
      plugin: [watchify],
      extensions: ['.jsx']
    }
  } else {
    return {
      extensions: ['.jsx']
    }
  }
}

let browserifyBuild = (options) => {
  let b = browserify(['lib/web/index.jsx'], getBrowserifyOptions(options))

  b.transform(babelify.configure({
    presets: ['es2015', 'react']
  }))

  if (options.watch) {
    b.on('update', () => {
      gutil.log('Something changed - rebuilding.')
      handleBundle(b)
    })

    b.on('log', (msg) => {
      gutil.log(msg)
    })
  }

  gutil.log('Bundling application.')
  return handleBundle(b)
}

module.exports = browserifyBuild
