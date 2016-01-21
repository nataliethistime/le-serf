'use strict'

let React = require('react')

let ColonyList = require('./helpers/colony-list')

let DockedShipsConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.colonyList.getSelected().name
    }
  },

  render () {
    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='colonyList' />
        </div>
      </div>
    )
  }
})

module.exports = DockedShipsConfig
