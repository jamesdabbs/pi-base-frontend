export const LOGIN                     = 'LOGIN'
export const LOGOUT                    = 'LOGOUT'
export const CREATE_SPACE              = 'CREATE_SPACE'
export const REQUEST_PROPERTIES        = 'REQUEST_PROPERTIES'
export const RECEIVE_PROPERTIES        = 'RECEIVE_PROPERTIES'
export const RECEIVE_PROPERTIES_FAILED = 'RECEIVE_PROPERTIES_FAILED'
export const REQUEST_SPACES        = 'REQUEST_SPACES'
export const RECEIVE_SPACES        = 'RECEIVE_SPACES'
export const RECEIVE_SPACES_FAILED = 'RECEIVE_SPACES_FAILED'

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

export function requestSpaces() {
    return { type: REQUEST_SPACES }
}

export function receiveSpaces(spaces) {
    return { type: RECEIVE_SPACES, spaces }
}

export function receiveSpacesFailed(spaces) {
    return { type: RECEIVE_SPACES_FAILED, spaces }
}

// TODO: custom get / post / ... functions with host, tokens, &c

const root = "http://localhost:8081"

const requestWithToken = (endpoint, token, opts={}) => {
    opts.headers = new Headers({
        'Content-Type':  'application/json',
        'Authorization': `bearer ${token}`
    })
    return fetch(`${root}${endpoint}`, opts).then(r => r.json())
}

export function loginWithToken(token) {
    return dispatch => {
        return requestWithToken('/auth', token).
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
        return requestWithToken('/logout', { method: 'DELETE' })
    }
}

const shouldFetchProperties = (state) => {
    return true
}

const fetchProperties = () => {
    return dispatch => {
        dispatch(requestProperties())
        return fetch(`${root}/properties`)
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

const fetchSpacePage = (n) => {
    return dispatch => {
        dispatch(requestSpaces())
        return fetch(`${root}/spaces?page=${n || 1}&per_page=10`)
            .then(req => req.json())
            .then(json => dispatch(receiveSpaces(json)))
            .catch((e) => dispatch(receiveSpacesFailed()))
    }
}

const shouldFetchSpaces = (n, state) => (state.page !== n)

export function syncSpacePage(n) {
    return (dispatch, getState) => {
        if (shouldFetchSpaces(n, getState().spaces)) {
            return dispatch(fetchSpacePage(n))
        }
    }
}
