import { createStore, applyMiddleware } from 'redux'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

import reducer from '../src/reducers'
import * as Search from '../src/reducers/search'
import { fetchComplete, FETCH_SPACE, fetchTraits, fetchProperties, fetchSpaces, search } from '../src/actions'
import * as S from '../src/reducers/spaces'

const init = reducer(undefined, {})

it('can load spaces', () => {
    const result = reducer(init, fetchComplete(FETCH_SPACE, [{
        proof_of_topology: null,
        name: "Finite Discrete Topology",
        id: 2,
        description: "What it says on the tin"
    }]))

    expect(
        result.spaces.get("entities").count()
    ).to.equal(1)
})

const makeStore = (state) => {
    return createStore(reducer, state, applyMiddleware(thunkMiddleware))
}

it('can load from API', (done) => {
    const store = makeStore()
    store.dispatch(fetchTraits()).then(() => {
        const state = store.getState()
        expect(state.traits.count()).to.eq(150)
        done()
    })
})

let prefetched
before((done) => {
    const store = makeStore()

    const unsub = store.subscribe((e) => {
        let state = store.getState()
        if (
            !state.spaces.get("fetching") &&
            !state.properties.get("fecthing") &&
            !state.traits.get("fetching") &&
            state.properties.get("entities").count() > 0
        ) {
            prefetched = state
            unsub()
            done()
        }
    })

    store.dispatch(fetchTraits())
    store.dispatch(fetchProperties())
    store.dispatch(fetchSpaces())
})

it('can run a search', () => {
    const store = makeStore(prefetched)
    store.dispatch(search('compact + t_2'))

    const results = Search.byFormula(store.getState())
    expect(results.count()).to.be.greaterThan(15)

    const hit = results.find(space => space.name.includes('Finite'))
    expect(hit.name).to.eq('Finite Discrete Topology')
})
