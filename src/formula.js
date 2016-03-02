import parser from "./formula-parser.pegjs"

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
