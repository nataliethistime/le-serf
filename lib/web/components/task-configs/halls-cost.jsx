'use strict'

let React = require('react')
let _ = require('lodash')

let util = require('../../../util')

let HallsCost = React.createClass({

  getOptions () {
    return {
      start: util.int(this.refs.startList.value),
      end: util.int(this.refs.endList.value)
    }
  },

  render () {
    let list = _.chain(_.range(1, 31))
      .map((num) => {
        return <option value={num} key={num}>{num}</option>
      })
      .value()

    return (
      <div className='form'>
        <div className='form-group'>
          <label>Start</label>
          <select className='form-control' ref='startList'>
            {list}
          </select>
        </div>
        <div className='form-group'>
          <label>End</label>
          <select className='form-control' defaultValue={30} ref='endList'>
            {list}
          </select>
        </div>
      </div>
    )
  }
})

module.exports = HallsCost
