'use strict'

let React = require('react')

let DryRunCheckbox = React.createClass({

  propTypes: {
    children: React.PropTypes.element
  },

  getInitialState () {
    return {
      checked: false
    }
  },

  toggle () {
    this.setState({
      checked: !this.state.checked
    })
  },

  isChecked () {
    return this.state.checked
  },

  getOptionalContent () {
    if (!this.state.checked) {
      return (
        <div className='form-group'>
          {this.props.children}
        </div>
      )
    } else {
      return ''
    }
  },

  render () {
    return (
      <div>
        <div className='form-group'>
          <div className='checkbox'>
            <label>
              <input
                type='checkbox'
                checked={this.state.checked}
                onChange={this.toggle}
                >
              </input>
              Dry run
            </label>
            <span className='help-block'>
              Runs the task and shows what would happen without actually changing anything.
            </span>
          </div>
        </div>

        {this.getOptionalContent()}
      </div>
    )
  }
})

module.exports = DryRunCheckbox
