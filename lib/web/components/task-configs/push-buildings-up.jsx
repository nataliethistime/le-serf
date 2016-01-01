'use strict'

let React = require('react')

let ColonyList = require('./helpers/colony-list')
let DryRunCheckbox = require('./helpers/dry-run-checkbox')

let PushBuildingsUpConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.list.getSelected().name,
      dryRun: this.refs.dryRun.isChecked()
    }
  },

  render () {
    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='list' />
        </div>

        <DryRunCheckbox ref='dryRun' />
      </div>
    )
  }
})

module.exports = PushBuildingsUpConfig
