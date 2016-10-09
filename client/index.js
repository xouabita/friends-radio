import ReactDOM from 'react-dom'
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import App from './App.js'

const rootEl = document.getElementById('root')
ReactDOM.render(<AppContainer><App /></AppContainer>, rootEl)

if (module.hot) {
  module.hot.accept('./App.js', () => {
    const NextApp = require('./App').default
    ReactDOM.render(<AppContainer><NextApp /></AppContainer>, rootEl)
  })
}
