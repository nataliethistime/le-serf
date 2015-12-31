'use strict'

let Promise = require('bluebird')

let Module = require('../module')

let log = require('../../log')

let readline = require('readline')

class Captcha extends Module {
  constructor () {
    super()

    this.apiMethods('captcha', [
      'fetch',
      'solve'
    ])
  }

  prompt () {
    return new Promise((resolve, reject) => {
      if (typeof window === 'object') {
        // In the web version, the config screen handles captchas when required.
        // Therefore, this shoud just be a no op if window exists.
        resolve()
      } else {
        return this.fetch().then((captcha) => {
          log.info(`Please solve captcha from url: ${captcha.url}`)

          let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })

          rl.question('Captcha answer: ', (answer) => {
            // No more questions!
            rl.close()

            // NOTE: getting the answer wrong kills the whole script. Whatever.
            this.solve([captcha.guid, answer]).then(resolve).catch(reject)
          })
        })
      }
    })
  }
}

module.exports = Captcha
