'use strict'

let React = require('react')

let ColonyList = require('./helpers/colony-list')

let PushGlyphsConfig = React.createClass({

  getOptions () {
    return {
      from: this.refs.from.getSelected().name,
      to: this.refs.to.getSelected().name
    }
  },

  render () {
    return (
      <div className='form'>

        <div className='form-group'>
          <ColonyList
            label='From'
            ref='from'
          />
        </div>

        <div className='form-group'>
          <ColonyList
            label='To'
            ref='to'
            all={false}
          />
        </div>

      </div>
    )
  }
})

module.exports = PushGlyphsConfig
