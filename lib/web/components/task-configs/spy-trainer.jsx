'use strict'

let React = require('react')

let Captcha = require('./helpers/captcha')
let ColonyList = require('./helpers/colony-list')
let DryRunCheckbox = require('./helpers/dry-run-checkbox')

let SpyTrainerConfig = React.createClass({

  getOptions () {
    return {
      planet: this.refs.list.getSelected().name,
      skill: this.refs.skill.value,
      dryRun: this.refs.dryRun.isChecked()
    }
  },

  render () {
    return (
      <div className='form'>
        <div className='form-group'>
          <ColonyList ref='list' />
        </div>

        <div className='form-group'>
          <label>Skill</label>
          <select className='form-control' ref='skill'>
            <option value='all'>All Skills (attempts to distribute spies evenly)</option>
            <option value='intel'>Intel Training</option>
            <option value='mayhem'>Mayhem Training</option>
            <option value='politics'>Politics Training</option>
            <option value='theft'>Theft Training</option>
          </select>
        </div>

        <DryRunCheckbox ref='dryRun'>
          <Captcha />
        </DryRunCheckbox>
      </div>
    )
  }
})

module.exports = SpyTrainerConfig
