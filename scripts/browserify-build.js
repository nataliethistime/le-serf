'use strict'

let gutil = require('gulp-util')
let uglify = require('gulp-uglify')

let path = require('path')
let fs = require('fs')
let mkdirp = require('mkdirp')

let browserify = require('browserify')
let watchify = require('watchify')
let babelify = require('babelify')

const outputLocation = path.join(__dirname, '../build/bundle.js')
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
    .pipe(process.env.LE_SERF_PRODUCTION ? uglify() : gutil.noop())
    .pipe(fs.createWriteStream(outputLocation))
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
