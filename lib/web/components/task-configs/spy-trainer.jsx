'use strict'

let React = require('react')

let Captcha = require('./helpers/captcha')
let ColonyList = require('./helpers/colony-list')
let DryRunCheckbox = require('./helpers/dry-run-checkbox')

let SpyTrainerConfig = React.createClass({

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

        <DryRunCheckbox ref='dryRun'>
          <Captcha />
        </DryRunCheckbox>
      </div>
    )
  }
})

module.exports = SpyTrainerConfig
