'use strict'

let React = require('react')

let ColonyList = require('./helpers/colony-list')
let DryRunCheckbox = require('./helpers/dry-run-checkbox')
let Checkbox = require('./helpers/checkbox')

let PushBuildingsUpConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.list.getSelected().name,
      dryRun: this.refs.dryRun.isChecked(),
      loop: this.refs.loop.isChecked()
    }
  },

  render () {
    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='list' />
        </div>

        <Checkbox ref='loop' label='Loop' description='Wait for buildings to upgrade and go agin' />

        <DryRunCheckbox ref='dryRun' />
      </div>
    )
  }
})

module.exports = PushBuildingsUpConfig
