import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
query {
  allCourses {
    name
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

    return (
      <div>
        {this.props.data.allCourses.map(course =>
          <div key={course.name}>
            {course.name}
          </div>
        )}
      </div>
    )
  }
}
