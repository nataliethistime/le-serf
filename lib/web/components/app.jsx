'use strict'

let React = require('react')
let _ = require('lodash')

let NavBar = require('./menu/nav-bar')

let ConfigStore = require('../stores/config')

let EmpireActions = require('../actions/empire')
let WindowActions = require('../actions/window')

let App = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  componentDidMount () {
    let data = ConfigStore.getData()

    if (_.isEmpty(data)) {
      WindowActions.navigate('/login')
    } else {
      EmpireActions.login(data)
    }
  },

  render () {
    return (
      <div>
        <div className='container-fluid'>
          <NavBar />

          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})

module.exports = App
