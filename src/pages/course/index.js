import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Header from 'src/component/Header'
import Center from 'src/component/Center'

@graphql(gql`
query TitleCourse($title: String!) {
  titleCourse(title: $title) {
    _id
    title
    language
    creator
    # lessons
  }
}
`, {
    options: ({ match: { params } }) => ({ variables: { title: params.course } })
  }
)
export default class Course extends React.Component {
  render () {
    const { data, data: { titleCourse } } = this.props

    console.log(this.props)

    if (data.loading) {
      return <div>Loading!</div>
    } else if (this.props.data.error) {
      return <div>Error!</div>
    }

    return (
      <div>
        <Header />
        <Center>
          <h1>{ titleCourse.title }</h1>
          <h2>{ titleCourse.creator }</h2>
          <p>{ titleCourse.language }</p>
        </Center>
      </div>
    )
  }
}
