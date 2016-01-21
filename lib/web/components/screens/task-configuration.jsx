'use strict'

let React = require('react')

let TaskConfigurationSection = require('../menu/task-configuration-section')

let TasksScreen = React.createClass({
  render () {
    return (
      <div className='row'>
        <div className='col-md-4 col-md-offset-4'>
          <TaskConfigurationSection />
        </div>
      </div>
    )
  }
})

module.exports = TasksScreen
