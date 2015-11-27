'use strict'

let React = require('react')
let _ = require('lodash')
let $ = window.jQuery

let tasks = require('../../../../lib/tasks').getTasksForPlatform('web')

let taskConfigs = require('../task-configs')

let RunnerActions = require('../../actions/runner')

let Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      task: {
        name: '',
        title: '',
        description: ''
      }
    }
  },

  handleShow () {
    $(this.refs.modal).modal('show')
  },

  handleHide () {
    $(this.refs.modal).modal('hide')
  },

  handleButtonClick () {
    if (this.needsConfiguration()) {
      this.handleShow()
    } else {
      this.handleTaskRun()
    }
  },

  handleTaskRun () {
    let taskName = this.props.task.name
    let taskOptions = {}

    if (this.needsConfiguration()) {
      taskOptions = this.refs.config.getOptions()
      this.handleHide()
    }

    RunnerActions.runTask(taskName, taskOptions)
  },

  needsConfiguration () {
    if (taskConfigs[this.props.task.name]) {
      return true
    } else {
      return false
    }
  },

  render () {
    let ConfigComponent = taskConfigs[this.props.task.name]

    return (
      <div>
        <p>
          <strong>
            {this.props.task.title}
          </strong>: {
            this.props.task.description
          } <a onClick={this.handleButtonClick} style={{cursor: 'pointer'}}>
            {this.needsConfiguration() ? 'Configure & Run' : 'Run'}
          </a>
        </p>

        {
          this.needsConfiguration()
            ? (
              <div
                className='modal fade'
                ref='modal'
                tabIndex='-1'
                role='dialog'>
                <div className='modal-dialog'>
                  <div className='modal-content'>

                    <div className='modal-header'>
                      <button
                        onClick={this.handleHide}
                        type='button'
                        className='close'>
                        <span>&times;</span>
                    </button>
                      <h4>{this.props.task.title}</h4>
                    </div>

                    <div className='modal-body'>
                      {
                        ConfigComponent
                        ? <ConfigComponent ref='config' />
                        : ''
                      }
                    </div>

                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn btn-default'
                        onClick={this.handleHide}>
                        Close
                      </button>

                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this.handleTaskRun}>
                        Run
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : ''
        }
      </div>
    )
  }
})

let TasksSection = React.createClass({
  render () {
    let tasksList = _.map(tasks, (task) => {
      return (
        <Task task={task} key={task.name} />
      )
    })

    return (
      <div>
        <h1 className='text-center'>Tasks</h1>
        <div>{tasksList}</div>
      </div>
    )
  }
})

module.exports = TasksSection
