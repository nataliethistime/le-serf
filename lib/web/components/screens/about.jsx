'use strict'

let React = require('react')

let packageJson = require('../../../../package')

let AboutScreen = React.createClass({
  render () {
    return (
      <div className='text-center'>
        <h1>About</h1>

        <p>
          Le serf version <u>{packageJson.version}</u>.
        </p>

        <p>
          <img
            src='http://i.imgur.com/iGC03h8.jpg'
            alt='My weird face'
            className='img-circle'
            width='157.5'
            height='210'
          ></img>
        </p>

        <p>
          Le serf is an <a target='_blank' href='https://github.com/le-serf/le-serf'>open source</a> creation by <a target='_blank' href='http://github.com/1vasari'>1vasari</a>.
        </p>
      </div>
    )
  }
})

module.exports = AboutScreen
