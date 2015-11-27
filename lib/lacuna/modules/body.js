'use strict'

let _ = require('lodash')
let Promise = require('bluebird')

let util = require('../util')

let Module = require('../module')

class Body extends Module {

  constructor () {
    super()

    this.apiMethods('body', [
      'abandon',
      'get_buildable',
      'get_buildings',
      'get_status',
      'rearrange_buildings',
      'rename',
      'repair_list',
      'view_laws'
    ])
  }

  findBuilding (bodyId, name) {
    return this.findBuildings(bodyId, name).then((matches) => {
      // Reverse the matches so that we get the highest level not the lowest.
      return _.first(matches.reverse())
    })
  }

  findBuildings (bodyId, name) {
    return this.buildings(bodyId).then((buildings) => {
      let matches = _.filter(buildings, {name, efficiency: '100'})
      return util.sortArrayOfObjects(matches, 'level')
    })
  }

  buildings (id) {
    return new Promise((resolve, reject) => {
      if (_.isString(id) || _.isNumber(id)) {
        // Get the buildings from the server...
        this.getBuildings([id]).then((result) => {
          resolve(util.objectToArray(result.buildings, 'id'))
        }).catch(reject)
      } else {
        // .. otherwise the buildings have already been supplied.
        resolve(util.objectToArray(id, 'id'))
      }
    })
  }
}

module.exports = Body
