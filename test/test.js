import 'babel-polyfill'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import gql from 'graphql-tag'

/* eslint-env mocha */

const TOKEN = 'ya29.GlwSBVZibUITeAuDvo8kDCQLMJVL0U_Hj8AC2VjCEuF0NNJUWSDnlHzPhBYPvUYilLI_YJE3DdCnPgPNm7L3xpLHVd34MFZ2gPOhBwS8vlbbyBu01bbtG23W1fVwAw'

const httpLink = createHttpLink({
  uri: 'http://0.0.0.0:3000/graphql',
  fetch: fetch,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${TOKEN}`,
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})


const fragments = {
  user: `
    fragment user on User {
      _id
      username
      bio
      courses {
        type
        course {
          _id
          title
          language
          creator {
            _id
            username
            bio
          }
        }
      }
    }
  `,
  course: `
   fragment course on Course {
      _id
      title
      language
      creator {
        _id
        username
        bio
        courses {
          type
          course {
            _id
            title
            language
          }
        }
      }
      lessons {
        _id
        title
        slides {
          _id
          title
          ... on Quiz {
            questions {
              title
              answers {
                title
                correct
              }
            }
          }
          ... on Instruction {
            description
            hint
            code
            correctOutput
          }
          ... on Project {
            description
            code
          }
        }
      }
    }
  `
}

let query, mutation, variables

beforeEach(async () => {
  variables = {}
})


suite('Query')

beforeEach(async () => {
  query = ''
})

afterEach(async () => {
  await client.query({ query: gql(query), variables })
})

test('user', async () => {
  query = `
    query($id: ID!) {
      user(id: $id) {
        ...user
      }
    }
  ` + fragments.user
  variables = { id: '105342380724738854881' }
})

test('users', async () => {
  query = `
    query {
      users {
        ...user
      }
    }
  ` + fragments.user
})


test('course', async () => {
  query = `
    query($id: ID!) {
      course(id: $id) {
        ...course
      }
    }
  ` + fragments.course
  variables = { id: '5a1decd758ec4d6452eb2b72' }
})

test('courses', async () => {
  query = `
    query {
      courses {
        ...course
      }
    }
  ` + fragments.course
})

test('titleCourse', async () => {
  query = `
    query($title: String!) {
      titleCourse(title: $title) {
        ...course
      }
    }
  ` + fragments.course
  variables = { title: 'best course ndod' }
})

// test('user', async () => {
//   await client.query({
//     query: gql`
//         query($id: ID!) {
//           user(id: $id) {
//             _id
//           }
//         }
//       `,
//     variables: { id: '105342380724738854881' }
//   })
// })
// await client.mutate({
//   mutation: gql`
//       mutation CreateUser($input: createUserInput!) {
//         createUser(input: $input) {
//           _id
//         }
//       }
//     `,
//   variables: { input: { username: auth.email.split('@')[0] } }
// })

suite('Mutation')

beforeEach(async () => {
  mutation = ''
})

afterEach(async () => {
  await client.mutate({ mutation: gql(mutation), variables })
})
