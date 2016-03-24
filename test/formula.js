import { parse } from '../src/formula.js'

it('can parse a simple formula', () => {
    expect(
        parse('Compact').toJSON()
    ).to.eql({
        property: 'Compact',
        value: true
    })
})

it('handles whitespace', () => {
    expect(
        parse('   \t   Second Countable \n ').toJSON()
    ).to.eql({
        property: 'Second Countable',
        value: true
    })
})

it('can negate properties', () => {
    expect(
        parse('not compact').toJSON()
    ).to.eql({
        property: 'compact',
        value: false
    })
})

it('can parse conjunctions', () => {
    expect(
        parse('compact + connected + ~t_2').toJSON()
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
        parse('compact + (connected || not second countable) + ~first countable').toJSON()
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

it('can map over formulae', () => {
    const parsed = parse('compact + (connected || not second countable) + ~first countable')
    const mapped = parsed.atomMap(atom => ({
        property: atom.property.length,
        value:    !atom.value
    })).toJSON()

    expect(mapped).to.eql({
        and: [
            { property: 7, value: false },
            { or: [
                { property: 9, value: false },
                { property: 16, value: true }
            ]},
            { property: 15, value: true }
        ]
    })
})
