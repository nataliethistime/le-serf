'use strict'

let React = require('react')
let ReactDOM = require('react-dom')
let $ = window.jQuery

let ReactRouter = require('react-router')
let Router = ReactRouter.Router
let Route = ReactRouter.Route

let LoginScreen = require('./components/screens/login')
let TasksScreen = require('./components/screens/tasks')
let AboutScreen = require('./components/screens/about')

let App = require('./components/app')

let history = require('./history')

// Generic error handler while I'm figuring out how to do this proper.
require('./error-handler')

$(document).ready(() => {
  ReactDOM.render((
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='login' component={LoginScreen} />
        <Route path='tasks' component={TasksScreen} />
        <Route path='about' component={AboutScreen} />
      </Route>
    </Router>
  ), document.getElementById('main'))
})
