'use strict'

let React = require('react')

let Gravatar = require('react-gravatar')

let packageJson = require('../../../../package')
let repoURL = packageJson.repository.url

let changesLink = repoURL + '#' + packageJson.version.replace(/\./g, '')

let AboutScreen = React.createClass({
  render () {
    return (
      <div className='text-center'>
        <h1>About</h1>

        <p>
          Le serf version <a href={changesLink} target='_blank'>{packageJson.version}</a>.
        </p>

        <p>
          <Gravatar
            email='onevasari@gmail.com'
            size={200}
            className='img-circle'
            http={window.location.protocol === 'http:'}
            https={window.location.protocol === 'https:'}
          />
        </p>

        <p>
          Le serf is an <a target='_blank' href={repoURL}>open source</a> creation by <a target='_blank' href='http://github.com/1vasari'>1vasari</a>.
        </p>
      </div>
    )
  }
})

module.exports = AboutScreen
