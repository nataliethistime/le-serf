'use strict'

let Promise = require('bluebird')
let _ = require('lodash')

let log = require('../../log')

let util = require('../util')
let momentUtils = require('../util/moment')
let int = util.int

let empireUtils = require('../util/empire')

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
      .filter((ship) => int(ship.hold_size) >= requiredCargo)
      .sortBy((ship) => int(ship.speed))
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
            let arrMoment = momentUtils.serverDateToMoment(arrDate)
            let arrival = momentUtils.formatMomentLong(arrMoment)
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

  handlePlanets (planets) {
    return new Promise((resolve, reject) => {
      Promise.each(planets, (planet) => {
        let arr = [
          planet,
          this.options.to
        ]

        log.newline()
        log.info(`Looking at ${planet}`)

        return empireUtils.findPlanets(this.lacuna, arr).then((arr) => {
          return this.pushGlyphs(arr[0], arr[1])
        }).catch((err) => {
          log.error(err)
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

  run () {
    return this.lacuna.authenticate().then(() => {
      if (this.options.from === '__all_colonies__') {
        return this.lacuna.empire.colonies().then((colonies) => {
          let planets = _.chain(colonies)
            .pluck('name')
            .filter((name) => name !== this.options.to)
            .value()

          return this.handlePlanets(planets)
        })
      } else {
        return this.handlePlanets([this.options.from])
      }
    })
  }
}

module.exports = PushGlyphs
