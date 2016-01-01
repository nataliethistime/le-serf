'use strict'

let React = require('react')
let Reflux = require('reflux')

let BodyList = require('./body-list')

let EmpireStore = require('../../../stores/empire')

let ColonyList = React.createClass({

  mixins: [
    Reflux.connect(EmpireStore, 'empire')
  ],

  propTypes: {
    all: React.PropTypes.bool,
    label: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      all: true,
      label: 'Colony'
    }
  },

  getSelected () {
    return this.refs.list.getSelected()
  },

  render () {
    return (
      <BodyList
        bodies={this.state.empire.colonies}
        all={this.props.all}
        label={this.props.label}
        ref='list'
      />
    )
  }
})

module.exports = ColonyList
