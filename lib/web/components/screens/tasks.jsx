'use strict'

let React = require('react')

let TasksSection = require('../menu/tasks-section')
let OutputSection = require('../menu/output-section')

let TasksScreen = React.createClass({
  render () {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <TasksSection />
        </div>
        <div className='col-md-6'>
          <OutputSection />
        </div>
      </div>
    )
  }
})

module.exports = TasksScreen
