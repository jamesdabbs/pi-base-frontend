import React from 'react';

const LoginBar = ({user, onClick}) => (
    <div>
        <p>{user}</p>
        <a onClick={onClick}>Click to login</a>
    </div>
)

export default LoginBar
