'use strict'

let express = require('express')
let path = require('path')

let gutil = require('gulp-util')

const indexLocation = path.join(__dirname, '../index.html')

module.exports = (params, done) => {
  let app = express()
  let port = process.env.PORT || 5000

  app.use(express.static(path.join(__dirname, '..')))

  // Handle routes that should just be passed to the client.
  app.get('*', (req, res) => {
    res.sendFile(indexLocation)
  })

  app.listen(port, () => {
    gutil.log(`Listening on http://localhost:${port}`)

    if (typeof done === 'function') {
      done()
    }
  })
}
