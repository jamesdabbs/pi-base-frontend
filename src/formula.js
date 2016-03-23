// TODO: this should be .pegjs with appropriate build tooling,
//       but I'm not sure how to get that to play nice with
//       the test environment
import parser from "./formula-parser.js"

export function parse(q) {
    try {
        return parser.parse(q)
    } catch (e) {
        if (q && q.startsWith('(')) {
            return null
        } else {
            return parse('(' + q + ')')
        }
    }
}

export function map(formula, func) {
    if (!formula) { return formula }

    if (formula.and) {
        return { and: formula.and.map(sf => map(sf, func)) }
    } else if (formula.or) {
        return { or: formula.or.map(sf => map(sf, func)) }
    } else {
        return { property: func(formula.property), value: formula.value }
    }
}
