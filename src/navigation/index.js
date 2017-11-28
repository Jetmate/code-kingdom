import React from 'react'
import { Router } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

import { InMemoryCache } from 'apollo-cache-inmemory'

import Routes from './Routes'
import history from './history'


const httpLink = createHttpLink({
  uri: 'http://0.0.0.0:3000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})


export default function Navigation () {
  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    </Router>
  )
}
