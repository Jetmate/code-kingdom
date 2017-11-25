import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import * as pages from '../pages'
import { authenticated, validate } from 'src/auth'

// function PropRoute ({ component: Component, props, ...rest }) {
//   return (
//     <Route render={otherProps => <Component {...props} {...otherProps} />} {...rest} />
//   )
// }

function ProtectedRoute (props) {
  if (authenticated()) {
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
      <Route path='/signup' component={pages.Signup} />
      <Route path='/oauth2callback' render={props => {
        const params = new URLSearchParams(props.location.hash.substr(1))
        validate(params.get('access_token'))
        return <pages.Loading />
      }} />
      <ProtectedRoute path='/home' component={pages.Home} />
    </Switch>
  )
}
