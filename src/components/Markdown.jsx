import React from 'react'
import marked from 'marked'

const rawMarkup = (text) => {
    return { __html: marked(text, {sanitize: true}) }
}

const Markdown = ({ text }) => {
    return <div dangerouslySetInnerHTML={rawMarkup(text)}/>
}

export default Markdown
