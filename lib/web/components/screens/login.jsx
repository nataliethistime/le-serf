'use strict'

let React = require('react')
let Reflux = require('reflux')
let _ = require('lodash')
let $ = window.jQuery

let EmpireActions = require('../../actions/empire')

let ConfigStore = require('../../stores/config')

let LoginScreen = React.createClass({

  mixins: [
    Reflux.connect(ConfigStore, 'config')
  ],

  componentDidMount () {
    let handleReturn = (e) => {
      if (e.keyCode === 13) {
        this.handleLogin()
      }
    }

    let elements = [
      this.refs.empire,
      this.refs.password
    ]

    _.each(elements, (el) => {
      $(el).off().on('keypress', handleReturn)
    })
  },

  handleLogin () {
    EmpireActions.login({
      empire: this.refs.empire.value,
      password: this.refs.password.value,
      server: this.refs.server.value
    })
  },

  render () {
    return (
      <div className='row'>
        <div className='col-md-4 col-md-offset-4'>
          <div className='form'>

            <div className='form-group'>
              <h2>Sign In</h2>
            </div>

            <div className='form-group'>
              <input
                type='text'
                ref='empire'
                className='form-control'
                placeholder='Empire Name'
                defaultValue={this.state.config.empire}>
              </input>

              <input
                type='password'
                ref='password'
                className='form-control'
                defaultValue={this.state.config.password}
                placeholder='Password'>
              </input>
            </div>

            <div className='form-group'>
              <select className='form-control' ref='server'>
                <option value='us1'>US1</option>
              </select>
            </div>

            <div className='form-group'>
              <button
                className='btn btn-lg btn-primary btn-block'
                onClick={this.handleLogin}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = LoginScreen
