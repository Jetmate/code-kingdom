import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import * as pages from '../pages'
import Auth from './Auth'

const auth = new Auth()

function handleAuthentication (nextState, replace) {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication()
  }
}

function PropRoute ({ component: Component, props, ...rest }) {
  return (
    <Route render={otherProps => <Component {...props} {...otherProps} />} {...rest} />
  )
}

function ProtectedRoute ({ props, ...rest }) {
  if (props.auth.isAuthenticated()) {
    return <PropRoute props={props} {...rest} />
  } else {
    return <Redirect to='/' />
  }
}

export default function Routes () {
  console.log('routes')
  return (
    <Switch>
      <PropRoute path='/' exact component={pages.Login} props={{ auth }} />
      <ProtectedRoute path='/home' component={pages.Home} props={{ auth }} />
      <Route path='/callback' render={(props) => {
        console.log(props)
        handleAuthentication(props)
        return <pages.Callback {...props} />
      }} />
    </Switch>
  )
}
