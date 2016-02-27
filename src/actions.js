import * as S from './reducers/spaces'

export const LOGIN  = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const FLASH_WARNING = 'FLASH_WARNING'

export const FETCH_STARTED  = 'FETCH_STARTED'
export const FETCH_COMPLETE = 'FETCH_COMPLETE'
export const FETCH_FAILED   = 'FETCH_FAILED'

export const FETCH_SPACES    = 'FETCH_SPACES'
export const FETCH_SPACE     = 'FETCH_SPACE'
export const FETCH_TRAIT_MAP = 'FETCH_TRAIT_MAP'

export const SELECT_SPACE = 'SELECT_SPACE'
export const SEARCH       = 'SEARCH/CHANGE'

const fetchStarted  = (type)        => ({ type,        state: FETCH_STARTED  })
const fetchComplete = (type, data)  => ({ type, data,  state: FETCH_COMPLETE })
const fetchFailed   = (type, error) => ({ type, error, state: FETCH_FAILED   })

export function warn(message) {
    return { type: FLASH_WARNING, message }
}

export function search(q) {
    return { type: SEARCH, q }
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

const fetcher = (type) => {
    return (url) => {
        return dispatch => {
            dispatch(fetchStarted(type))
            return fetch(`${root}${url}`)
                .then(req => req.json())
                .then(json => dispatch(fetchComplete(type, json)))
                .catch((e) => dispatch(fetchFailed(type, e)))
        }
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

const fetchSpacePage = (n) => {
    return fetcher(FETCH_SPACES)(`/spaces?page=${n || 1}&per_page=10`)
}

const fetchSpace = (id) => {
    return fetcher(FETCH_SPACE)(`/spaces/${id}`)
}

export function fetchTraitMap() {
    return fetcher(FETCH_TRAIT_MAP)('/universe')
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
