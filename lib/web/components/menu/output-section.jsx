'use strict'

let React = require('react')
let Reflux = require('reflux')
let _ = require('lodash')

let RunnerStore = require('../../stores/runner')

const colorLogLevelMap = {
  error: 'rgb(232, 61, 48)',
  warn: 'rgb(236, 236, 81)',
  info: 'rgb(17, 222, 17)',
  debug: 'rgb(55, 146, 233)',
  verbose: 'rgb(85, 255, 255)',
  silly: 'rgb(255, 115, 253)'
}

let Message = React.createClass({
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
      return <br />
    } else {
      return (
        <p>{this.colorize(`${this.props.level}:`)} {this.props.content}</p>
      )
    }
  }
})

let OutputSection = React.createClass({

  mixins: [
    Reflux.connect(RunnerStore, 'output')
  ],

  render () {
    let messages = _.map(this.state.output, (message, i) => {
      return (
        <Message
          key={i}
          level={message.level}
          content={message.content}
        />
      )
    })

    return (
      <div>
        <h1 className='text-center'>Output</h1>
        <div ref='console' style={{
          backgroundColor: '#434e56',
          borderRadius: 5,
          color: '#f1f1f1',
          marginBottom: 20,
          padding: 20,
          width: '100%',
          minHeight: 50,
          overflow: 'auto'
        }}>
          {messages}
        </div>
      </div>
    )
  }
})

module.exports = OutputSection
