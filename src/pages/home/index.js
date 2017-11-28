import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Header from 'src/component/Header'
import Center from 'src/component/Center'

@graphql(gql`
query {
  userCourses(
    id: ${window.localStorage.getItem('_id')}
    status: []
  ) {
    title
  }
}
`)
export default class Home extends React.Component {
  render () {
    if (this.props.data.loading) {
      return <div>Loading!</div>
    } else if (this.props.data.error) {
      return <div>Error!</div>
    }
    console.log('yes', this.props)

    return (
      <div>
        <Header />
        <Center>
          <h1>my courses</h1>
          {this.props.data.userCourses.map(course =>
            <div key={course.name}>
              {course.name}
            </div>
          )}
          <button onClick={() => this.props.history.push('/courses')}>
            <span>new course</span>
          </button>
        </Center>
      </div>
    )
  }
}
