import React from 'react'
import { connect } from 'react-redux'

const Space = (space) => (
    <div>
        <p>Space!</p>
    </div>
)

const Spaces = ({ spacePage }) => (
  <div>
      <h1>Spaces</h1>
      {spacePage.spaces.map(space => <Space key={space.id} {...space}/>)}
  </div>
)

export default connect(
    (state) => ({
        spacePage: state.spaces
    }),
    (dispatch) => ({
        page: () => { console.log("setting page") }
    })
)(Spaces)
