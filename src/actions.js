import * as S from './reducers/spaces'

let fetch
if (typeof(fetch) === 'undefined') {
    fetch = require('node-fetch')
}

export const LOGIN  = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const FLASH_WARNING = 'FLASH_WARNING'

export const FETCH_STARTED  = 'FETCH_STARTED'
export const FETCH_COMPLETE = 'FETCH_COMPLETE'
export const FETCH_FAILED   = 'FETCH_FAILED'

export const FETCH_SPACES     = 'FETCH_SPACES'
export const FETCH_PROPERTIES = 'FETCH_PROPERTIES'
export const FETCH_TRAITS     = 'FETCH_TRAITS'
export const FETCH_SPACE      = 'FETCH_SPACE'

export const SEARCH            = 'SEARCH/CHANGE'
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION'

export const SELECT_SPACE      = 'SELECT_SPACE'

export const fetchStarted  = (type)        => ({ type,        state: FETCH_STARTED  })
export const fetchComplete = (type, data)  => ({ type, data,  state: FETCH_COMPLETE })
export const fetchFailed   = (type, error) => ({ type, error, state: FETCH_FAILED   })

export function warn(message) {
    return { type: FLASH_WARNING, message }
}

export function search(q) {
    return { type: SEARCH, q }
}

export function selectSuggestion(index) {
    return { type: SELECT_SUGGESTION, index }
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

const fetcher = (type, url) => {
    return dispatch => {
        dispatch(fetchStarted(type))
        return fetch(`${root}${url}`)
            .then(req => req.json())
            .then(json => dispatch(fetchComplete(type, json)))
            .catch((e) => dispatch(fetchFailed(type, e)))
    }
}

export function handleFetch(state, action, onComplete) {
    switch (action.state) {
    case FETCH_STARTED:
        return state.merge({fetching: true})
    case FETCH_COMPLETE:
        return state.merge({fetching: false}).merge(onComplete(state, action.data))
    case FETCH_FAILED:
        return state.merge({fetching: false})
    }
}

const fetchSpace = (id) => {
    return fetcher(FETCH_SPACE, `/spaces/${id}`)
}

export function fetchSpaces() {
    return fetcher(FETCH_SPACES, '/spaces')
}

export function fetchProperties() {
    return fetcher(FETCH_PROPERTIES, '/properties')
}

export function fetchTraits() {
    return fetcher(FETCH_TRAITS, '/universe')
}


export function syncSpacePage(n) {
    return (dispatch, getState) => {
        if (n !== S.activePage(getState())) {
            return dispatch(fetchSpacePage(n))
        }
    }
}

export function focusSpace(spaceId) {
    spaceId = parseInt(spaceId)
    return (dispatch, getState) => {
        dispatch({ type: SELECT_SPACE, spaceId })
        if (!S.selectedSpace(getState())) {
            return dispatch(fetchSpace(spaceId))
        }
    }
}
