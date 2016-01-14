'use strict'

let React = require('react')
let _ = require('lodash')

let ColonyList = require('./helpers/colony-list')
let List = require('./helpers/list')

let constants = require('../../../constants')

let ScuttleShipsConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.colonyList.getSelected().name,
      type: this.refs.shipList.getValue()
    }
  },

  render () {
    let shipList = _.chain(constants.shipTypes)
    .mapValues((serverName, displayName) => {
      return {
        name: displayName,
        value: serverName
      }
    })
    .sortBy('name')
    .thru((arr) => {
      return [{
        name: 'All Ships',
        value: 'all'
      }].concat(arr)
    })
    .value()

    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='colonyList' />
        </div>

        <div className='form-group'>
          <List list={shipList} label='Ship' ref='shipList' />
        </div>
      </div>
    )
  }
})

module.exports = ScuttleShipsConfig
