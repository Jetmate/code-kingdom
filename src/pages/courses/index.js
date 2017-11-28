import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Header from 'src/component/Header'
import Center from 'src/component/Center'


function removeWhitespace (string) {
  string = string.split('')
  string.forEach((char, i) => {
    if (/\s/.test(char)) {
      string[i] = '-'
    }
  })
  return string.join('')
}

@graphql(gql`
query {
  courses {
    title
  }
}
`)
export default class Courses extends React.Component {
  render () {
    if (this.props.data.loading) {
      return <div>Loading!</div>
    } else if (this.props.data.error) {
      return <div>Error!</div>
    }
    console.log(this.props.data.courses)

    return (
      <div>
        <Header />
        <Center>
          <h1>all courses</h1>
          {this.props.data.courses.map(course =>
            <button key={course.title} onClick={() => this.selectCourse(course)}>
              {course.title}
            </button>
          )}
        </Center>
      </div>
    )
  }

  selectCourse = (course) => {
    this.props.history.push('/courses/' + removeWhitespace(course.title))
  }
}
