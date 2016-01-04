'use strict'

let React = require('react')
let _ = require('lodash')

let List = require('./list')

let BodyList = React.createClass({

  propTypes: {
    bodies: React.PropTypes.object,
    label: React.PropTypes.string,
    all: React.PropTypes.bool
  },

  getDefaultProps () {
    return {
      bodies: [],
      label: 'Planet',
      all: true
    }
  },

  getSelected () {
    let id = this.refs.list.getValue()
    let name = this.props.bodies[id]

    if (id === 'all') {
      name = 'all'
    }

    return {id, name}
  },

  render () {
    let list = []

    if (this.props.all) {
      list.push({
        name: 'All',
        value: 'all'
      })
    }

    // Invert so we can key by planet name
    let bodies = _.invert(this.props.bodies)
    let names = _.keys(bodies).sort()

    _.each(names, (name) => {
      let id = bodies[name]
      list.push({
        name,
        value: id
      })
    })

    return (
      <List ref='list' label={this.props.label} list={list} />
    )
  }
})

module.exports = BodyList
