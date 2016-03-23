import { Map } from 'immutable'

import * as fetch from '../fetch'

export default function traits(state=Map(), action) {
    return fetch.traits.reduceWith(data => data)(state, action)
}
