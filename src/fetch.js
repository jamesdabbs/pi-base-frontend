let fetch
if (typeof(fetch) === 'undefined') {
    fetch = require('node-fetch')
}

const root = "http://localhost:8081"

const FETCH_STARTED  = 'FETCH_STARTED'
const FETCH_COMPLETE = 'FETCH_COMPLETE'
const FETCH_FAILED   = 'FETCH_FAILED'

const SPACES     = 'FETCH_SPACES'
const PROPERTIES = 'FETCH_PROPERTIES'
const TRAITS     = 'FETCH_TRAITS'
const SPACE      = 'FETCH_SPACE'

const fetchStarted  = (type)        => ({ type,        state: FETCH_STARTED  })
const fetchComplete = (type, data)  => ({ type, data,  state: FETCH_COMPLETE })
const fetchFailed   = (type, error) => ({ type, error, state: FETCH_FAILED   })

export const requestWithToken = (endpoint, token, opts={}) => {
    opts.headers = new Headers({
        'Content-Type':  'application/json',
        'Authorization': `bearer ${token}`
    })
    return fetch(`${root}${endpoint}`, opts).then(r => r.json())
}


const reducer = (type, onComplete) => (state, action) => {
    if (type !== action.type) { return state }

    switch (action.state) {
    case FETCH_STARTED:
        return state.merge({ fetching: true })
    case FETCH_COMPLETE:
        return state.merge({ fetching: false }).merge(onComplete(action.data))
    case FETCH_FAILED:
        console.error(`Fetch error`, action.error)
        return state.merge({ fetching: false })
    default:
        return {}
    }
}


const loader = (type, getUrl) => {
    let runner = (...urlArgs) => dispatch => {
        let url = getUrl(...urlArgs)
        dispatch(fetchStarted(type))
        return fetch(`${root}${url}`)
            .catch(e => dispatch(fetchFailed(type, e)))
            .then(req => req.json())
            .then(json => dispatch(fetchComplete(type, json)))
    }

    runner.reduceWith = (fn) => reducer(type, fn)

    return runner
}


export const space      = loader(SPACE, (id) => `/spaces/${id}`)

export const spaces     = loader(SPACES,     () => '/spaces')
export const properties = loader(PROPERTIES, () => '/properties')
export const traits     = loader(TRAITS,     () => '/universe')
