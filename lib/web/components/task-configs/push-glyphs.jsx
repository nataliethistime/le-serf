'use strict'

let React = require('react')
let Reflux = require('reflux')
let _ = require('lodash')
let $ = window.jQuery

let EmpireStore = require('../../stores/empire')

let PushGlyphsConfig = React.createClass({

  mixins: [
    Reflux.connect(EmpireStore, 'empire')
  ],

  getOptions () {
    return {
      from: this.refs.fromList.value === 'all'
        ? 'all'
        : this.state.empire.colonies[this.refs.fromList.value],
      to: this.state.empire.colonies[this.refs.toList.value]
    }
  },

  componentDidUpdate () {
    let queryStr = `option[value="${this.state.empire.home_planet_id}"]`
    $(queryStr, this.refs.toList).prop('selected', true)
  },

  render () {
    let colonies = _.invert(this.state.empire.colonies)
    let names = _.keys(colonies).sort()

    let fromList = _.map(names, (name) => {
      return (
        <option
          value={colonies[name]}
          key={colonies[name]}
        >
          {name}
        </option>
      )
    })

    // Add in the magic 'all colonies' option
    fromList.push(
      <option value='all' key='all'>All Colonies</option>
    )

    let toList = _.map(names, (name) => {
      let id = colonies[name]
      return <option value={id} key={id}>{name}</option>
    })

    return (
      <div className='form'>
        <div className='form-group'>
          <label>From</label>
          <select
            className='form-control'
            ref='fromList'
            defaultValue='all'
          >
            {fromList}
          </select>
        </div>

        <div className='form-group'>
          <label>To</label>
          <select
            className='form-control'
            ref='toList'
          >
            {toList}
          </select>
        </div>
      </div>
    )
  }
})

module.exports = PushGlyphsConfig
