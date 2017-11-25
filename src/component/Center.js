import React from 'react'

import { align, styleSheet } from 'src/style'

const rules = styleSheet({
  outer: {
    ...align.verticalCenter,
    height: '100%',
  },
  inner: {
    ...align.horizontalCenter,
  },
})

export default class Center extends React.Component {
  render () {
    const { children, ...other } = this.props
    return (
      <div {...rules.outer} {...other}>
        <div {...rules.inner}>{children}</div>
      </div>
    )
  }
}
