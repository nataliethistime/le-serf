'use strict'

let React = require('react')
let Reflux = require('reflux')

let tasks = require('../../../../lib/tasks').getTasksForPlatform('web')

let taskConfigs = require('../task-configs')

let CaptchaActions = require('../../actions/captcha')
let RunnerActions = require('../../actions/runner')
let WindowActions = require('../../actions/window')

let RunnerStore = require('../../stores/runner')
let SelectedTaskStore = require('../../stores/selectedTask')

let TasksConfigurationSection = React.createClass({

  mixins: [
    Reflux.connect(SelectedTaskStore, 'selectedTask')
  ],

  componentDidUpdate () {
    // Reset any captcha that might be in here.
    CaptchaActions.clear()
  },

  handleButtonClick () {
    if (RunnerStore.isRunningTask()) {
      return
    }

    this.handleTaskRun()
  },

  handleTaskRun () {
    let task = this.getTask()
    let options = {}

    if (this.needsConfiguration()) {
      options = this.refs.config.getOptions()
    }

    RunnerActions.runTask(task.name, options)
  },

  goToSelectionScreen () {
    WindowActions.navigate('/task-selection')
  },

  getTask () {
    return tasks[this.state.selectedTask]
  },

  needsConfiguration () {
    if (this.getConfigComponent()) {
      return true
    } else {
      return false
    }
  },

  getConfigComponent () {
    return taskConfigs[this.state.selectedTask]
  },

  getNecessaryConfiguration () {
    if (this.needsConfiguration()) {
      return React.createElement(this.getConfigComponent(), {ref: 'config'})
    } else {
      return <div style={{height: 10}}></div>
    }
  },

  render () {
    let task = this.getTask()

    if (task) {
      return (
        <div>
          <div className='text-center'>
            <h1 style={{display: 'inline'}}>
              {task.title}
            </h1>

            <div style={{display: 'inline', marginLeft: 10}}>
              (
                <a onClick={this.goToSelectionScreen} style={{cursor: 'pointer'}}>
                  Change
                </a>
              )
            </div>
          </div>

          {
            this.getNecessaryConfiguration()
          }

          <div className='text-center'>
            <button
              type='button'
              className='btn btn-success btn-lg'
              onClick={this.handleTaskRun}
              style={{
                width: '50%'
              }}
            >
              Run
            </button>
          </div>
        </div>
      )
    } else {
      return <div></div>
    }
  }
})

module.exports = TasksConfigurationSection
