'use strict'

let _ = require('lodash')

let Building = require('../building')

class Archaeology extends Building {
  constructor () {
    super('archaeology')

    this.apiMethods('archaeology', [
      'abandon_excavator',
      'assemble_glyphs',
      'get_glyphs',
      'get_glyph_summary',
      'get_ores_available_for_processing',
      'mass_abandon_excavator',
      'search_for_glyph',
      'subsidize_search',
      'view',
      'view_excavators'
    ])
  }

  getInventory (id) {
    return this.getGlyphSummary([id]).then((result) => {
      var summary = {}

      _.each(result.glyphs, function (glyph) {
        summary[glyph.name] = parseInt(glyph.quantity, 10)
      })

      return summary
    })
  }
}

module.exports = Archaeology
