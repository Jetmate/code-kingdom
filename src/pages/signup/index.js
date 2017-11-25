import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Center from 'src/component/Center'
import { styleSheet, colors } from 'src/style'

const rules = styleSheet({
  panel: {
    backgroundColor: colors.black[0],
  },
  error: {
    border: '2px solid ' + colors.red[1],
    color: colors.red[1],
    textAlign: 'center',
    paddingBottom: 3,
    fontWeight: 'bold',
  }
})

@graphql(gql`
mutation EditUser($username: String!, $bio: String!) {
  editUser(username: $username, bio: $bio) {
    id
  }
}
`)
export default class Signup extends React.Component {
  state = {
    data: {
      username: '',
      bio: '',
    },
    error: '',
  }

  render () {
    return (
      <Center {...rules.panel}>
        <input
          value={this.state.username}
          onChange={event => this.setState({ data: { ...this.state.data, username: event.target.value } })}
          placeholder='username'
        />
        <input
          value={this.state.username}
          onChange={event => this.setState({ data: { ...this.state.data, bio: event.target.value } })}
          placeholder='bio'
        />

        <button onClick={this.mutate}><span>done?</span></button>

        {this.state.error &&
          <p {...rules.error}>{this.state.error}</p>
        }
      </Center>
    )
  }

  mutate = async () => {
    try {
      await this.props.mutate({ variables: this.state.data })
      this.props.history.push('/home')
    } catch (e) {
      this.setState({ error: e.message.substr(15) })
    }
  }
}
