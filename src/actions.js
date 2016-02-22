export const LOGIN                     = 'LOGIN'
export const LOGOUT                    = 'LOGOUT'
export const CREATE_SPACE              = 'CREATE_SPACE'
export const REQUEST_PROPERTIES        = 'REQUEST_PROPERTIES'
export const RECEIVE_PROPERTIES        = 'RECEIVE_PROPERTIES'
export const RECEIVE_PROPERTIES_FAILED = 'RECEIVE_PROPERTIES_FAILED'

export function createSpace(title, description) {
    return { type: CREATE_SPACE, title, description }
}

export function requestProperties() {
    return { type: REQUEST_PROPERTIES }
}

export function receiveProperties(properties) {
    return { type: RECEIVE_PROPERTIES, properties }
}

export function receivePropertiesFailed(properties) {
    return { type: RECEIVE_PROPERTIES_FAILED, properties }
}

// TODO: custom get / post / ... functions with host, tokens, &c

export function loginWithToken(token) {
    const headers = new Headers({
        'Content-Type':  'application/json',
        'Authorization': `bearer ${token}`
    })

    return dispatch => {
        return fetch(`${URL}/auth`, {headers: headers}).
            then(req => req.json()).
            then(user => {
                if (localStorage) { localStorage.setItem("pi-base-session-token", token) }
                dispatch({type: LOGIN, user, token})
            })
    }
}

export function logout(token) {
    return (dispatch, getState) => {
        if (localStorage) { localStorage.removeItem("pi-base-session-token") }
        const { token } = getState()

        dispatch({ type: LOGOUT })
        const headers = new Headers({
            'Content-Type':  'application/json',
            'Authorization': `bearer ${token}`
        })
        return fetch(`${URL}/logout`, {headers: headers, method: 'DELETE'})
    }
}

const shouldFetchProperties = (state) => {
    return true
}

const URL = "http://localhost:8081"

const fetchProperties = () => {
    return dispatch => {
        dispatch(requestProperties())
        return fetch(`${URL}/properties`)
                     .then(req => req.json())
                     .then(json => dispatch(receiveProperties(json)))
                     .catch((e) => dispatch(receivePropertiesFailed()))
    }
}

export function refreshProperties() {
    return (dispatch, getState) => {
        if (shouldFetchProperties(getState())) {
            return dispatch(fetchProperties())
        }
    }
}
