'use strict'

// See: https://github.com/rackt/react-router/blob/master/docs/guides/advanced/NavigatingOutsideOfComponents.md

let history = require('history/lib/createBrowserHistory')()

let WindowActions = require('./actions/window')

WindowActions.navigate.listen((url) => {
  history.replaceState(null, url)
})

module.exports = history
