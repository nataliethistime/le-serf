'use strict'

/* global describe */
/* global it */
/* global beforeEach */

let expect = require('chai').expect
let _ = require('lodash')

let log = require('../lib/log')
log.silent()

describe('log', () => {
  describe('#error', () => {
    it('be a function', () => {
      expect(log.error).to.be.a('function')
    })
  })

  describe('#warn', () => {
    it('be a function', () => {
      expect(log.warn).to.be.a('function')
    })
  })

  describe('#info', () => {
    it('be a function', () => {
      expect(log.info).to.be.a('function')
    })
  })

  describe('#verbose', () => {
    it('be a function', () => {
      expect(log.verbose).to.be.a('function')
    })
  })

  describe('#silly', () => {
    it('be a function', () => {
      expect(log.silly).to.be.a('function')
    })
  })

  describe('#handleConsoleOutput', () => {
    it(`should return '' for newline tokens`, () => {
      expect(log.handleConsoleOutput('info', '---')).to.equal('')
    })

    it('should output a level and message in one string')
  })

  describe('#prepareOutput', () => {
    it('should handle a normal message', () => {
      expect(log.prepareOutput('one two three four'))
        .to.equal('one two three four')
    })

    it('should handle splats', () => {
      expect(log.prepareOutput(['one', 'two', 'three', 'four']))
        .to.equal('one two three four')
    })

    it('should handle objects', () => {
      expect(log.prepareOutput(['one', {two: 'three'}, 'four']))
        .to.equal(`one {"two":"three"} four`)
    })

    it('should make trailing objects look pretty', () => {
      expect(log.prepareOutput(['one', 'two', {three: 'four'}]))
        .to.equal(`one two \n{\n  "three": "four"\n}`)
    })
  })

  // `log.{error, warn, info, verbose, silly}` are all the same function
  // bound with a different value for the log level.
  // Thefore, we only need to test that they're functions and do actual
  // tests for functionality on `log.log`.
  describe('#log', () => {
    beforeEach(() => {
      log.setLogLevel('silly')
    })

    it(`should only log the message if it's valid`, () => {
      expect(log.log('error', 'This is an error message')).to.not.equal(false)
      expect(log.log('warn', 'This is a warn message')).to.not.equal(false)
      expect(log.log('info', 'This is an info message')).to.not.equal(false)
      expect(log.log('debug', 'This is a debug message')).to.not.equal(false)
      expect(log.log('verbose', 'This is verbose message')).to.not.equal(false)
      expect(log.log('silly', 'This is a silly message')).to.not.equal(false)
    })

    it(`shouldn't log a message that's invalid`, () => {
      expect(log.log('something_stupid', `This shouldn't work`)).to.equal(false)
      expect(log.log(123456789, `This shouldn't work`)).to.equal(false)
    })

    it('should send messages to subscribers', (done) => {
      let testLevel = 'info'
      let testMessage = 'This message is being listened for by a subscriber'

      log.subscribe(_.once((level, message) => {
        expect(level).to.equal(testLevel)
        expect(message).to.equal(testMessage)
        done()
      }))

      log.log(testLevel, testMessage)
    })
  })

  describe('#newline', () => {
    it('should output a blank line in the console', () => {
      expect(log.newline()).to.equal('')
    })

    it(`should output '---' to subscribers`, (done) => {
      log.subscribe(_.once((level, message) => {
        expect(level).to.equal('info')
        expect(message).to.equal('---')
        done()
      }))

      log.newline()
    })
  })

  describe('#isLogLevel', () => {
    it('should return true for valid input', () => {
      expect(log.isLogLevel('error')).to.equal(true)
      expect(log.isLogLevel('warn')).to.equal(true)
      expect(log.isLogLevel('info')).to.equal(true)
      expect(log.isLogLevel('verbose')).to.equal(true)
      expect(log.isLogLevel('silly')).to.equal(true)
    })

    it('should return false for invalid input', () => {
      expect(log.isLogLevel(0)).to.equal(false)
      expect(log.isLogLevel(1)).to.equal(false)
      expect(log.isLogLevel(2)).to.equal(false)
      expect(log.isLogLevel(3)).to.equal(false)
      expect(log.isLogLevel(4)).to.equal(false)

      expect(log.isLogLevel('something_stupid')).to.equal(false)
    })
  })

  describe('#setLogLevel', () => {
    it('should set the log level', () => {
      let newLevel = 'error'
      log.setLogLevel(newLevel)
      expect(log.logLevel).to.equal(newLevel)
    })

    it(`should only change the log level it it's valid`, () => {
      let newLevel = 'something_stupid'
      let oldLevel = log.logLevel
      log.setLogLevel(newLevel)
      expect(log.logLevel).to.equal(oldLevel)
    })
  })

  describe('#shouldLog', () => {
    beforeEach(() => {
      log.setLogLevel('info')
    })

    it('should return true for messages within the current log level', () => {
      expect(log.shouldLog('error')).to.equal(true)
      expect(log.shouldLog('warn')).to.equal(true)
      expect(log.shouldLog('info')).to.equal(true)
    })

    it('should return false for messages outside the current log level', () => {
      expect(log.shouldLog('debug')).to.equal(false)
      expect(log.shouldLog('verbose')).to.equal(false)
      expect(log.shouldLog('silly')).to.equal(false)
    })

    it('it should return false for invalid log levels', () => {
      expect(log.shouldLog('something_stupid')).to.equal(false)
      expect(log.shouldLog(123456789)).to.equal(false)
    })
  })

  describe('#colorLevel', () => {
    // I'm not really sure how to test this properly. :/
    // TODO: come up with a way to test colorization
    it('should color a valid level')

    it(`shouldn't color an invalid level`, () => {
      expect(log.colorLevel('something_stupid')).to.equal('something_stupid')
      expect(log.colorLevel(123456789)).to.equal(123456789)
    })
  })

  describe('#subscribe', () => {
    beforeEach(() => {
      log.unsubscribeAll()
    })

    it('should add a callback to the subscribers array', () => {
      log.subscribe(_.noop)
      expect(log.subscribers.length).to.equal(1)
    })
  })

  describe('#unsubscribeAll', () => {
    beforeEach(() => {
      log.subscribe(_.noop)
    })

    it('should empty the subscribers array', () => {
      log.unsubscribeAll()
      expect(log.subscribers.length).to.equal(0)
    })
  })

  describe('#broadcast', () => {
    let testLevel = 'info'
    let testMessage = 'hellow i am a test'

    it('should broadcast a message to subscribers', () => {
      log.subscribe(_.once((level, message) => {
        expect(level).to.equal(testLevel)
        expect(message).to.equal(testMessage)
      }))

      log.log(testLevel, testMessage)
    })
  })
})
