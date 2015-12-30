'use strict'

let React = require('react')

let ColonyList = require('../task-config-helpers/colony-list')

let MakeHallsConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.list.getSelected().name
    }
  },

  render () {
    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='list' all={false} />
        </div>
      </div>
    )
  }
})

module.exports = MakeHallsConfig
