import React from 'react'
import MonacoEditor from 'react-monaco-editor'

import { styleSheet } from 'src/style'

const rules = styleSheet({
  row: {
    display: 'flex',
  },
  instructions: {
    flex: '0 0 30%',
    margin: 20,
  }
})

export default class Lesson extends React.Component {
  state = { code: 'code goes here', hintShowed: false }

  constructor (props) {
    super(props)

    window.addEventListener('resize', this.state.forceUpdate)
  }

  render () {
    return (
      <div {...rules.row}>
        <div {...rules.instructions}>
          <h1>title</h1>
          <p>description</p>
          {
            this.state.hintShowed ? (
              <p>hint</p>
            ) : (
              <button onClick={() => this.setState({ hintShowed: true })}><span>show hint?</span></button>
            )
          }
        </div>
        <MonacoEditor
          {...rules.editor}
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={this.state.code}
          onChange={code => this.setState({ code })}
        />
      </div>
    )
  }
}
