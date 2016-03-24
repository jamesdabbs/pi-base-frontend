import * as S from './reducers/spaces'
import * as fetch from './fetch'

export const LOGIN  = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const FLASH_WARNING = 'FLASH_WARNING'

export const SEARCH = 'SEARCH/CHANGE'

export const SELECT_SPACE = 'SELECT_SPACE'


export function warn(message) {
    return { type: FLASH_WARNING, message }
}

export function search(q) {
    return { type: SEARCH, q }
}

export function selectSuggestion(index) {
    return { type: SELECT_SUGGESTION, index }
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
            return fetch.space(spaceId)
        }
    }
}
