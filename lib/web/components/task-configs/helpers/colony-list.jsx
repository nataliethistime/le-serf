'use strict'

let React = require('react')
let Reflux = require('reflux')
let $ = window.jQuery

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

  componentDidUpdate () {
    if (!this.props.all) {
      let queryStr = `option[value="${this.state.empire.home_planet_id}"]`
      $(queryStr, this.refs.list.refs.list).prop('selected', true)
    }
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
