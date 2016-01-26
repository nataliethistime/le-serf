'use strict'

let React = require('react')
let ReactDOM = require('react-dom')

let ReactRouter = require('react-router')
let Router = ReactRouter.Router
let Route = ReactRouter.Route

let AboutScreen = require('./components/screens/about')
let LoginScreen = require('./components/screens/login')
let OutputScreen = require('./components/screens/output')
let TaskConfigurationScreen = require('./components/screens/task-configuration')
let TaskSelectionScreen = require('./components/screens/task-selection')

let App = require('./components/app')

let history = require('./history')

require('./error-handler')

// When a release happens the index.html file may have changed. In which case we need to
// reaload (without cache) on the client side so the user gets the changes.
let lastLoadedVersion = window.localStorage.lastLoadedVersion
let currentVersion = require('../../package.json').version

if (lastLoadedVersion !== currentVersion) {
  console.log('Reloading to get new version...')
  console.log(`Last loaded version: ${lastLoadedVersion}`)
  console.log(`Current version: ${currentVersion}`)

  window.localStorage.lastLoadedVersion = currentVersion
  window.location.reload(true)
}

// This function is called by the loader after it's finished doing its thing.
window.LeSerfLoad = () => {
  let container = document.getElementById('main')
  let app = (
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='about' component={AboutScreen} />
        <Route path='login' component={LoginScreen} />
        <Route path='output' component={OutputScreen} />
        <Route path='task-configuration' component={TaskConfigurationScreen} />
        <Route path='task-selection' component={TaskSelectionScreen} />
      </Route>
    </Router>
  )

  if (container) {
    ReactDOM.render(app, container)
  }
}
