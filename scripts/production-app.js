'use strict'

let server = require('./server')
let gutil = require('gulp-util')

gutil.log('Running app in produciton mode.')
server({production: true})
