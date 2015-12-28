'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let argHandlers = require('../cli/arg-handlers')

let log = require('../log')
let util = require('../util')

class PushGlyphs {
  constructor (lacuna, options) {
    this.lacuna = lacuna
    this.options = options

    this.glyphsPushed = 0
  }

  getBestShip (requiredCargo, ships) {
    // TODO: should we support an option to specifiy a type of ship
    // for pushing glyphs? Or maybe a ship name?
    // If so, that all needs to happen in here.

    return _.chain(ships)
      .filter((ship) => util.int(ship.hold_size) >= requiredCargo)
      .sortBy((ship) => util.int(ship.speed))
      .first()
      .value()
  }

  prepareCargo (glyphs) {
    return _.map(glyphs, (glyph) => {
      return {
        type: 'glyph',
        name: glyph.name,
        quantity: glyph.quantity
      }
    })
  }

  handleSending (from, to, tradeId) {
    let trade = this.lacuna.buildings.trade

    log.info(`Seeing if there's anything to push`)

    return new Promise((resolve, reject) => {
      return trade.getGlyphSummary([tradeId]).then((summary) => {
        if (summary.glyphs.length === 0) {
          reject('No glyphs to push')
          return
        }

        return trade.getTradeShips([tradeId, to.id]).then((ships) => {
          if (ships.ships.length === 0) {
            reject('No ships for pushing glyphs')
            return
          }

          let total = _.sum(_.pluck(summary.glyphs, 'quantity'))
          let requiredCargo = total * summary.cargo_space_used_each

          let ship = this.getBestShip(requiredCargo, ships.ships)

          if (!ship) {
            reject('No ship for pushing glyphs')
            return
          }

          let cargo = this.prepareCargo(summary.glyphs)

          let params = [
            tradeId,
            to.id,
            cargo,
            {
              ship_id: ship.id,
              stay: 0
            }
          ]

          log.info(`Pushing ${total} glyphs`)

          return trade.pushItems(params).then((result) => {
            let arrDate = result.ship.date_arrives
            let arrMoment = util.serverDateToMoment(arrDate)
            let arrival = util.formatMomentLong(arrMoment)
            let plural = total > 1
              ? 'glyphs'
              : 'glyph'

            log.info(`${total} ${plural} landing on ${to.name} at ${arrival}`)

            this.glyphsPushed += total
            resolve()
          })
        })
      }).catch(reject)
    })
  }

  pushGlyphs (from, to) {
    log.newline()
    log.info(`Looking at ${from.name}`)

    return new Promise((resolve, reject) => {
      return this.lacuna.body.findBuilding(from.id, 'Trade Ministry')
        .then((tradeMin) => {
          if (!tradeMin) {
            reject(`No Trade Ministry found on ${from.name}`)
          } else {
            return this.handleSending(from, to, tradeMin.id).then(resolve)
          }
        }).catch(reject)
    })
  }

  validateOptions () {
    return new Promise((resolve, reject) => {
      if (!this.options.from) {
        reject('please specify a planet to push glyphs from')
      } else {
        resolve(true)
      }
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      return this.lacuna.authenticate().then(() => {
        return Promise.join(
          argHandlers.planet(this.lacuna, this.options.from, this.options.to),
          this.lacuna.empire.findPlanet(this.options.to)
        )
      }).spread((fromColonies, to) => {
        return Promise.each(fromColonies, (from) => {
          return this.pushGlyphs(from, to).catch((err) => {
            log.error(err)
          })
        })
      }).then(() => {
        let plural = this.glyphsPushed > 1
          ? 'glyphs'
          : 'glyph'
        let to = this.options.to
        let message = this.glyphsPushed === 0
          ? `Didn't push any glyphs`
          : `Pushed a grand total of ${this.glyphsPushed} ${plural} to ${to}`

        resolve(message)
      }).catch(reject)
    })
  }
}

module.exports = PushGlyphs
