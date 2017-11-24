import React from 'react'

export default class Login extends React.Component {
  render () {
    const { isAuthenticated, login, logout } = this.props.auth
    return (
      <div>
        <button
          onClick={isAuthenticated() ? logout : login}
        >
          {isAuthenticated() ? 'Log out' : 'Log in'}
        </button>
      </div>
    )
  }
}
