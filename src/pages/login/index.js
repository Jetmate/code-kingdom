import React from 'react'

import { authenticated, login, logout } from 'src/auth'
import Center from 'src/component/center'
import { styleSheet, colors } from 'src/style'

const rules = styleSheet({
  panel: {
    backgroundColor: colors.black[0],
    '& h1': {
      fontSize: 40,
      marginBottom: 0,
    },
    '& h2': {
      fontSize: 15,
      marginBottom: 25,
    },
    '& h1, & h2': {
      color: colors.white[0],
    },
    '& button': {
      color: colors.black[0],
      fontSize: 20,
      fontWeight: 'bold',
    }
  },
  row: {
    display: 'flex',
  }
})

export default class Login extends React.Component {
  render () {
    const isAuthenticated = authenticated()
    return (
      <Center {...rules.panel}>
        <h1>code.buzz</h1>
        <h2>awesome, community-powered coding courses</h2>
        <div {...rules.row}>
          <button
            onClick={isAuthenticated ? logout : login}
          >
            <span>{isAuthenticated ? 'log out' : 'log in'}</span>
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
}
