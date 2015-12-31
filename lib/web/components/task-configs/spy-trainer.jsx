'use strict'

let React = require('react')

let CaptchaActions = require('../../actions/captcha')

let Captcha = require('./helpers/captcha')
let ColonyList = require('./helpers/colony-list')

let SpyTrainerConfig = React.createClass({

  getInitialState () {
    return {
      dryRunChecked: false
    }
  },

  toggleDryRun () {
    this.setState({
      dryRunChecked: !this.state.dryRunChecked
    })
  },

  getOptions () {
    return {
      planet: this.refs.list.getSelected().name,
      skill: this.refs.skill.value,
      dryRun: this.state.dryRunChecked
    }
  },

  onWindowShow () {
    CaptchaActions.clear()
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

        <div className='form-group'>
          <div className='checkbox'>
            <label>
              <input
                type='checkbox'
                checked={this.state.dryRunChecked}
                onChange={this.toggleDryRun}
              >
              </input>
              Dry run
            </label>
            <span className='help-block'>
              Runs the task and shows what would happen without actually changing anything.
            </span>
          </div>
        </div>

        {
          !this.state.dryRunChecked
            ? (
              <div className='form-group'>
                <Captcha />
              </div>
            ) : ''
        }
      </div>
    )
  }
})

module.exports = SpyTrainerConfig
