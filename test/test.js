import 'babel-polyfill'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import gql from 'graphql-tag'

/* eslint-env mocha */

import tokenSecret from './testing_secret.json'

const httpLink = createHttpLink({
  uri: 'http://0.0.0.0:3000/graphql',
  fetch: fetch,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${tokenSecret.token}`,
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function modifyName (name) {
  return name.replace(/.$/, '$')
}

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
  `,
  result: `
    fragment result on Result {
      n
      ok
    }
  `
}

let query, mutation, variables

beforeEach(async () => {
  variables = {}
  query = ''
  mutation = ''
})

const run = async () => {
  if (query) await client.query({ query: gql(query), variables })
  else if (mutation) await client.mutate({ mutation: gql(mutation), variables })
  else throw new Error('must specify query or mutation')
}

suite('User')

test('createUser', async () => {
  mutation = `
    mutation($input: createUserInput!) {
      createUser(input: $input) {
        ...user
      }
    }
  ` + fragments.user
  variables = { input: { username: tokenSecret.user.username } }
  return run()
})

test('user', async () => {
  query = `
    query($id: ID!) {
      user(id: $id) {
        ...user
      }
    }
  ` + fragments.user
  variables = { id: tokenSecret.id }
  return run()
})

test('users', async () => {
  query = `
    query {
      users {
        ...user
      }
    }
  ` + fragments.user
  return run()
})

test('editUser', async () => {
  mutation = `
    mutation($input: editUserInput!) {
      editUser(input: $input) {
        ...result
      }
    }
  ` + fragments.result
  variables = { input: { username: modifyName(tokenSecret.user.username) } }
  return run()
})

suite('Course')

test('createCourse', async () => {
  mutation = `
    mutation($input: createCourseInput!) {
      createCourse(input: $input) {
        ...course
      }
    }
  ` + fragments.course
  variables = { input: { title: tokenSecret.course.title, language: tokenSecret.course.language } }
  return run()
})

test('titleCourse', async () => {
  query = `
    query($title: String!) {
      titleCourse(title: $title) {
        ...course
      }
    }
  ` + fragments.course
  variables = { title: tokenSecret.course.title }
  return run()
})

const getCourseId = async () => {
  return (await client.query({
    query: gql`
      query($title: String!) {
        titleCourse(title: $title) {
          _id
        }
      }
    `,
    variables: { title: tokenSecret.course.title }
  })).data.titleCourse._id
}

test('course', async () => {
  query = `
    query($id: ID!) {
      course(id: $id) {
        ...course
      }
    }
  ` + fragments.course
  variables = { id: await getCourseId() }
  return run()
})

test('courses', async () => {
  query = `
    query {
      courses {
        ...course
      }
    }
  ` + fragments.course
  return run()
})

test('editCourse', async () => {
  mutation = `
    mutation($id: ID!, $input: editCourseInput!) {
      editCourse(id: $id, input: $input) {
        ...result
      }
    }
  ` + fragments.result
  variables = { id: await getCourseId(), input: { title: modifyName(tokenSecret.course.title) } }
  return run()
})

test('deleteCourse', async () => {
  mutation = `
    mutation($id: ID!) {
      deleteCourse(id: $id) {
        ...result
      }
    }
  ` + fragments.result
  variables = { id: await getCourseId() }
  return run()
})

suite('Cleanup')

test('deleteUser', async () => {
  mutation = `
    mutation {
      deleteUser {
        ...result
      }
    }
  ` + fragments.result
  return run()
})
