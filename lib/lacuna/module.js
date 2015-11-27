'use strict'

let _ = require('lodash')
let camelize = require('camelize')

let emissary = require('./emissary')

class Module {
  apiMethods (moduleId, methods) {
    methods.forEach((method) => {
      this[camelize(method)] = _.partial(emissary.serverCall, moduleId, method)
    })
  }
}

module.exports = Module
