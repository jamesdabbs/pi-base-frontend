import React from 'react'

export default ({message}) => {
    message = message || 'Loading ...'
    return <p>{message}</p>
}
