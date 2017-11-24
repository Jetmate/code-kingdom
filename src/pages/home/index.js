import React from 'react'
// import { graphql, gql } from 'react-apollo'

// @graphql(gql`
// query {
//   allCourses {
//     name
//   }
// }
// `)
export default class Home extends React.Component {
  render () {
    if (this.props.data.loading) {
      return <div>Loading!</div>
    } else if (this.props.data.error) {
      return <div>Error!</div>
    }

    return (
      <div>

      </div>
    )
  }
}
