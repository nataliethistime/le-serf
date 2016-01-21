'use strict'

let React = require('react')
let _ = require('lodash')

const colorLogLevelMap = {
  error: 'rgb(232, 61, 48)',
  warn: 'rgb(236, 236, 81)',
  info: 'rgb(17, 222, 17)',
  debug: 'rgb(55, 146, 233)',
  verbose: 'rgb(85, 255, 255)',
  silly: 'rgb(255, 115, 253)'
}

let LogMessage = React.createClass({
  propTypes: {
    level: React.PropTypes.oneOf(_.keys(colorLogLevelMap)),
    content: React.PropTypes.string.isRequired
  },

  getDefaultState () {
    return {
      level: 'info',
      content: ''
    }
  },

  colorize (str) {
    return (
      <span style={{
        color: colorLogLevelMap[this.props.level]
      }}>
        {str}
      </span>
    )
  },

  render () {
    if (this.props.content === '---') {
      return <br style={{lineHeight: 1}} />
    } else {
      let level = this.colorize(`${this.props.level}:`)

      return (
        <p>{level} {this.props.content}</p>
      )
    }
  }
})

module.exports = LogMessage
