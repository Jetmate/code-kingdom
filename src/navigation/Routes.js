import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import * as pages from '../pages'
import { isAuthenticated, validate } from 'src/auth'

// function PropRoute ({ component: Component, props, ...rest }) {
//   return (
//     <Route render={otherProps => <Component {...props} {...otherProps} />} {...rest} />
//   )
// }

function ProtectedRoute ({ authenticated = true, ...props }) {
  const auth = isAuthenticated()
  if ((authenticated && auth) || (!authenticated && !auth)) {
    return <Route {...props} />
  } else {
    return <Redirect to='/' />
  }
}

export default function Routes (props) {
  console.log(props)
  return (
    <Switch>
      <Route path='/' exact component={pages.Login} />
      <ProtectedRoute path='/signup' component={pages.Signup} />
      <Route path='/oauth2callback' render={props => {
        const params = new URLSearchParams(props.location.hash.substr(1))
        validate(params.get('access_token'))
        return <pages.Loading />
      }} />
      <ProtectedRoute path='/home' component={pages.Home} />
      <Route path='/courses/:course' component={pages.Course} />
      <Route path='/courses' component={pages.Courses} />
      <Route path='/lesson' component={pages.Lesson} />
    </Switch>
  )
}
