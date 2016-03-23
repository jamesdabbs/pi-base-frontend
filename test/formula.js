import { parse } from '../src/formula.js'

it('can parse a simple formula', () => {
    expect(
        parse('Compact')
    ).to.eql({
        property: 'Compact',
        value: true
    })
})

it('handles whitespace', () => {
    expect(
        parse('   \t   Second Countable \n ')
    ).to.eql({
        property: 'Second Countable',
        value: true
    })
})

it('can negate properties', () => {
    expect(
        parse('not compact')
    ).to.eql({
        property: 'compact',
        value: false
    })
})

it('can parse conjunctions', () => {
    expect(
        parse('compact + connected + ~t_2')
    ).to.eql({
        and: [
            { property: 'compact',   value: true },
            { property: 'connected', value: true },
            { property: 't_2',       value: false }
        ]
    })
})

it('can parse nested formulae', () => {
    expect(
        parse('compact + (connected || not second countable) + ~first countable')
    ).to.eql({
        and: [
            { property: 'compact', value: true },
            { or: [
                { property: 'connected', value: true },
                { property: 'second countable', value: false }
            ]},
            { property: 'first countable', value: false }
        ]
    })
})
