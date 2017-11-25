import React from 'react'

import { isAuthenticated, login, logout } from 'src/auth'
import Center from 'src/component/Center'
import { styleSheet, colors } from 'src/style'

const rules = styleSheet({
  panel: {
    backgroundColor: colors.black[0],
    '& h1': {
      marginBottom: 0,
    },
    '& h2': {
      marginBottom: 25,
    },
    '& h1, & h2': {
      color: colors.white[0],
    },
  },
  row: {
    display: 'flex',
  }
})

export default class Login extends React.Component {
  render () {
    return (
      <Center {...rules.panel}>
        <h1>code.buzz</h1>
        <h2>awesome, community-powered coding courses</h2>
        <div {...rules.row}>
          <button
            onClick={this.authenticate}
          >
            <span>{isAuthenticated() ? 'log out' : 'log in'}</span>
          </button>
          <button
            onClick={() => this.props.history.push('/courses')}
          >
            <span>browse</span>
          </button>
        </div>
      </Center>
    )
  }

  authenticate = () => {
    if (isAuthenticated()) {
      logout()
      this.forceUpdate()
    } else {
      login()
    }
  }
}
