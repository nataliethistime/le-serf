'use strict'

let React = require('react')

let bootstrapper = require('../bootstrapper')

let NavBar = require('./menu/nav-bar')

let App = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  componentDidMount () {
    bootstrapper.handleInitialLogin()
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
