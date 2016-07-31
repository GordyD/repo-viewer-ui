import { render } from 'react-dom'
import React from 'react'

import App from './containers/App'

import './main.styl'

// Render our UI into the app element in index.html
render(
  <App />,
  document.getElementById('app')
)
