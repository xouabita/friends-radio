import {render} from 'react-dom'
import React from 'react'
import App from './App.js'

import 'bootstrap/dist/css/bootstrap.css'

const rootEl = document.getElementById('root')
render(<App/>, rootEl)

if (module.hot) {
  module.hot.accept()
}
