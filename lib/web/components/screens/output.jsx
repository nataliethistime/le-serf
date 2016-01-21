'use strict'

let React = require('react')
let Reflux = require('reflux')
let _ = require('lodash')

let LogMessage = require('../menu/log-message')

let RunnerStore = require('../../stores/runner')

let OutputScreen = React.createClass({

  mixins: [
    Reflux.connect(RunnerStore, 'output')
  ],

  render () {
    return (
      <div className='row'>
        <div className='col-md-10 col-md-offset-1'>
          <h1 className='text-center'>Output</h1>
          <div ref='console' style={{
            backgroundColor: '#434e56',
            borderRadius: 5,
            color: '#f1f1f1',
            marginBottom: 20,
            padding: 20,
            width: '100%',
            minHeight: 50,
            overflow: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            lineHeight: 0.5
          }}>
            {
              _.map(this.state.output, (message, i) => {
                return message.content.split('\n').map((content, i2) => {
                  return (
                    <LogMessage
                      key={`${i}-${i2}`}
                      level={message.level}
                      content={content}
                    />
                  )
                })
              })
            }
          </div>
        </div>
      </div>
    )
  }
})

module.exports = OutputScreen
