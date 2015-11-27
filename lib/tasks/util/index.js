'use strict'

// General utilities file.

let _ = require('lodash')

let int = (num) => parseInt(num, 10)
let numericSort = (a, b) => a - b

// NOTE: .toFixed() returns a string.
let mean = (arr) => (_.sum(arr) / arr.length).toFixed(2) * 1

let isMultiple = (num, multiple) => num % multiple === 0

module.exports = {
  int,
  numericSort,
  mean,
  isMultiple
}
