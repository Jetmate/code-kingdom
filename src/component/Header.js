import React from 'react'

import { styleSheet, colors } from 'src/style'
import { isAuthenticated, logout, login } from 'src/auth'

const rules = styleSheet({
  'header': {
    backgroundColor: colors.black[1],
    '& *': {
      display: 'inline-block'
    },
    '& button': {
      // float: 'right',
      margin: 10,
    }
  }
})
export default class Header extends React.Component {
  render () {
    return (
      <div {...this.props} {...rules.header}>
        <button onClick={this.authenticate}><span>
          {isAuthenticated ? 'log out' : 'log in'}
        </span></button>
      </div>
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
