'use strict'

let React = require('react')
let ReactDOM = require('react-dom')
let $ = window.jQuery

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

$(document).ready(() => {
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

  ReactDOM.render(app, container)
})
