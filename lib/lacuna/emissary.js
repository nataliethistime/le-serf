'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let request = {}

if (typeof window === 'undefined') {
  request = require('request')
} else {
  request = require('browser-request')
}

let cache = require('./cache')
let log = require('../log')
let util = require('../util')

let emissary = {

  getUrl (moduleId) {
    let protocol = 'http:'
    let server = cache.get('server')

    if (typeof window !== 'undefined') {
      protocol = window.location.protocol
    }

    return `${protocol}//${server}.lacunaexpanse.com/${moduleId}`
  },

  addSession (moduleId, method, params) {
    // Add session ID to the params.
    let sessionId = cache.get('session')
    if (`${moduleId}/${method}` !== 'empire/login') {
      if (_.isArray(params)) {
        params = [sessionId].concat(params)
      } else if (_.isObject(params)) {
        params.session_id = sessionId
      }
    }

    return _.isArray(params) ? params : [params]
  },

  getJsonRequest (method, params) {
    return {
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    }
  },

  getReqOptions (moduleId, method, params) {
    return {
      url: emissary.getUrl(moduleId),
      json: emissary.getJsonRequest(method, emissary.addSession(moduleId, method, params)),
      method: 'POST'
    }
  },

  serverCall (moduleId, method, params) {
    params = params || []

    let reqOptions = emissary.getReqOptions(moduleId, method, params)

    log.debug(`Sending to ${reqOptions.url} with:`, reqOptions.json)

    return new Promise((resolve, reject) => {
      request(reqOptions, (err, res, body) => {
        // NOTE: handle this error before `err` to avoid a
        // non-user-friendly error message being emmitted.
        if (!body) {
          reject('Connection to the server has been lost')
          return
        }

        if (err) {
          reject(err)
          return
        }

        log.silly('Received:', body)

        if (body.result) {
          resolve(body.result)
        } else if (body.error) {
          if (util.regexMatch(/^Slow down/, body.error.message)) {
            log.info('Hit the click limit - waiting for a minute')
            setTimeout(() => {
              log.info('Trying again')
              resolve(emissary.serverCall(moduleId, method, params))
            }, 61 * 1000)
          } else {
            reject(body.error.message)
          }
        } else if (body === 'Not Found') {
          reject(`${reqOptions.url} not found`)
        } else {
          reject(body)
        }
      })
    })
  }
}

module.exports = emissary
