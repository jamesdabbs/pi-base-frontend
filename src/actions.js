export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const CREATE_SPACE = 'CREATE_SPACE'

export function login(email, password) {
    return { type: LOGIN, email, password }
}

export function logout() {
    return { type: LOGOUT }
}

export function createSpace(title, description) {
    return { type: CREATE_SPACE, title, description }
}
