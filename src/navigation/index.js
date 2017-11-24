import React from 'react'
import { Router } from 'react-router-dom'

import Routes from './Routes'
import history from './history'

export default function Navigation () {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  )
}
