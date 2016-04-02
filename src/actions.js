import * as T from './queries/traits'

import * as fetch from './fetch'

export const LOGIN  = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const FLASH_WARNING = 'FLASH_WARNING'

export const SEARCH = 'SEARCH/CHANGE'


export function warn(message) {
    return { type: FLASH_WARNING, message }
}

export function search(q) {
    return { type: SEARCH, q }
}

export function loginWithToken(token) {
    return dispatch => {
        return fetch.requestWithToken('/auth', token).
            then(user => {
                if (localStorage) { localStorage.setItem('pi-base-session-token', token) }
                dispatch({type: LOGIN, user, token})
            })
    }
}

export function logout() {
    return (dispatch, getState) => {
        if (localStorage) { localStorage.removeItem('pi-base-session-token') }
        const { token } = getState()

        dispatch({ type: LOGOUT })
        return fetch.requestWithToken('/logout', token, { method: 'DELETE' })
    }
}

export function loadTrait(spaceId, propertyId) {
    return (dispatch, getState) => {
        const trait = T.find(getState(), spaceId, propertyId)

        if (!trait) {
            dispatch(fetch.trait(spaceId, propertyId))
        }
    }
}

// For now, unconditionally refresh
export function loadSpace(id) {
    return fetch.space(id)
}
export function loadProperty(id) {
    return fetch.property(id)
}
export function loadTheorem(id) {
    return fetch.theorem(id)
}
