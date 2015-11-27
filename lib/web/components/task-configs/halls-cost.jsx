'use strict'

let React = require('react')
let _ = require('lodash')

let HallsCost = React.createClass({

  getOptions () {
    return {
      start: this.refs.startList.value * 1,
      end: this.refs.endList.value * 1
    }
  },

  render () {
    let levelsList = _.chain(_.range(1, 31))
      .map((num) => {
        return <option value={num} key={num}>{num}</option>
      })
      .value()

    return (
      <div className='form'>
        <div className='form-group'>
          <label>Start</label>
          <select className='form-control' ref='startList'>
            {levelsList}
          </select>
        </div>
        <div className='form-group'>
          <label>End</label>
          <select className='form-control' defaultValue={30} ref='endList'>
            {levelsList}
          </select>
        </div>
      </div>
    )
  }
})

module.exports = HallsCost
