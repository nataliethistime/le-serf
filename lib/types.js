'use strict'

let _ = require('lodash')

let constants = require('./constants')

const SHIP_TYPES = _.mapKeys(constants.shipTypes, (key) => key.toLowerCase())

/**
 * Translate human-written types into server types
 *
 * @namespace types
 */
let types = {

  /**
   * Translates the given ship type into a type the server can understand.
   *
   * @param  {string} type - the ship type you want to translate
   * @return {string}        the new type
   */
  translateShipType (type) {
    return SHIP_TYPES[type.toLowerCase()]
  }
}

module.exports = types
