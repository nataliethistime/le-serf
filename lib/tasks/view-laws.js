'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let lacuna = require('../lacuna')
let log = require('../log')

class ViewLaws {

  constructor (options) {
    this.options = options
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.id) {
        reject('please specify a station')
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      lacuna.body.viewLaws([this.options.id]).then((result) => {
        if (result.laws.length > 0) {
          log.newline()
          log.info(`Laws:`)

          _.each(result.laws, (law) => {
            // NOTE: the descriptions are really long and ugly-looking, even on my wide monitor.
            // log.info(`${law.name}: ${law.description}`)
            log.info(`${law.name}`)
          })

          resolve(`Total of ${result.laws.length} laws enacted.`)
        } else {
          resolve(`No laws`)
        }
      }).catch(reject)
    })
  }
}

module.exports = ViewLaws
