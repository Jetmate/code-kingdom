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
  uri: 'http://127.0.0.1:3000/graphql',
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

function modifyName(name) {
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
          ... on QuizSlide {
            questions {
              title
              answers {
                title
                correct
              }
            }
          }
          ... on InstructionSlide {
            description
            hint
            code
            correctOutput
          }
          ... on ProjectSlide {
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
  `,
  lesson: `
    fragment lesson on Lesson {
      _id
      title
      slides {
        _id
        title
        ... on QuizSlide {
          questions {
            title
            answers {
              title
              correct
            }
          }
        }
        ... on InstructionSlide {
          description
          hint
          code
          correctOutput
        }
        ... on ProjectSlide {
          description
          code
        }
      }
    }
  `,
  slide: `
    fragment slide on Slide {
      _id
      title
      ... on QuizSlide {
        questions {
          title
          answers {
            title
            correct
          }
        }
      }
      ... on InstructionSlide {
        description
        hint
        code
        correctOutput
      }
      ... on ProjectSlide {
        description
        code
      }
    }
  `
}

let query, mutation, variables, courseId, lessonId, slideId

beforeEach(async () => {
  variables = {}
  query = ''
  mutation = ''
})

const run = async () => {
  if (query) return client.query({ query: gql(query), variables })
  else if (mutation) return client.mutate({ mutation: gql(mutation), variables })
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
  const result = await run()
  courseId = result.data.titleCourse._id
})

test('course', async () => {
  query = `
    query($id: ID!) {
      course(id: $id) {
        ...course
      }
    }
  ` + fragments.course
  variables = { id: courseId }
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
  variables = { id: courseId, input: { title: modifyName(tokenSecret.course.title) } }
  return run()
})

suite('Lesson')

test('createLesson', async () => {
  mutation = `
    mutation($course: ID!, $input: createLessonInput!) {
      createLesson(course: $course, input: $input) {
        ...lesson
      }
    }
  ` + fragments.lesson
  variables = { course: courseId, input: { title: tokenSecret.lesson.title } }
  return run()
})

test('titleLesson', async () => {
  query = `
    query($course: ID!, $title: String!) {
      titleLesson(course: $course, title: $title) {
        ...lesson
      }
    }
  ` + fragments.lesson
  variables = { title: tokenSecret.lesson.title, course: courseId }
  const result = await run()
  lessonId = result.data.titleLesson._id
})

test('lesson', async () => {
  query = `
    query($id: ID!, $course: ID!) {
      lesson(id: $id, course: $course) {
        ...lesson
      }
    }
  ` + fragments.lesson
  variables = { id: lessonId, course: courseId }
  return run()
})

test('editLesson', async () => {
  mutation = `
    mutation($id: ID!, $course: ID!, $input: editLessonInput!) {
      editLesson(id: $id, course: $course, input: $input) {
        ...result
      }
    }
  ` + fragments.result
  variables = { id: lessonId, course: courseId, input: { title: modifyName(tokenSecret.lesson.title) } }
  return run()
})

suite('Slide')

const querySlide = async () => {
  query = `
      query($id: ID!, $lesson: ID!, $course: ID!) {
        slide(id: $id, lesson: $lesson, course: $course) {
          ...slide
        }
      }
    ` + fragments.slide
  variables = { id: slideId, lesson: lessonId, course: courseId }
  await run()
}

const deleteSlide = async () => {
  mutation = `
      mutation($id: ID!, $lesson: ID!, $course: ID!) {
        deleteSlide(id: $id, lesson: $lesson, course: $course) {
          ...result
        }
      }
    ` + fragments.result
  variables = { id: slideId, lesson: lessonId, course: courseId }
  await run()
}

const editSlide = (name) => {
  return async () => {
    mutation = `
      mutation($id: ID!, $lesson: ID!, $course: ID!, $input: ${name}Input!) {
        ${name}(id: $id, lesson: $lesson, course: $course, input: $input) {
          ...result
        }
      }
    ` + fragments.result
    variables = {
      id: slideId,
      lesson: lessonId,
      course: courseId,
      input: {
        title: modifyName(tokenSecret.slide.title),
      }
    }
    await run()
  }
}

test('createQuizSlide', async () => {
  mutation = `
    mutation($lesson: ID!, $course: ID!, $input: createQuizSlideInput!) {
      createQuizSlide(lesson: $lesson, course: $course, input: $input) {
        ...slide
      }
    }
  ` + fragments.slide
  variables = {
    lesson: lessonId,
    course: courseId,
    input: {
      title: tokenSecret.slide.title,
      questions: tokenSecret.slide.questions,
    }
  }
  const result = await run()
  slideId = result.data.createQuizSlide._id
})

test('quizSlide', querySlide)
test('editQuizSlide', editSlide('editQuizSlide'))
test('deleteQuizSlide', deleteSlide)

test('createInstructionSlide', async () => {
  mutation = `
    mutation($lesson: ID!, $course: ID!, $input: createInstructionSlideInput!) {
      createInstructionSlide(lesson: $lesson, course: $course, input: $input) {
        ...slide
      }
    }
  ` + fragments.slide
  variables = {
    lesson: lessonId,
    course: courseId,
    input: {
      title: tokenSecret.slide.title,
      description: tokenSecret.slide.description,
      hint: tokenSecret.slide.hint,
      code: tokenSecret.slide.code,
      correctOutput: tokenSecret.slide.correctOutput,
    }
  }
  const result = await run()
  slideId = result.data.createInstructionSlide._id
})

test('editInstructionSlide', editSlide('editInstructionSlide'))
test('instructionSlide', querySlide)
test('deleteInstructionSlide', deleteSlide)

test('createProjectSlide', async () => {
  mutation = `
    mutation($lesson: ID!, $course: ID!, $input: createProjectSlideInput!) {
      createProjectSlide(lesson: $lesson, course: $course, input: $input) {
        ...slide
      }
    }
  ` + fragments.slide
  variables = {
    lesson: lessonId,
    course: courseId,
    input: {
      title: tokenSecret.slide.title,
      description: tokenSecret.slide.description,
      code: tokenSecret.slide.code,
    }
  }
  const result = await run()
  slideId = result.data.createProjectSlide._id
})

test('editProjectSlide', editSlide('editProjectSlide'))
test('projectSlide', querySlide)
test('deleteProjectSlide', deleteSlide)

suite('Cleanup')

test('deleteLesson', async () => {
  mutation = `
    mutation($id: ID!, $course: ID!) {
      deleteLesson(id: $id, course: $course) {
        ...result
      }
    }
  ` + fragments.result
  variables = { id: lessonId, course: courseId }
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
  variables = { id: courseId }
  return run()
})

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
