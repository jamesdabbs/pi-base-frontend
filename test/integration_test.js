import { expect } from 'chai'

import { makeStore } from '../src/store'

import * as Search from '../src/reducers/search'
import * as fetch from '../src/fetch'
import { search } from '../src/actions'

let prefetched
before((done) => {
    const store = makeStore()

    const unsub = store.subscribe(() => {
        const state = store.getState()
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

    store.dispatch(fetch.traits())
    store.dispatch(fetch.properties())
    store.dispatch(fetch.spaces())
})

it('can run a search', () => {
    const store = makeStore(prefetched)
    store.dispatch(search('compact + t_2'))

    const results = Search.results(store.getState())
    expect(results.count()).to.be.greaterThan(15)

    const hit = results.find(space => space.name.includes('Finite'))
    expect(hit.name).to.eq('Finite Discrete Topology')
})

Search.examples.forEach(ex => {
    it(`finds some results for example: ${ex}`, () => {
        const store = makeStore(prefetched)
        store.dispatch(search(ex))

        const results = Search.results(store.getState())
        expect(results.count()).to.be.greaterThan(3)
    })
})

it('can expand the search formula', () => {
    const store = makeStore(prefetched)
    store.dispatch(search('compact + t_2'))

    const formula = Search.formulaWithProperties(store.getState())
    expect(formula.subs[0].property.name).to.eql('Compact')
    expect(formula.subs[0].property.id).to.eql(16)
    expect(formula.subs[1].property.name).to.eql('$T_2$')
    expect(formula.subs[1].property.id).to.eql(3)
})
