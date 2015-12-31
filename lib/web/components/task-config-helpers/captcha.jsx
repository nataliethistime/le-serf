'use strict'

let React = require('react')
let Reflux = require('reflux')

let CaptchaActions = require('../../actions/captcha')

let CaptchaStore = require('../../stores/captcha')

let Captcha = React.createClass({
  mixins: [
    Reflux.connect(CaptchaStore, 'captcha')
  ],

  getInitialState () {
    return {
      loading: false,
      displayUrl: ''
    }
  },

  componentDidMount () {
    CaptchaActions.clear.listen(() => {
      this.setState(this.getInitialState())
    })

    CaptchaActions.load.listen(() => {
      this.setState({
        loading: true
      })
    })
  },

  componentDidUpdate (prevProps, prevState) {
    if (prevState.captcha.url !== this.state.captcha.url) {
      let img = new window.Image()
      img.src = this.state.captcha.url
      img.onLoad = this.handleCaptchaLoaded()
    }
  },

  handleLoad () {
    CaptchaActions.load()
  },

  handleCaptchaLoaded () {
    this.setState({
      displayUrl: this.state.captcha.url,
      loading: false
    })
  },

  handleSolve (answer) {
    CaptchaActions.solve(this.state.captcha.guid, answer)
  },

  handleEnterKey (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleSolve(this.refs.answer.value)
    }
  },

  onSolveClick (event) {
    event.preventDefault()
    this.handleSolve(this.refs.answer.value)
  },

  onLoadClick (event) {
    event.preventDefault()
    this.handleLoad()
  },

  onRefreshClick (event) {
    event.preventDefault()
    CaptchaActions.refresh()
  },

  getCenterContent () {
    let centerCenterStyle = {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      textAlign: 'center',
      display: 'block'
    }

    if (this.state.captcha.solved) {
      return (
        <div style={centerCenterStyle}>
          <h1 style={{color: 'green'}}>
            Good to Go!
          </h1>
        </div>
      )
    }

    if (this.state.loading) {
      return (
        <div style={centerCenterStyle}>
          <div className='pong-loader'>
            Loading...
          </div>
        </div>
      )
    }

    if (!this.state.displayUrl && !this.state.loading) {
      return (
        <div style={centerCenterStyle}>
          <div className='btn btn-success' onClick={this.onLoadClick}>
            Load Captcha
          </div>
        </div>
      )
    }

    return ''
  },

  getCaptchaURL () {
    if (this.state.displayUrl && !this.state.captcha.solved) {
      return `url(${this.state.displayUrl})`
    } else {
      return ''
    }
  },

  render () {
    return (
      <div>

        <div style={{
          width: 300,
          height: 80,
          backgroundImage: this.getCaptchaURL()
        }}>
          {this.getCenterContent()}
        </div>

        <div className='form-inline'>
          <input
            type='text'
            className='form-control'
            ref='answer'
            onKeyDown={this.handleEnterKey}
            placeholder='Captcha Solution'
            style={{
              width: 150
            }}
          >
          </input>

          <div className='btn btn-default' onClick={this.onRefreshClick}>
            Refresh
          </div>

          <div className='btn btn-primary' onClick={this.onSolveClick}>
            Submit
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Captcha
