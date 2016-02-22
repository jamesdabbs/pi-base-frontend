import React from 'react'
import { reduxForm } from 'redux-form'

const URL = "http://localhost:8081" // FIXME

const client_url = () => {
    if (location) {
        return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
    }
}

const submit = (values, dispatch) => {
    return fetch(
        `${URL}/login?email=${encodeURIComponent(values.email)}&client_url=${encodeURIComponent(client_url())}`,
        { method: 'POST' })
        .then(req  => req.json())
        .then(json => dispatch(storeToken(json.user, json.token)))
}

const Login = ({fields: {email}, error, handleSubmit}) => (
    <form onSubmit={handleSubmit(submit)}>
        {error && <div>{error}</div>}
        <input type="email" placeholder="Email" className="form-control" {...email} />
        <input type="submit" value="Login" className="btn btn-primary" />
    </form>
)

export default reduxForm({
    form: 'login',
    fields: ['email']
})(Login)
