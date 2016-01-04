'use strict'

let React = require('react')
let _ = require('lodash')

let List = React.createClass({

  propTypes: {
    label: React.PropTypes.string,
    list: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps () {
    return {
      label: '',
      list: []
    }
  },

  getValue () {
    return this.refs.list.value
  },

  render () {
    let list = _.map(this.props.list, (item) => {
      return (
        <option value={item.value} key={item.value}>{item.name}</option>
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

module.exports = List
