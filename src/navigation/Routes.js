import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import * as pages from '../pages'
import { isAuthenticated, validate } from 'src/auth'

// function PropRoute ({ component: Component, props, ...rest }) {
//   return (
//     <Route render={otherProps => <Component {...props} {...otherProps} />} {...rest} />
//   )
// }

function ProtectedRoute ({ authenticated, ...props }) {
  const auth = isAuthenticated()
  if ((authenticated && auth) || (!authenticated && !auth)) {
    return <Route {...props} />
  } else {
    return <Redirect to='/' />
  }
}

export default function Routes () {
  console.log('routes')
  return (
    <Switch>
      <Route path='/' exact component={pages.Login} />
      <ProtectedRoute authenticated path='/signup' component={pages.Signup} />
      <Route path='/oauth2callback' render={props => {
        const params = new URLSearchParams(props.location.hash.substr(1))
        validate(params.get('access_token'))
        return <pages.Loading />
      }} />
      <ProtectedRoute authenticated path='/home' component={pages.Home} />
    </Switch>
  )
}
