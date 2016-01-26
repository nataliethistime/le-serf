'use strict'

/* global describe */
/* global it */

let expect = require('chai').expect

let types = require('../lib/types')

describe('types', () => {
  describe('#translateShipType', () => {
    it('should handle undefined', () => {
      expect(types.translateShipType(undefined)).to.equal('')
      expect(types.translateShipType(null)).to.equal('')
    })

    it('should translate a human ship name to a server type', () => {
      expect(types.translateShipType('Supply Pod II')).to.equal('supply_pod2')
    })

    it('should translate a server ship name to a human type', () => {
      expect(types.translateShipType('supply_pod2')).to.equal('Supply Pod II')
    })

    it(`should handle types it doesn't understand`, () => {
      expect(types.translateShipType('Unicorn')).to.equal(undefined)
    })
  })
})
