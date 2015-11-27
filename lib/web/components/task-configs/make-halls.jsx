'use strict'

let React = require('react')
let Reflux = require('reflux')
let _ = require('lodash')
let $ = window.jQuery

let EmpireStore = require('../../stores/empire')

let MakeHallsConfig = React.createClass({

  mixins: [
    Reflux.connect(EmpireStore, 'empire')
  ],

  getOptions () {
    return {
      planet: this.state.empire.colonies[this.refs.colonyList.value]
    }
  },

  componentDidUpdate () {
    let queryStr = `option[value="${this.state.empire.home_planet_id}"]`
    $(queryStr, this.refs.colonyList).prop('selected', true)
  },

  render () {
    let colonies = _.invert(this.state.empire.colonies)
    let names = _.keys(colonies).sort()

    let colonyList = _.map(names, (name) => {
      let id = colonies[name]
      return <option value={id} key={id}>{name}</option>
    })

    return (
      <div className='form'>
        <div className='form-group'>
          <label>Planet</label>
          <select className='form-control' ref='colonyList'>
            {colonyList}
          </select>
        </div>
      </div>
    )
  }
})

module.exports = MakeHallsConfig
