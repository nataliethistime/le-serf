'use strict'

let React = require('react')

let Checkbox = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.node,
      React.PropTypes.undefined
    ])
  },

  getDefaultProps () {
    return {
      label: '',
      description: '',
      children: ''
    }
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
    if (!this.state.checked && this.props.children) {
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
              {this.props.label}
            </label>
            <span className='help-block'>
              {this.props.description}
            </span>
          </div>
        </div>

        {this.getOptionalContent()}
      </div>
    )
  }
})

module.exports = Checkbox
