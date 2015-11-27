'use strict'

let Building = require('../building')

class Parliament extends Building {
  constructor () {
    super('parliament')

    this.apiMethods('parliament', [
      'cast_vote',
      'get_bodies_for_star_in_jurisdiction',
      'get_mining_platforms_for_asteroid_in_jurisdiction',
      'get_stars_in_jurisdiction',
      'propose_broadcast_on_network19',
      'propose_elect_new_leader',
      'propose_evict_mining_platform',
      'propose_expel_member',
      'propose_fire_bfg',
      'propose_foreign_aid',
      'propose_induct_member',
      'propose_members_only_colonization',
      'propose_members_only_excavation',
      'propose_members_only_mining_rights',
      'propose_neutralize_bhg',
      'propose_rename_asteroid',
      'propose_rename_star',
      'propose_rename_uninhabited',
      'propose_repeal_law',
      'propose_seize_star',
      'propose_taxation',
      'propose_transfer_station_ownership',
      'propose_writ',
      'view_laws',
      'view_taxes_collected',
      'view_propositions'
    ])
  }
}

module.exports = Parliament
