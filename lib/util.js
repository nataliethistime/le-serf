'use strict'

let _ = require('lodash')

let moment = require('moment')
require('moment-range')
require('moment-duration-format')

let pluralize = require('pluralize')

let constants = require('./constants')
let log = require('./log')

/**
 * General utilities used around the place.
 *
 * @namespace util
 */
const util = {

  /**
   * Converts the given `thing` into an array. If it's is already an array, it's simply returned
   * as-is. If it's `undefined` an empty array is returned. This is useful for making sure
   * a variable is an array without doing any tricky checking.
   *
   * @param  {anything} thing - the variable you want to make into an array
   * @return {array}
   */
  array (thing) {
    if (!thing) {
      return []
    } else if (!_.isArray(thing)) {
      return [thing]
    } else {
      return thing
    }
  },

  /**
   * Inserts commas into large numbers to improve readibility.
   *
   * @param  {number|string} x - the number you want to add commas to.
   * @return {string} the number with commas added
   */
  commify (x) {
    if (!x) {
      return ''
    }

    // See: http://stackoverflow.com/a/2901298/1978973
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ')
  },

  /**
   * Formats time (in milliseconds) to a human-readable form of `days:hours:minutes:seconds`.
   *
   * @param  {number} ms - time you want formatted in milliseconds
   * @return {string}      human-readable time in the form `days:hours:minutes:seconds`
   */
  formatMs (ms) {
    if (!ms) {
      return ''
    }

    return moment.duration(ms, 'milliseconds').format()
  },

  /**
   * Formats Lacuna's dates into a user-friendly form.
   *
   * @param  {string} date - the date from the server you want to format
   * @return {string}        a nicely formatted date
   */
  formatServerDate (date) {
    if (!date) {
      return ''
    }

    return moment(date, constants.serverDateFormat).format('dddd, Do MMMM HH:mm:ss ZZ')
  },

  /**
   * Handles errors in promises. Use this to handle the `error` paramater in a Promise's
   * `catch` callback. This is needed because often a task will do `reject('something messed up')`
   * and other times there will be errors in the code. These need to be handled preperly
   * and gracefully.
   *
   * @param  {object|string}  err - the thing that went wrong
   */
  handlePromiseError (err) {
    if (typeof err === 'string') {
      log.error(err)
    } else {
      throw err
    }
  },

  /**
   * Converts the given number to an integer.
   *
   * @param  {number} num - the number you want to convert
   * @return {integer}      an integer
   */
  int (num) {
    if (!num) {
      return 0
    }

    return parseInt(num, 10)
  },

  /**
   * Determine if this is the CLI version of Le Serf
   *
   * @return {Boolean} true if we're in the CLI version of Le Serf.
   */
  isCLI () {
    return !util.isWeb()
  },

  /**
   * Checks if `multiple` is a multiple of `num`.
   *
   * @param  {number}  num       - the original number
   * @param  {number}  multiple  - the number you want to check is a multiple of `num`
   * @return {Boolean}
   */
  isMultiple (num, multiple) {
    return num % multiple === 0
  },

  /**
   * Determine if this is the Web version of Le Serf
   *
   * @return {Boolean} true if we're in the Web version of Le Serf.
   */
  isWeb () {
    return typeof window === 'object' && window.LE_SERF_WEB === true
  },

  /**
   * Calculates the mean of the given list of numbers.
   *
   * @param  {array} arr - the array of numbers you want to calculate the mean of.
   * @return {number}      the mean, rounded to two decimal places
   */
  mean (arr) {
    arr = util.array(arr)

    // Avoid illegal divisions by 0
    if (arr.length === 0) {
      return 0
    }

    return util.round(_.sum(arr) / arr.length, 2)
  },

  /**
   * Returns the milliseconds from now that the given date is.
   *
   * @param  {Date} date - the date in the future some time
   * @return {number}      milliseconds from now until that date
   */
  msFromNow (date) {
    if (typeof date === 'string') {
      date = moment(date, constants.serverDateFormat)
    }

    return moment.range(
      moment(),
      date
    ).valueOf()
  },

  /**
   * Convert an object to an array of objects.
   *
   * @param  {object} obj      - the object to convert
   * @param  {string} keyName  - the key name for the old object's key in the new object
   * @return {array}             the newly-generated array
   */
  objectToArray (obj, keyName) {
    if (_.isArray(obj)) {
      return obj
    }

    var arr = []

    _.each(obj, (value, key) => {
      value[keyName] = key
      arr.push(value)
    })

    return arr
  },

  /**
   * Handles whether you should use a singular noun or a plural.
   *
   * @example
   * util.handlePlurality(10, 'ship')
   * // => 'ships'
   *
   * @example
   * util.handlePlurality(1, 'spy')
   * // => 'spy'
   *
   * @param  {number} number      - the number of things you have
   * @param  {string} word        - the name of the thing(s) you have
   * @return {string}               the singular of plural form of `word`
   */
  handlePlurality (number, word) {
    if (number == null && !word) {
      return ''
    }

    if (number == null) {
      return word
    }

    if (!word) {
      return ''
    }

    number = util.int(number)
    return pluralize(word, number)
  },

  /**
   * Checks if a given string matches a given regex.
   *
   * @param  {RegExp} regex - the regex to test
   * @param  {string} str   - the string to test against the regex
   * @return {boolean}        true if the regex matches the string otherwise false
   */
  regexMatch (regex, str) {
    let match = str.match(regex)

    if (match === null) {
      return false
    } else {
      return true
    }
  },

  /**
   * Rounds a given number to the given number of digits.
   *
   * @param  {number} num      - the number you want to round
   * @param  {number} decimals - the number of decimals you want to round the number to
   * @return {number}            the rounded number
   */
  round (num, decimals) {
    // NOTE: toFixed returns a string so we "* 1" to get a number.
    return parseFloat(num, 10).toFixed(decimals) * 1
  }
}

module.exports = util
