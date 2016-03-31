import React, { Componenent } from 'react'
import ReactDOM from 'react-dom'

const Tex = React.createClass({
    componentDidMount:  function() { this.queue() },
    componentDidUpdate: function() { this.queue() },
    queue: function() {
        const node = ReactDOM.findDOMNode(this)
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, node])
    },
    render: function() {
        return <div>{this.props.children}</div>
    }
})

export default Tex
