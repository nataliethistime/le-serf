'use strict'

let _ = require('lodash')

let constants = require('./constants')

// Key: the ships display name
// Val: the ships server name
const SHIP_TYPES = _.mapKeys(constants.shipTypes, (key) => key.toLowerCase())

// Key: the ships server name
// Val: the ships display name
const INVERTED_SHIP_TYPES = _.invert(SHIP_TYPES)

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
    let key = type.toLowerCase()

    if (SHIP_TYPES[key]) {
      return SHIP_TYPES[key]
    } else if (INVERTED_SHIP_TYPES[key]) {
      return INVERTED_SHIP_TYPES[key]
    } else {
      return undefined
    }
  }
}

module.exports = types
