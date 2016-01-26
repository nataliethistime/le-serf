'use strict'

/* global describe */
/* global it */

let expect = require('chai').expect
let _ = require('lodash')

let util = require('../lib/util')

describe('util', () => {
  describe('#array', () => {
    it('should handle undefined', () => {
      expect(util.array(undefined)).to.a('array')
      expect(util.array(null)).to.a('array')
      expect(util.array()).to.a('array')
    })

    it('should make something into an array', () => {
      expect(util.array({})).to.be.a('array')
      expect(util.array([]).length).to.equal(0)
      expect(util.array(10)[0]).to.equal(10)
    })
  })

  describe('#commify', () => {
    it('should handle undefined', () => {
      expect(util.commify(undefined)).to.equal('')
      expect(util.commify(null)).to.equal('')
    })

    it('should commify numbers', () => {
      expect(util.commify(111111)).to.equal('111, 111')
    })
  })

  describe('#formatMs', () => {
    it('should handle undefined', () => {
      expect(util.formatMs(undefined)).to.equal('')
      expect(util.formatMs(null)).to.equal('')
    })

    it('should format milliseconds properly', () => {
      expect(util.formatMs(60 * 60 * 1000)).to.equal('1h')
      expect(util.formatMs((60 * 60 * 1000) + (10 * 1000))).to.equal('1:00:10')
    })
  })

  describe('#formatServerDate', () => {
    it('should handle undefined', () => {
      expect(util.formatServerDate(undefined)).to.equal('')
      expect(util.formatServerDate(null)).to.equal('')
    })

    it('should format server dates', () => {
      // We can't actually test the content of the string because it's different for each time zone!
      expect(util.formatServerDate('28 01 2016 06:40:45 +0000')).to.be.a('string')
    })
  })

  describe('#int', () => {
    it('should handle undefined', () => {
      expect(util.int(undefined)).to.equal(0)
      expect(util.int(null)).to.equal(0)
    })

    it('should make numbers into integers', () => {
      expect(util.int('10')).to.equal(10)
      expect(util.int('10.78592340')).to.equal(10)
      expect(util.int(10.78592340)).to.equal(10)
    })
  })

  describe('#isCLI', () => {
    it('should be correct for the CLI', () => {
      // At time of writing, these tests are only run in the command line.
      expect(util.isCLI()).to.equal(true)
    })
  })

  describe('#isMultiple', () => {
    it('should know math', () => {
      expect(util.isMultiple(10, 5)).to.equal(true)
    })
  })

  describe('#isWeb', () => {
    it('should be correct for the CLI', () => {
      // At time of writing, these tests are only run in the command line.
      expect(util.isWeb()).to.equal(false)
    })
  })

  describe('#mean', () => {
    it('should handle undefined', () => {
      expect(util.mean(undefined)).to.equal(0)
      expect(util.mean(null)).to.equal(0)
    })

    it('should be mean to those numbers', () => {
      expect(util.mean([1, 2, 3])).to.equal(2)
    })
  })

  // This will be quite tricky to unit test.
  describe('#msFromNow', _.noop)

  describe('#objectToArray', () => {
    it('should convert an object to an array', () => {
      const start = {
        1111: {
          foo: 'bar'
        },
        2222: {
          spam: 'eggs'
        }
      }

      const end = [
        {
          id: '1111',
          foo: 'bar'
        },
        {
          id: '2222',
          spam: 'eggs'
        }
      ]

      expect(_.isEqual(util.objectToArray(start, 'id'), end)).to.equal(true)
    })
  })

  describe('#handlePlurality', () => {
    it('should handle undefined input', () => {
      expect(util.handlePlurality(undefined, 'ship')).to.equal('ship')
      expect(util.handlePlurality(null, 'ship')).to.equal('ship')

      expect(util.handlePlurality(10, undefined)).to.equal('')
      expect(util.handlePlurality(10, null)).to.equal('')

      expect(util.handlePlurality(undefined, undefined)).to.equal('')
      expect(util.handlePlurality(null, null)).to.equal('')
    })
    it('should make words plural when necessary', () => {
      expect(util.handlePlurality(10, 'ship')).to.equal('ships')
      expect(util.handlePlurality(10, 'ships')).to.equal('ships')
    })

    it('should make works singular when necessary', () => {
      expect(util.handlePlurality(1, 'ship')).to.equal('ship')
      expect(util.handlePlurality(1, 'ships')).to.equal('ship')
    })
  })

  describe('#regexMatch', () => {
    it('should return true when a regex matches', () => {
      expect(util.regexMatch(/fuck shit donkey dick/, 'fuck shit donkey dick')).to.equal(true)
    })
  })

  describe('#round', () => {
    it('should round a number', () => {
      expect(util.round(10.1178490174892107, 2)).to.equal(10.12)
    })
  })
})
