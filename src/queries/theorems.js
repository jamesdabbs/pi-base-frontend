import * as Property from './properties'
import * as Formula from '../formula'

export function find(state, id) {
    const found = state.theorems.getIn(['entities', ''+id])
    if (!found) { return }

    const fix = (f) => {
        if (!f) { return }
        if (f.toJS) { f = f.toJS() }
        return Formula.map(f, id => Property.find(state, id))
    }

    return found.merge({
        antecedent: fix(found.get('antecedent')),
        consequent: fix(found.get('consequent'))
    }).toJS()
}
