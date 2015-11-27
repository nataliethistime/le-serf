'use strict'

let Building = require('../building')

class Trade extends Building {
  constructor () {
    super('trade')

    this.apiMethods('trade', [
      'accept_from_market',
      'add_supply_ship_to_fleet',
      'add_to_market',
      'add_waste_ship_to_fleet',
      'create_supply_chain',
      'delete_supply_chain',
      'get_glyph_summary',
      'get_glyphs',
      'get_plan_summary',
      'get_plans',
      'get_prisoners',
      'get_ships',
      'get_stored_resources',
      'get_supply_ships',
      'get_trade_ships',
      'get_waste_ships',
      'push_items',
      'remove_supply_ship_from_fleet',
      'remove_waste_ship_from_fleet',
      'report_abuse',
      'update_supply_chain',
      'update_waste_chain',
      'view_market',
      'view_my_market',
      'view_supply_chains',
      'view_waste_chains',
      'withdraw_from_market'
    ])
  }
}

module.exports = Trade
