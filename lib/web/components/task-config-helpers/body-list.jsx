'use strict'

let React = require('react')
let _ = require('lodash')

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
    let id = this.refs.list.value
    let name = this.props.bodies[id]

    if (id === 'all') {
      name = 'all'
    }

    return {id, name}
  },

  render () {
    let list = []

    if (this.props.all) {
      list.push(
        <option value='all' key='all'>All</option>
      )
    }

    // Invert so we can key by planet name
    let bodies = _.invert(this.props.bodies)
    let names = _.keys(bodies).sort()

    _.each(names, (name) => {
      let id = bodies[name]
      list.push(
        <option value={id} key={id}>{name}</option>
      )
    })

    return (
      <div>
        <label>{this.props.label}</label>
        <select className='form-control' ref='list'>
          {list}
        </select>
      </div>
    )
  }
})

module.exports = BodyList
